/**
 * 多选下拉表格组件，后端翻译（后端详情返回），后端联想
 */
import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { Select, Pagination, Divider } from 'antd';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import styles from './index.less';

const { Option } = Select;
export interface ZsfMulitSelectDpTableProps {
  dataSourceModel: string;
  fetchParams?: any;
  searchType?: any;
  dispatch?: Dispatch;
  value?: any;
  selectWidth?: any;
  optionWidth?: any;
  dataId?: any;
  placeholder?: any;
  loading?: any;
  disabled?: boolean;
  columns: any[];
  showAllLineData?: any;
  dataType?: any;
  onChange?: (value?: any) => void;
}
// 全局变量
let keyIndex = 0; // 设置map函数的key值
let selectWidthNew = '270px'; // 设置选择框宽度，默认为270px
let optionWidthNew = '270px'; // 设置option的宽度，默认为270px
let currentInputValue = ''; // 暂存当前input框输入的筛选值
let initDataSource: any[]; // 暂存初始化数据
let initPagination = { total: 0, pageSize: 10, current: 1 }; // 暂存初始化分页信息

const ZsfMulitSelectDpTable: React.FC<ZsfMulitSelectDpTableProps> = (props) => {
  const {
    dispatch,
    selectWidth,
    optionWidth,
    // dataSourceModel,
    fetchParams,
    searchType,
    value,
    dataId,
    disabled,
    placeholder,
    // loading,
    columns,
    showAllLineData,
    dataType,
    onChange,
  } = props;
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    pageSize: number;
    current: number;
  }>({ total: 0, pageSize: 10, current: 1 });
  const [isHadFetched, setIsHadFetched] = useState(false);
  const cellWidth = `${100 / props.columns.length}%`; // 获取单元格宽度
  // 设置选择框和option宽度
  if (selectWidth) {
    if (selectWidth.charAt(selectWidth.length - 1) === '%') {
      selectWidthNew = selectWidth;
    } else {
      selectWidthNew = `${selectWidth}px`;
    }
  }
  if (optionWidth) {
    optionWidthNew = `${optionWidth}px`;
  }

  /**
   * 数据请求
   * @param action 请求接口方式 ‘init’ 代表初始化
   * @param current 当前第几页
   * @param pageSize 一页多少条数据展示
   * @param inputValue 模糊查询参数值
   */
  const fetchData = (action?: string, current?: any, pageSize?: number, inputValue?: any) => {
    const newPagination = { current, pageSize };
    const newFetchParams = { ...(fetchParams || {}), [searchType]: inputValue };
    const request = {
      ...newFetchParams,
      ...newPagination,
    };
    if (dispatch) {
      dispatch({
        type: 'zsfDpTableModel/fetchList',
        payload: { ...request },
        callback: (res) => {
          if (action === 'init') {
            initDataSource = res.data || [];
            initPagination = res.pagination;
            console.log('&&&&进来', initPagination);
            const pagination2 =
              value && value.length > 0
                ? {
                    total: value.length,
                    current: 1,
                    pageSize: 10,
                  }
                : res.pagination;
            setDataSource(value && value.length > 0 ? value : res.data || []);
            setPagination(pagination2);
            setIsHadFetched(true);
            return;
          }
          setDataSource(res.data || []);
          setPagination(res.pagination);
          setIsHadFetched(true);
        },
      });
    }
  };

  /**
   * 初始化
   */
  useEffect(() => {
    console.log('进来了');
    // 初始化请求第一页数据
    fetchData('init', 1, 10, null);
  }, []);

  /**
   * 搜索框输入
   */
  const onInputing = debounce((inputValue?: any) => {
    currentInputValue = inputValue;
    fetchData('search', 1, 10, inputValue);
  }, 800);

  // 下拉点选
  const handleChange = (selectedArr?: any, data?: any) => {
    const newSelectedArr = data.map((item?: any) => {
      return item.props.optionrecords;
    });
    if (onChange) {
      onChange(newSelectedArr);
    }
  };

  /**
   * 聚焦时初始化数据
   */
  const onFocusHandle = () => {
    currentInputValue = '';
    console.log('&&&&', initPagination);
    setDataSource(initDataSource);
    setPagination(initPagination);
  };

  /**
   * 翻页
   */
  const onPageChange = (current?: any, pageSize?: any) => {
    fetchData('pageChange', current, pageSize, currentInputValue);
  };

  /**
   * 数据渲染
   */
  if (isHadFetched) {
    const { total, pageSize, current } = pagination;
    // 组装分页参数
    const paginationProps = {
      total,
      current,
      defaultPageSize: pageSize,
      hideOnSinglePage: total <= 10,
      showTotal: () => {
        return `共 ${total || 0} 条数据`;
      },
      onChange: (nextPageIndex?: any, nextPageSize?: any) => {
        onPageChange(nextPageIndex, nextPageSize);
      },
    };
    // 返显数据组装
    let newValue;
    if (!value) {
      newValue = [];
    } else {
      newValue = value.map((item?: any) => {
        return item[dataId];
      });
    }
    return (
      <Fragment>
        <Select
          maxTagCount={100}
          value={newValue}
          mode="multiple"
          disabled={disabled}
          filterOption={false}
          notFoundContent={null}
          allowClear
          dropdownMatchSelectWidth={false}
          placeholder={placeholder || ''}
          dropdownClassName={styles.dropdown}
          style={{ width: selectWidthNew, maxHeight: '150px', overflowY: 'auto' }}
          onChange={handleChange}
          onSearch={onInputing}
          onFocus={onFocusHandle}
          optionLabelProp="label"
        >
          {/* 表头 */}
          <Option value="titles" disabled style={{ width: optionWidthNew }}>
            {/* <Spin> */}
            {columns.map((item) => (
              <div
                key={item.dataIndex}
                className={styles.lineItemHead}
                style={{ width: cellWidth }}
              >
                {item.title}
              </div>
            ))}
            {/* </Spin> */}
            <Divider className={styles.divider} />
          </Option>
          {/* 表格数据 */}
          {dataSource &&
            dataSource.map((item?: any) => {
              keyIndex += 1;
              return (
                <Option
                  value={item[dataId]}
                  key={keyIndex}
                  style={{ width: optionWidthNew }}
                  label={showAllLineData ? `${item[dataType]}/${item[dataId]}` : item[dataType]}
                  optionrecords={item}
                >
                  {columns.map((i?: any) => {
                    keyIndex += 1;
                    return (
                      <div key={keyIndex} className={styles.lineItem} style={{ width: cellWidth }}>
                        {item[i.dataIndex]}
                      </div>
                    );
                  })}
                </Option>
              );
            })}
          {/* 分页 */}
          <Option
            value="paginations"
            disabled
            className={styles.disabledOption}
            style={{ width: optionWidthNew }}
          >
            {total > 10 && (
              <Fragment>
                <Divider className={styles.divider} />
                <Pagination {...paginationProps} size="small" />
              </Fragment>
            )}
          </Option>
        </Select>
      </Fragment>
    );
  }
  return null;
};

export default connect()(ZsfMulitSelectDpTable);
