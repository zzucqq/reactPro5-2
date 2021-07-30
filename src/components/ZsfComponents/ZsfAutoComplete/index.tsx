/**
 * 下拉表格组件(后端模糊查询匹配，后端分页),支持输入查询
 */
import React from 'react';
import { useState, useEffect } from 'react';
import { connect } from 'umi';
import type { Dispatch } from 'umi';
import { AutoComplete, Divider, Pagination, Tooltip } from 'antd';
import debounce from 'lodash/debounce';
import styles from './index.less';

const { Option } = AutoComplete;
export interface ZsfAutoCompleteProps {
  dataSourceModel: string;
  columns: any[]; // 列表表头
  selectStyle?: object; // 选择框的样式
  optionWidth?: object; // option的宽度
  fetchParams?: object; // 父组件传参数
  dataType?: any; // 当前行展示中文
  editOption?: any;
  value?: any;
  dispatch?: Dispatch<any>;
  onChange?: (value?: any) => void;
  autoCompleteonInputing?: (value?: any) => void;
  autoCompleteOnChange?: (value?: any, editOption?: any, option?: any) => void;
}

let firstPageDataSource = []; // 暂存首页数据
// let firstPagePagination = {}; // 暂存首页分页参数
let mapKey = 0; // 设置map的key的标记位
const currentInputvalue = ''; // 当前筛选的inputvalue值,筛选后点击下一页需要带上入参

const ZsfAutoComplete: React.FC<ZsfAutoCompleteProps> = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState<{
    total: number;
    pageSize: number;
    current: number;
  }>({ total: 0, pageSize: 10, current: 1 });
  const {
    dataSourceModel,
    columns, // 列表表头
    selectStyle, // 选择框的样式
    optionWidth, // option的宽度
    dataType, // 当前行展示中文
    value,
    editOption,
    fetchParams,
    dispatch,
    onChange,
    autoCompleteonInputing,
    autoCompleteOnChange,
  } = props;
  const widths = `${100 / props.columns.length}%`; // 均分表格宽度

  /**
   * 请求列表数据
   * @param action 请求接口方式 ‘init’ 代表初始化
   * @param current 当前第几页
   * @param pageSize 一页多少条数据展示
   * @param inputValue 模糊查询参数值
   */
  const fetchData = (current?: any, pageSize?: number, inputValue?: any, action?: string) => {
    const initPagination = { current, pageSize };
    let newFetchParams;
    if (action === 'init') {
      newFetchParams = { ...(fetchParams || {}) };
    } else {
      newFetchParams = { ...(fetchParams || {}), [dataType]: inputValue };
    }
    // 参数组装
    const request = {
      ...newFetchParams,
      ...initPagination,
    };
    if (dispatch) {
      dispatch({
        type: dataSourceModel,
        payload: { ...request },
        callback: (res) => {
          const { data, pagination: pagination2 } = res;
          if (action === 'init' && firstPageDataSource.length <= 0) {
            firstPageDataSource = data;
            // firstPagePagination = pagination2;
          }
          setDataSource(data || []);
          setPagination(pagination2);
        },
      });
    }
  };

  useEffect(() => {
    fetchData(1, 10, '', 'init');
  }, []);

  /**
   * 搜索框输入
   */
  const onInputing = debounce((inputValue?: any) => {
    if (onChange) {
      onChange(inputValue);
    }
    if (autoCompleteonInputing) {
      autoCompleteonInputing(inputValue);
    }
    if (autoCompleteOnChange) {
      autoCompleteOnChange('input', editOption);
    }
  }, 800);

  /**
   * 翻页
   */
  const onPageChange = (current?: any, pageSize?: any) => {
    fetchData(current, pageSize, currentInputvalue);
  };

  /**
   * 下拉点选
   */
  const onSelectHandle = (value2?: any, option?: any) => {
    if (onChange) {
      onChange(option.props.optionrecord[dataType]);
    }
    if (autoCompleteOnChange) {
      autoCompleteOnChange('select', editOption, option);
    }
  };

  /**
   * 数据渲染
   */
  // 组装分页参数
  const { total, pageSize, current } = pagination;
  const paginationProps = {
    total,
    current,
    defaultPageSize: pageSize,
    hideOnSinglePage: total <= 10 && true,
    showTotal: () => {
      return `共 ${total || 0} 条数据`;
    },
    onChange: (nextPageIndex?: any, nextPageSize?: any) => {
      onPageChange(nextPageIndex, nextPageSize);
    },
  };

  // 表头
  const options = [
    <Option value="columnsTitle" key="oo" disabled style={optionWidth}>
      {columns.map((item) => {
        return (
          <div key={item.dataIndex} className={styles.lineItemHead} style={{ width: widths }}>
            {item.title}
          </div>
        );
      })}
      <Divider className={styles.divider} />
    </Option>,
  ]
    // 内容
    .concat(
      dataSource.map((item?: any) => {
        mapKey += 1;
        return (
          <Option value={item[dataType]} key={mapKey} optionrecord={item} style={optionWidth}>
            {columns.map((i) => {
              mapKey += 1;
              if (i.render) {
                return (
                  <div key={mapKey} className={styles.lineItem} style={{ width: widths }}>
                    {i.render(item)}
                  </div>
                );
              }
              if (item[i.dataIndex] && item[i.dataIndex].length > 10) {
                return (
                  <Tooltip title={item[i.dataIndex]}>
                    <div key={mapKey} className={styles.lineItem} style={{ width: widths }}>
                      {item[i.dataIndex]}
                    </div>
                  </Tooltip>
                );
              }
              return (
                <div key={mapKey} className={styles.lineItem} style={{ width: widths }}>
                  {item[i.dataIndex]}
                </div>
              );
            })}
          </Option>
        );
      }),
    )
    // 分页
    .concat([
      <Option value="paginations" key="pp" disabled className={styles.disabledOption}>
        {dataSource && dataSource.length > 10 && <Divider className={styles.divider} />}
        {total > 10 && <Pagination {...paginationProps} size="small" />}
      </Option>,
    ]);

  return (
    <AutoComplete
      allowClear
      dropdownClassName={styles.AutoCompleteDp}
      dropdownMatchSelectWidth={false}
      style={selectStyle}
      dataSource={options}
      onSearch={onInputing}
      onSelect={onSelectHandle}
      defaultValue={value}
    />
  );
};
export default connect(({ loading }: { loading: { effects: Record<string, boolean> } }) => ({
  submitting: loading.effects['zsfDpTableModel/fetchList'],
}))(ZsfAutoComplete);
