/**
 * 下拉表格组件(后端模糊查询匹配，后端分页)
 */
import React, { Fragment, PureComponent } from 'react';
import { connect } from 'umi';
import type { Dispatch } from 'umi';
import { Divider, Pagination, Select, Tooltip } from 'antd';
// import type { UserModelState2 } from './model';
import type { UserModelState2 } from '@/models/zsfDpTable';
// import type { UserModelState } from '@/pages/Zsfcomponents/model';
import styles from './index.less';

const { Option } = Select;
export interface ZsfDpTableProps {
  dispatch?: Dispatch;
  aatest?: any;
  resbody?: any;
  disabled?: boolean;
  placeholder?: string;
  selectStyle?: any;
  columns?: any;
  dataId?: any;
  optionWidth?: any;
  dataSourceModel: string;
  fetchParams?: any;
  dataType?: any;
  filterArr?: any;
  showAllLineData?: any;
  dataCode?: any;
  value?: any;
  fetchOnlyFilterArr?: any;
  editOption?: any;
  onFocusUpload?: () => void;
  onChange?: (value?: any) => void;
  dpTableOnChange?: (record?: any, editOption?: any, allowClear?: any) => void;
}
interface ZsfDpTableState {
  dataSource?: any[];
  pagination?: any;
  loading?: boolean;
}

class ZsfDpTable extends PureComponent<ZsfDpTableProps, ZsfDpTableState> {
  widths: string;
  firstPageDataSource: never[];
  firstPagePagination: any;
  mapKey: number;
  showAllValue: string;
  currentInputvalue: string;
  constructor(props: ZsfDpTableProps) {
    super(props);
    this.state = {
      dataSource: [], // 下拉表格
      pagination: {}, // 分页参数
      loading: false,
    };
    this.firstPageDataSource = []; // 暂存首页数据
    this.firstPagePagination = {}; // 暂存首页分页参数
    this.mapKey = 0; // 设置map的key的标记位
    this.widths = `${100 / props.columns.length}%`; // 均分表格宽度
    this.showAllValue = ''; // select展示所有参数
    this.currentInputvalue = ''; // 当前筛选的inputvalue值,筛选后点击下一页需要带上入参
  }

  componentDidMount() {
    this.fetchData(1, 10, '', 'init');
  }
  /**
   * 请求数据
   */
  fetchData = (current?: number, pageSize?: number, inputValue?: any, action?: string) => {
    const {
      dispatch,
      dataSourceModel,
      fetchParams,
      dataType,
      filterArr,
      showAllLineData,
      dataCode,
      value,
      columns,
      fetchOnlyFilterArr,
    } = this.props;
    const initPagination = { current, pageSize };
    console.log('**', initPagination);
    let newFetchParams;
    if (action === 'init') {
      if (showAllLineData && value != null) {
        newFetchParams = { ...(fetchParams || { [dataCode]: value[dataCode] }) };
      } else {
        newFetchParams = { ...(fetchParams || {}) };
      }
    } else {
      const filterArrObj = {};
      if (filterArr && filterArr.length > 0) {
        filterArr.forEach((item?: any) => {
          filterArrObj[item] = inputValue;
        });
      }
      if (fetchOnlyFilterArr) {
        newFetchParams = { ...(fetchParams || {}), ...filterArrObj };
      } else {
        newFetchParams = { ...(fetchParams || {}), ...filterArrObj, [dataType]: inputValue };
      }
    }
    const request = {
      ...newFetchParams,
      ...initPagination,
    };
    console.log('**)))', initPagination);
    this.setState({
      loading: true,
    });
    if (dispatch) {
      dispatch({
        type: dataSourceModel,
        payload: { ...request },
        callback: (res) => {
          if (action === 'init' && this.firstPageDataSource.length <= 0) {
            this.firstPageDataSource = res.data;
            this.firstPagePagination = res.pagination;
          }
          // 如果需要显示全部数据，就拼接当前行数据
          if (action === 'init' && showAllLineData) {
            this.showAllValue = '';
            // 拼接展示当前行数据
            for (let i = 0; i < columns.length; i += 1) {
              if (i === columns.length - 1) {
                this.showAllValue += `${res.data[0][columns[i]].dataIndex}`;
                break;
              }
              this.showAllValue += `${res.data[0][columns[i]].dataIndex}/`;
            }
          }
          this.setState({
            dataSource: res.data || [],
            pagination: res.pagination,
            loading: false,
          });
        },
      });
    }
  };

  /**
   * 翻页
   * @param value
   * @param record
   */
  onPageChange = (current?: any, pageSize?: any) => {
    console.log(current, pageSize);
    this.fetchData(current, pageSize, this.currentInputvalue);
  };

  /**
   * 搜索框输入
   */
  onInputing = (inputValue?: any) => {
    this.currentInputvalue = inputValue;
    this.fetchData(1, 10, inputValue);
  };

  /**
   * 点击选中的下拉列表
   * @returns
   */
  onSelectRecord = (value?: string, record?: string) => {
    const {
      onChange,
      dpTableOnChange,
      showAllLineData,
      columns,
      editOption, // 可编辑表格中用于关联反显相关单元格
    } = this.props;
    // 全部清除
    if (value === 'allowClear') {
      if (onChange) {
        this.showAllValue = '';
        onChange({});
      }
      if (dpTableOnChange) {
        dpTableOnChange(record, editOption, 'allowClear');
      }
      return;
    }
    // 组装当前行全部数据
    if (showAllLineData && record) {
      this.showAllValue = '';
      // 拼接展示当前行数据
      for (let i = 0; i < columns.length; i += 1) {
        if (i === columns.length - 1) {
          this.showAllValue += `${record[columns[i].dataIndex]}`;
          break;
        }
        this.showAllValue += `${record[columns[i].dataIndex]}`;
      }
    }
    // 获取当前行数据处理关掉单元格返显数据
    if (dpTableOnChange && record) {
      dpTableOnChange(record, editOption);
    }
    if (onChange && record) {
      onChange(record);
    }
  };

  /**
   * 聚焦时重置当前下拉框数据为第一页
   * @returns
   */
  onFocusHandle = () => {
    const { onFocusUpload } = this.props;
    if (onFocusUpload) {
      this.fetchData(1, 10, '', 'init');
      return;
    }
    this.currentInputvalue = '';
    this.setState({
      dataSource: this.firstPageDataSource,
      pagination: this.firstPagePagination,
    });
  };

  render() {
    const {
      value, // select value值
      dataId, // 当前行唯一标识
      dataType, // 默认展示的数据类型
      dataCode, // 后台存储的code
      columns, // 列表表头
      optionWidth, // option的宽度
      disabled, // 设置下拉列表不可编辑
      selectStyle, // 选择框的样式
      placeholder, // 提示语，默认是：请输入
    } = this.props;
    const {
      dataSource,
      loading,
      pagination: { total, pageSize, current },
    } = this.state;
    // 组装分页
    const paginationProps = {
      total,
      current,
      defaultPageSize: pageSize,
      hideOnSinglePage: total <= 10 && true,
      showTotal: () => {
        return `共 ${total || 0} 条数据`;
      },
      onChange: (nextPageIndex?: any, nextPageSize?: any) => {
        this.onPageChange(nextPageIndex, nextPageSize);
      },
    };
    let showValue: string = '';
    if (!value) {
      // 关联QueryForm
      showValue = '';
    } else {
      showValue = this.showAllValue || value[dataType] || value[dataCode] || '';
    }
    return (
      <Fragment>
        <Select
          onFocus={this.onFocusHandle}
          disabled={disabled}
          allowClear
          dropdownClassName={styles.dpTable}
          loading={loading}
          showSearch
          placeholder={placeholder || '请输入'}
          showArrow={false}
          filterOption={false}
          value={value ? value[dataId] : ''}
          optionLabelProp="label" // 展示label组装内容
          dropdownMatchSelectWidth={false}
          style={selectStyle || { width: '260px' }}
          onSearch={(inputValue) => {
            this.onInputing(inputValue);
          }}
          onChange={(optionValue, optionProps?: any) => {
            // 全部清除
            if (!optionValue) {
              this.onSelectRecord('allowClear');
              return;
            }
            // 选中下拉框选项
            this.onSelectRecord(optionValue, optionProps.props.optionrecord);
          }}
        >
          <Option value="columnsTitle" disabled style={optionWidth}>
            {columns.map((item?: any) => {
              return (
                <div
                  key={item.dataIndex}
                  className={styles.lineItemHead}
                  style={{ width: this.widths }}
                >
                  {item.title}
                </div>
              );
            })}
            <Divider className={styles.divider} />
          </Option>
          {dataSource &&
            dataSource.map((item?: any) => {
              this.mapKey += 1;
              return (
                <Option
                  value={item[dataId]}
                  key={this.mapKey}
                  optionrecord={item}
                  style={optionWidth}
                  label={showValue}
                >
                  {columns.map((i?: any) => {
                    this.mapKey += 1;
                    if (i.render) {
                      return (
                        <div
                          key={this.mapKey}
                          className={styles.lineItem}
                          style={{ width: this.widths }}
                        >
                          {i.render(item)}
                        </div>
                      );
                    }
                    if (item[i.dataIndex] && item[i.dataIndex].length > 0) {
                      return (
                        <Tooltip title={item[i.dataIndex]} key={this.mapKey}>
                          <div
                            key={this.mapKey}
                            className={styles.lineItem}
                            style={{ width: this.widths }}
                          >
                            {item[i.dataIndex]}
                          </div>
                        </Tooltip>
                      );
                    }
                    return (
                      <div
                        key={this.mapKey}
                        className={styles.lineItem}
                        style={{ width: this.widths }}
                      >
                        {item[i.dataIndex]}
                      </div>
                    );
                  })}
                </Option>
              );
            })}
          <Option value="paginations" disabled className={styles.disabledOption}>
            {dataSource && dataSource.length > 10 && <Divider className={styles.divider} />}
            <Pagination {...paginationProps} size="small" />
          </Option>
        </Select>
      </Fragment>
    );
  }
}
// export default connect()(ZsfDpTable) 可行 连公共connect

// export default connect(({ zsfcomponentsModel }: { zsfcomponentsModel: UserModelState }) => ({
//   aatest: zsfcomponentsModel.aatest,
//   resbody: zsfcomponentsModel.resbody,
// }))(ZsfDpTable); 不可行？？

export default connect(({ zsfDpTableModel }: { zsfDpTableModel: UserModelState2 }) => ({
  aatest: zsfDpTableModel.aatest,
}))(ZsfDpTable);
