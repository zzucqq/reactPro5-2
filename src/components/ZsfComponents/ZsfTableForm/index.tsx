/**
 * 可编辑表格组件，绑定Form，关联
 * input
 * inputNum
 * select
 * dicsel
 * datePicker
 * switch
 * provinceCity
 * ProvinceCityArea
 * 小U
 * dpTable
 * rangePicker
 * timePicker
 * ZsfAutoComplete
 */
import React, { PureComponent, Fragment } from 'react';
import moment from 'moment'; // 设置日期格式
import {
  Table,
  Button,
  Input,
  InputNumber,
  Popconfirm,
  Divider,
  Switch,
  Form,
  Select,
  DatePicker,
  Modal,
  TimePicker,
  Tooltip,
} from 'antd';
import { ContainerOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import numeral from 'numeral'; // 数据格式化
// import uuid from 'uuid'; // 设置当前行唯一id
import { v4 as uuidv4 } from 'uuid';
import TooltipTitle from '../Tips/TableToolTip';
import ZsfDpTable from '../ZsfDpTable'; // 下拉表格组件
import ZsfAutoComplete from '../ZsfAutoComplete'; // 下拉表格输入组件
import Dicsel from './Dicsel'; // 下拉字典项组件
import ProvinceCity from '../ZsfProvinceCity'; // 省市，组件
import ProvinceCityArea from '../ZsfProvinceCityArea'; // 省市区组件
// import ModifyTraceTagListInfo from '@/pages/Utils/ModifyTraceTagListInfo'; // 查询小U是否有变更组件
// import ModifyTraceModal from '@/pages/Utils/ModifyTraceModal'; // 小U弹框组件

// import CustomRelationTraceTagListInfo from '@/pages/CustomRelationCenter/CustomRelationManage/untils/CustomRelationTraceTagListInfo'; // 查询小U是否有变更组件
// import CustInfoModifyModal from '@/pages/CustomRelationCenter/CustomRelationManage/untils/CustInfoModifyModal'; // 小U弹框组件

import InputCellDetail from './components/InputCellDetail'; // input单元格详情组件
import InputNumCellDetail from './components/InputNumCellDetail'; // inputNum单元格详情组件
import MulitSelectDpTable from '../ZsfMulitSelectDpTable';
import { getDicData } from '@/utils/initDic'; // 获取下拉字典项对应options的方法
import styles from './index.less';
import { checkNull } from '@/utils/functions/validation';
import LineWrap from '../LineWrap';
import InputToolTip from '../InputToolTip';

uuidv4();
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
export interface ZsfTableFormProps {
  form?: any;
  value?: any;
  initValueCanDelete?: any;
  columns: any[];
  showNumber?: boolean;
  tableFormDisbale?: boolean;
  switchChangeDisable?: boolean;
  moduleType?: any;
  scroll?: any;
  needColumnsAction?: any;
  queryXiaoUParam?: any;
  hideDelete?: any;
  userOperation?: any;
  showExtraBtn?: any; // 父组件展示除 保存 编辑 删除 取消 以外的按钮
  showExtraBtnTitle?: any;
  showExtraBtntrue?: any; // 查看按钮是否一直展示
  showExtraPage?: any;
  sequenceTitle?: any; // 序号别名
  defaultNewLineData?: any;
  addHideData?: any;
  relyOnData?: any;
  connectArr?: any;
  connectClearArr?: any;
  autoCompleteArr?: any;
  changeColumns?: any;
  buttonContent?: any;
  needBatchDelete?: any;
  needAddNewLine?: any;
  loading?: any;
  fromPage?: any;
  selectChangeClearColumns?: any[];
  onChange?: (value?: any) => void;
  getAction?: (value?: any, value2?: any, value3?: any) => void;
  getCurrentLineIndex?: (value?: any) => void;
  fetchData?: (value?: any, value2?: any, value3?: any) => Promise<unknown>;
  deleteLineCb?: (value?: any) => void;
  dicselOnChange?: (value?: any, value2?: any, value3?: any, value4?: any) => void;
  selectOnChange?: (value?: any, value2?: any, value3?: any) => void;
  inputNumOnChange?: (value?: any, value2?: any, value3?: any, value4?: any, value5?: any) => void;
  inputOnChange?: (value?: any, value2?: any) => void;
  toPreTableTagTraces?: (value?: any) => void;
}
export interface ZsfTableFormState {
  selectedRows: any[];
  xiaoUid?: any;
  showXiaoU?: any;
  xiaoIid?: any;
  showXiaoI?: any;
}
export interface IRowSelection {
  onSelect?: (value?: any, value2?: any, value3?: any) => void;
  onSelectAll?: (value?: any, value2?: any) => void;
}
export interface IStorageSwitch {
  switchName?: any;
  switchValue?: any;
}

class ZsfTableForm extends PureComponent<ZsfTableFormProps, ZsfTableFormState> {
  columns: any[];
  index: number;
  rowSelection: IRowSelection;
  onEditingState: boolean;
  storageSwitch: IStorageSwitch;
  formRef: React.RefObject<any>;
  constructor(props: ZsfTableFormProps) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      selectedRows: [], // 选中的行数据
    };
    this.columns = []; // 组装完整表格表头
    this.index = 0; // 设置新增行数据的唯一标识key
    this.rowSelection = {
      // 批量删除函数配置
      onSelect: this.rowOnSelect, // 用户手动选择/取消选择某行的回调
      onSelectAll: this.rowOnSelectAll, // 用户手动选择/取消选择所有行的回调
    };
    this.onEditingState = false; // 是否在编辑状态
    this.storageSwitch = {}; // 编辑状态下暂存switch
  }

  componentDidMount() {
    // 页面初始化设置初始状态
    const { value, onChange, initValueCanDelete, columns } = this.props;
    let newData: any[] = [];
    if (value) {
      newData = [...value];
    }
    const mulitDpTableArr = [];
    const dpTableArr = [];
    if (columns && columns.length > 0) {
      columns.forEach((columnsItem) => {
        if (columnsItem.renderType === 'dpTable') {
          dpTableArr.push(columnsItem);
        }
        if (columnsItem.renderType === 'mulitDpTable') {
          mulitDpTableArr.push(columnsItem);
        }
      });
    }
    // eslint-disable-next-line no-unused-vars
    if (newData && newData.length > 0) {
      newData.forEach((newDataItem?: any) => {
        // eslint-disable-next-line no-param-reassign
        Object.assign(newDataItem, {
          onEditing: false, // 初始化数据设置默认不在编辑状态
          isAddNewLine: false, // 初始化数据默认不是新增数据
          ableToDelete: initValueCanDelete !== undefined ? initValueCanDelete : true, // 初始化数据默认支持删除
        });
      });
    }
    if (onChange) {
      onChange(newData);
    }
  }

  // 获取表头数据，单元格元素
  getColumnsData = () => {
    const {
      columns,
      showNumber,
      tableFormDisbale,
      switchChangeDisable,
      moduleType,
      scroll,
      needColumnsAction,
      queryXiaoUParam,
      hideDelete,
      userOperation,
      showExtraBtn, // 父组件展示除 保存 编辑 删除 取消 以外的按钮
      showExtraBtnTitle,
      showExtraBtntrue, // 查看按钮是否一直展示
      showExtraPage,
      sequenceTitle, // 序号别名
    } = this.props;
    // 获取操作列
    const columnsAction = {
      align: 'center',
      title: TooltipTitle('操作', '记得点击下列表中的【保存】哦~~'),
      fixed: scroll ? 'right' : false,
      key: 'action',
      width: moduleType ? 200 : null,
      render: (value: any, record: any, index: number) => {
        return (
          <span>
            {(moduleType && !queryXiaoUParam) || record.showXiaoU ? (
              <Fragment>
                <span
                  style={{ fontSize: '14px', fontWeight: 600, color: '#f5222d', cursor: 'pointer' }}
                  onClick={() => {
                    this.xiaoU(record.id);
                  }}
                >
                  U&nbsp;&nbsp;
                </span>
                <Divider type="vertical" />
              </Fragment>
            ) : null}
            {(moduleType && !queryXiaoUParam) || record.showXiaoI ? (
              <Fragment>
                <span
                  style={{ fontSize: '14px', fontWeight: 600, color: '#f5222d', cursor: 'pointer' }}
                  onClick={() => {
                    this.xiaoI(record.id);
                  }}
                >
                  I&nbsp;&nbsp;
                </span>
                <Divider type="vertical" />
              </Fragment>
            ) : null}
            {record.onEditing ? (
              <a onClick={(e) => this.saveCurrentRow(e, index)}>保存</a>
            ) : (
              <Button
                type="link"
                onClick={(e) => this.editCurrentRow(e, index)}
                disabled={this.onEditingState || tableFormDisbale}
              >
                编辑
              </Button>
            )}
            {((record.onEditing && !record.isAddNewLine) || !hideDelete || record.isAddNewLine) && (
              <Divider type="vertical" />
            )}
            {record.onEditing && !record.isAddNewLine ? (
              <a onClick={(e) => this.cancelCurrentRow(e, index)}>取消</a>
            ) : (
              <Fragment>
                {(!hideDelete || record.isAddNewLine) && (
                  <Popconfirm
                    title="是否要删除此行？"
                    onConfirm={(e) => this.removeCurrentRow(e, index)}
                    disabled={!record.ableToDelete || tableFormDisbale}
                  >
                    <Button type="link" disabled={!record.ableToDelete || tableFormDisbale}>
                      删除
                    </Button>
                  </Popconfirm>
                )}
                {/* record.srvFeeRuleNo.rebateId 为项目协议准入-服务费详情查看 */}
                {showExtraBtn &&
                  (record.id || (record.srvFeeRuleNo && record.srvFeeRuleNo.rebateId)) && (
                    <Fragment>
                      <Divider type="vertical" />
                      {showExtraBtntrue ? ( // 一直展示按钮
                        <a onClick={() => showExtraPage(record)}>{showExtraBtnTitle}</a>
                      ) : (
                        <Button
                          type="link"
                          onClick={() => showExtraPage(record)}
                          disabled={this.onEditingState || tableFormDisbale}
                        >
                          {showExtraBtnTitle}
                        </Button>
                      )}
                    </Fragment>
                  )}
              </Fragment>
            )}
          </span>
        );
      },
    };
    // 获取序号列
    const columnsNum = {
      align: 'center',
      title: sequenceTitle || '序号',
      key: 'renderNum',
      render: (value: any, record: any, index: number) => {
        return index + 1;
      },
    };
    // 获取各个数据列
    this.columns = [...columns];
    this.columns.forEach((item) => {
      if (item.renderType === 'inputCellDetail') {
        // 加载InputCellDetail，input 单元格详情组件
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: any) => {
            if (record.onEditing) {
              const tableCell = `${item.dataIndex}@${index}`;
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  initialValue={value}
                  rules={item.rules}
                >
                  <InputCellDetail
                    editingDisable={item.editingDisable}
                    allowClear={!item.disabled}
                    specialDisabled={item.specialDisabled}
                    onChange={this.inputOnChange}
                    record={record}
                    clickHandle={() => {
                      item.clickHandle(value, record, index);
                    }}
                  />
                </FormItem>
              );
            }
            return (
              <Fragment>
                <span style={{ marginRight: '5%' }}>{value}</span>
                <Tooltip title={item.tooltipTit}>
                  <ContainerOutlined
                    style={{ color: '#08c', cursor: 'pointer' }}
                    onClick={() => {
                      item.clickHandle(value, record, index);
                    }}
                  />
                </Tooltip>
              </Fragment>
            );
          },
        });
      }
      if (item.renderType === 'InputNumCellDetail') {
        // 加载InputNumCellDetail，inputNum 单元格详情组件
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            if (record.onEditing) {
              const tableCell = `${item.dataIndex}@${index}`;
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  initialValue={value}
                  rules={item.rules}
                >
                  <InputNumCellDetail
                    editingDisable={item.editingDisable}
                    clickHandle={() => {
                      item.clickHandle(value, record, index);
                    }}
                  />
                </FormItem>
              );
            }
            return (
              <Fragment>
                <span style={{ marginRight: '5%' }}>
                  {item.inputNumberOptions.formatting ? numeral(value).format('0,0.00') : value}
                </span>
                <ContainerOutlined
                  style={{ color: '#08c', cursor: 'pointer' }}
                  onClick={() => {
                    item.clickHandle(value, record, index);
                  }}
                />
              </Fragment>
            );
          },
        });
      }
      if (item.renderType === 'input' && !item.hide) {
        // 加载input
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            if (record.onEditing) {
              const tableCell = `${item.dataIndex}@${index}`;
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  initialValue={value}
                  rules={item.rules}
                >
                  <Input
                    maxLength={item.maxLength || 100}
                    allowClear={!item.disabled}
                    disabled={item.disabled}
                    onChange={this.inputOnChange}
                    // inputoption={JSON.stringify({ record, index })}
                  />
                </FormItem>
              );
            }
            let InputDom = value;
            if (item.inputPorps) {
              InputDom = <InputToolTip value={value} inputPorps={item.inputPorps} />;
            }
            return item.contentHiddenInd && value && value.length > 10 ? (
              <LineWrap title={value} clampNum={10} />
            ) : (
              InputDom
            );
          },
        });
      }
      if (item.renderType === 'input' && item.hide) {
        // 加载input
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            const tableCell = `${item.dataIndex}@${index}`;
            return (
              <FormItem style={{ margin: 0 }} name={tableCell} initialValue={value}>
                <Input style={{ display: 'none' }} />
              </FormItem>
            );
          },
        });
      }
      if (item.renderType === 'inputNum') {
        // 加载inputNum
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            if (record.onEditing) {
              const tableCell = `${item.dataIndex}@${index}`;
              const sty = item.style ? item.style : { width: '100%' };
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  initialValue={value}
                  rules={item.rules}
                >
                  <InputNumber
                    style={sty}
                    disabled={item.disabled}
                    max={(item.inputNumberOptions && item.inputNumberOptions.max) || Infinity}
                    min={
                      (item.inputNumberOptions && item.inputNumberOptions.min) === 0
                        ? 0
                        : item.inputNumberOptions.min || -Infinity
                    }
                    step={(item.inputNumberOptions && item.inputNumberOptions.step) || 1}
                    precision={(item.inputNumberOptions && item.inputNumberOptions.precision) || 0}
                    onChange={(currentValue) => {
                      this.inputNumOnChange(currentValue, record, index, tableCell);
                    }}
                    // inputnumoption={JSON.stringify({ record, index })}
                    // style={item.style}
                    formatter={
                      item.type
                        ? (val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : (val) => val
                    }
                    parser={item.type ? (val: any) => val.replace(/\$\s?|(,*)/g, '') : (val) => val}
                  />
                </FormItem>
              );
            }
            return item.inputNumberOptions.formatting ? numeral(value).format('0,0.00') : value;
          },
        });
      }
      if (item.renderType === 'select') {
        // 加载下拉选择框select
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            let showValue = value;
            if (value) {
              if (!item.mode) {
                // 有初始值，翻译
                item.selectOptions.forEach((itemOption?: any) => {
                  if (itemOption.value === value) {
                    showValue = itemOption.name;
                  }
                });
              } else {
                showValue = value.toString();
              }
            }
            if (record.onEditing) {
              const tableCell = `${item.dataIndex}@${index}`;
              if (item.mode) {
                return (
                  <FormItem
                    style={{ margin: 0 }}
                    name={tableCell}
                    initialValue={value}
                    rules={item.rules}
                  >
                    <Select
                      allowClear
                      mode="multiple"
                      disabled={item.disabled}
                      onChange={this.selectOnChange}
                    >
                      {item.selectOptions.map((i?: any) => {
                        return (
                          <Option
                            key={i.value}
                            value={i.value}
                            selectonchangeoption={{ record, index }}
                          >
                            {i.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                );
              }
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  initialValue={value}
                  rules={item.rules}
                >
                  <Select
                    allowClear={item.showAllowClear !== 'N'}
                    disabled={item.disabled}
                    onChange={this.selectOnChange}
                  >
                    {item.selectOptions.map((i?: any) => {
                      return (
                        <Option
                          key={i.value}
                          value={i.value}
                          selectonchangeoption={{ record, index }}
                        >
                          {i.name}
                        </Option>
                      );
                    })}
                  </Select>
                </FormItem>
              );
            }
            return showValue;
          },
        });
      }
      if (item.renderType === 'dicsel') {
        // 加载下拉字典项
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            if (record.onEditing) {
              const tableCell = `${item.dataIndex}@${index}`;
              if (item.mode) {
                return (
                  <FormItem
                    style={{ margin: 0 }}
                    name={tableCell}
                    initialValue={value || []}
                    rules={item.rules}
                  >
                    <Dicsel
                      mode={item.mode}
                      dicType={item.dicselOptions.dicType}
                      exclude={item.dicselOptions.exclude}
                      include={item.dicselOptions.include}
                      disabled={item.dicselOptions.disabled || item.disabled}
                      dicselOnChange={this.dicselOnChange}
                      dicselCurrentRecord={{
                        record,
                        index,
                        tableCell,
                      }}
                    />
                  </FormItem>
                );
              }
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  initialValue={value}
                  rules={item.rules}
                >
                  <Dicsel
                    dicType={item.dicselOptions.dicType}
                    exclude={item.dicselOptions.exclude}
                    disabled={item.dicselOptions.disabled || item.disabled}
                    dicselOnChange={this.dicselOnChange}
                    dicselCurrentRecord={{
                      record,
                      index,
                      tableCell,
                    }}
                    include={
                      item.dicselOptions.includeAll
                        ? item.dicselOptions.includeAll
                        : item.dicselOptions.include
                    }
                  />
                </FormItem>
              );
            }
            let dicTranslate = value;
            let result = '';
            if (typeof value === 'string') {
              getDicData()[item.dicselOptions.dicType].forEach((dicItem?: any) => {
                if (dicItem.k === value) {
                  dicTranslate = dicItem.v;
                }
              });
            } else if (!item.mode) {
              dicTranslate = value && typeof value === 'object' ? value.dicName : '';
            } else {
              if (value.dicVal) {
                value.dicVal.forEach((va?: any) => {
                  getDicData()[item.dicselOptions.dicType].forEach((dicItem?: any) => {
                    if (dicItem.k === va) {
                      result += `${dicItem.v},`;
                    }
                  });
                });
              } else {
                value.forEach((va?: any) => {
                  getDicData()[item.dicselOptions.dicType].forEach((dicItem?: any) => {
                    if (dicItem.k === va) {
                      result += `${dicItem.v},`;
                    }
                  });
                });
              }
              dicTranslate = result.substring(0, result.length - 1);
            }
            return dicTranslate;
          },
        });
      }
      if (item.renderType === 'datePOrTimeP') {
        // 加载datePOrTimeP 日期选择or时间选择
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            let newVal = null;
            if (value) {
              if (typeof value === 'object') {
                newVal = moment(value).format(item.datePickerFormat);
              } else if (value.length <= 5) {
                newVal = moment(new Date()).format('YYYY-MM-DD HH:mm').substr(0, 11) + value;
              } else {
                newVal = value.substr(0, 16);
              }
            }
            const timeVal = newVal ? newVal.substr(11, 5) : '';
            if (record.onEditing) {
              const tableCell = `${item.dataIndex}@${index}`;
              if (
                (item.passive === '02' && item.passiveIndex === index) ||
                (!item.passive && record.darkRate === '02')
              ) {
                let newDisabled = false;
                if (switchChangeDisable) {
                  // 失效生效设置时间不可修改
                  newDisabled =
                    (record.sts === 'A' && item.dataIndex === 'effectDt') ||
                    (record.sts === 'I' && item.dataIndex === 'endDt');
                }
                let showTime;
                if (item.datePickerFormat === 'YYYY-MM-DD HH:mm:ss') {
                  showTime = {
                    format: 'HH:mm:ss',
                  };
                }
                if (item.datePickerFormat === 'YYYY-MM-DD HH:mm') {
                  showTime = {
                    format: 'HH:mm',
                  };
                }
                return (
                  <FormItem
                    style={{ margin: 0 }}
                    name={tableCell}
                    initialValue={newVal ? moment(newVal, item.datePickerFormat) : null}
                    rules={item.rules}
                  >
                    <DatePicker
                      disabled={newDisabled || item.disabled}
                      showTime={showTime}
                      format={item.datePickerFormat}
                      disabledDate={item.disableBeforeTime ? this.disableBeforeTime : () => {}}
                    />
                  </FormItem>
                );
              }
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  initialValue={timeVal ? moment(timeVal, item.timePickerFormat) : null}
                  rules={item.rules}
                >
                  <TimePicker format={item.timePickerFormat} />
                </FormItem>
              );
            }
            if (
              (item.passive === '02' && item.passiveIndex === index) ||
              record.darkRate === '02'
            ) {
              // eslint-disable-next-line no-nested-ternary
              return newVal;
            }
            return timeVal;
          },
        });
      }
      if (item.renderType === 'datePicker') {
        // 加载datePicker 日期选择
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            if (record.onEditing) {
              const tableCell = `${item.dataIndex}@${index}`;
              let newDisabled = false;
              if (switchChangeDisable) {
                // 失效生效设置时间不可修改
                newDisabled =
                  (record.sts === 'A' && item.dataIndex === 'effectDt') ||
                  (record.sts === 'I' && item.dataIndex === 'endDt');
              }
              let showTime;
              if (item.datePickerFormat === 'YYYY-MM-DD HH:mm:ss') {
                showTime = {
                  format: 'HH:mm:ss',
                };
              }
              if (item.datePickerFormat === 'YYYY-MM-DD HH:mm') {
                showTime = {
                  format: 'HH:mm',
                };
              }
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  initialValue={value === null ? null : moment(value, item.datePickerFormat)}
                  rules={item.rules}
                >
                  <DatePicker
                    disabled={newDisabled || item.disabled}
                    showTime={showTime}
                    format={item.datePickerFormat}
                    disabledDate={item.disableBeforeTime ? this.disableBeforeTime : () => {}}
                  />
                </FormItem>
              );
            }
            // eslint-disable-next-line no-nested-ternary
            return value
              ? !checkNull(item.datePickerFormat)
                ? moment(value).format(item.datePickerFormat)
                : value
              : null;
          },
        });
      }
      if (item.renderType === 'rangePicker') {
        // 加载rangePicker 开始日期~结束日期
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            if (record.onEditing) {
              const tableCell = `${item.dataIndex}@${index}`;
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  initialValue={
                    !value || value.length <= 0
                      ? null
                      : [
                          moment(value[0], item.datePickerFormat),
                          moment(value[1], item.datePickerFormat),
                        ]
                  }
                  rules={item.rules}
                >
                  <RangePicker
                    disabled={item.disabled}
                    format={item.datePickerFormat}
                    showTime={item.datePickerFormat === 'YYYY-MM-DD HH:mm:ss'}
                  />
                </FormItem>
              );
            }
            return !value || value.length <= 0
              ? ''
              : `${moment(value[0]).format(item.datePickerFormat)}~${moment(value[1]).format(
                  item.datePickerFormat,
                )}`;
          },
        });
      }
      if (item.renderType === 'timePicker') {
        // 加载timePicker 时间选择框
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            if (record.onEditing) {
              const tableCell = `${item.dataIndex}@${index}`;
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  rules={item.rules}
                  initialValue={value === '' ? null : moment(value, item.timePickerFormat)}
                >
                  <TimePicker format={item.timePickerFormat} />
                </FormItem>
              );
            }
            return typeof value === 'object' ? moment(value).format(item.timePickerFormat) : value;
          },
        });
      }
      if (item.renderType === 'switch') {
        // 加载 switch 开关
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            const tableCell = `${item.dataIndex}@${index}`;
            return (
              <FormItem style={{ margin: 0 }} name={tableCell} initialValue={value}>
                <Popconfirm
                  icon={<ExclamationCircleOutlined />}
                  title={value === 'A' ? '确认是否执行失效？' : '确认是否执行生效？'}
                  onConfirm={() => {
                    this.handleSwitch(item, value, index, record, item.dataIndex);
                  }}
                  onCancel={() => {}}
                  okText="确定"
                  cancelText="取消"
                  disabled={tableFormDisbale || item.disabled}
                >
                  <Switch
                    disabled={tableFormDisbale || item.disabled}
                    checked={value === 'A'}
                    checkedChildren={item.switchOptions.checkedChildren}
                    unCheckedChildren={item.switchOptions.unCheckedChildren}
                  />
                </Popconfirm>
              </FormItem>
            );
          },
        });
      }
      if (item.renderType === 'provinceCity') {
        // 加载省市组件
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            const tableCell = `${item.dataIndex}@${index}`;
            let initVal = '';
            if (typeof value === 'object' && value.province && value.city) {
              // 初始化
              initVal = value;
            }
            return (
              // 新增 根据状态判断，非校验时展示
              item.rules && item.rules === 'false' ? (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  initialValue={initVal}
                  rules={[{ required: false }]}
                >
                  <ProvinceCity disabled={!record.onEditing || item.disabled} />
                </FormItem>
              ) : (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  rules={[{ validator: this.checkProvinceCity }]}
                  initialValue={initVal}
                >
                  <ProvinceCity disabled={!record.onEditing || item.disabled} />
                </FormItem>
              )
            );
          },
        });
      }
      if (item.renderType === 'ProvinceCityArea') {
        // 加载省市区组件
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            const tableCell = `${item.dataIndex}@${index}`;
            let initVal = '';
            if (typeof value === 'object' && value.province && value.city && value.area) {
              // 初始化
              initVal = value;
            }
            return (
              <FormItem
                style={{ margin: 0 }}
                name={tableCell}
                rules={[{ validator: this.checkProvinceCityArea }]}
                initialValue={initVal}
              >
                <ProvinceCityArea disabled={!record.onEditing || item.disabled} dontShowdetails />
              </FormItem>
            );
          },
        });
      }
      if (!item.disabled && item.renderType === 'dpTable') {
        // 加载下拉列表
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: any) => {
            const tableCell = `${item.dataIndex}@${index}`;
            if (record.onEditing) {
              if (item.dpTableOptions.dpTableChange) {
                return (
                  <FormItem
                    style={{ margin: 0 }}
                    name={tableCell}
                    rules={item.rules}
                    initialValue={
                      typeof value === 'object'
                        ? value
                        : {
                            [item.dpTableOptions.dataType]: record[item.dpTableOptions.dataType],
                            [item.dpTableOptions.dataCode]: value,
                          }
                    }
                  >
                    <ZsfDpTable
                      // dpTableOnEditing={record.onEditing || false}
                      columns={item.dpTableOptions.dpTableColumns}
                      dataType={item.dpTableOptions.dataType}
                      dataId={item.dpTableOptions.dataId}
                      dataCode={item.dpTableOptions.dataCode}
                      dataSourceModel={item.dpTableOptions.dataSourceModel}
                      fetchParams={item.dpTableOptions.fetchParams}
                      selectStyle={item.dpTableOptions.selectStyle}
                      optionWidth={item.dpTableOptions.optionWidth}
                      // translationFetchParams={item.dpTableOptions.translationFetchParams}
                      // editOption={{
                      //   record,
                      //   index,
                      // }}
                      // translateValue={record[item.dpTableOptions.dataType]}
                      fetchOnlyFilterArr={item.dpTableOptions.fetchOnlyFilterArr}
                      filterArr={item.dpTableOptions.filterArr}
                    />
                  </FormItem>
                );
              }
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  rules={item.rules}
                  initialValue={
                    typeof value === 'object'
                      ? value
                      : {
                          [item.dpTableOptions.dataType]: record[item.dpTableOptions.dataType],
                          [item.dpTableOptions.dataCode]: value,
                        }
                  }
                >
                  <ZsfDpTable
                    // dpTableOnEditing={record.onEditing || false}
                    columns={item.dpTableOptions.dpTableColumns}
                    dataType={item.dpTableOptions.dataType}
                    dataId={item.dpTableOptions.dataId}
                    dataCode={item.dpTableOptions.dataCode}
                    dataSourceModel={item.dpTableOptions.dataSourceModel}
                    fetchParams={item.dpTableOptions.fetchParams}
                    selectStyle={item.dpTableOptions.selectStyle}
                    optionWidth={item.dpTableOptions.optionWidth}
                    // translationFetchParams={item.dpTableOptions.translationFetchParams}
                    editOption={{
                      record,
                      index,
                      item,
                    }}
                    dpTableOnChange={this.dpTableOnChange}
                    // translateValue={record[item.dpTableOptions.dataType]}
                    fetchOnlyFilterArr={item.dpTableOptions.fetchOnlyFilterArr}
                    filterArr={item.dpTableOptions.filterArr}
                  />
                </FormItem>
              );
            }
            return value && typeof value === 'object'
              ? value[item.dpTableOptions.dataType]
              : record[item.dpTableOptions.dataType];
          },
        });
      }
      if (!item.disabled && item.renderType === 'mulitDpTable') {
        // 加载下拉列表
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            const tableCell = `${item.dataIndex}@${index}`;
            if (record.onEditing) {
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  rules={item.rules}
                  initialValue={value}
                >
                  <MulitSelectDpTable
                    columns={item.mulitDpTableOptions.muiltDpTableColumns} // 表头
                    searchType={item.mulitDpTableOptions.searchType} // 输入框输入时传后台对应筛选字段
                    dataId={item.mulitDpTableOptions.dataId} // 下拉表格数据单行数据唯一id，也是传后台的数据类型
                    dataType={item.mulitDpTableOptions.dataType} // 配置select框展示的数据
                    optionWidth={item.mulitDpTableOptions.optionWidth} // 表格宽度
                    selectWidth={item.mulitDpTableOptions.selectWidth} // select框宽度
                    fetchParams={item.mulitDpTableOptions.fetchParams} // 需要配置的请求参数
                    dataSourceModel={item.mulitDpTableOptions.dataSourceModel} // 关联的model
                    // editOption={{
                    //   record,
                    //   index,
                    // }}
                    // muiltDpTableOnChange={this.muiltDpTableOnChange}
                  />
                </FormItem>
              );
            }
            const tempValue: any[] = [];
            value.forEach((element?: any) => {
              tempValue.push(element[item.mulitDpTableOptions.dataType]);
            });
            return typeof value === 'object' ? (
              <LineWrap title={tempValue.toString()} clampNum={10} />
            ) : (
              <LineWrap
                title={record[item.mulitDpTableOptions.dataType].toString()}
                clampNum={10}
              />
            );
          },
        });
      }
      if (!item.disabled && item.renderType === 'ZsfAutoComplete') {
        // 加载下拉列表
        // eslint-disable-next-line no-param-reassign
        item = Object.assign(item, {
          render: (value?: any, record?: any, index?: number) => {
            const tableCell = `${item.dataIndex}@${index}`;
            if (record.onEditing) {
              return (
                <FormItem
                  style={{ margin: 0 }}
                  name={tableCell}
                  rules={item.rules}
                  initialValue={value}
                >
                  <ZsfAutoComplete
                    columns={item.dpTableOptions.dpTableColumns}
                    dataType={item.dpTableOptions.dataType}
                    // dataId={item.dpTableOptions.dataId}
                    // dataCode={item.dpTableOptions.dataCode}
                    dataSourceModel={item.dpTableOptions.dataSourceModel}
                    fetchParams={item.dpTableOptions.fetchParams}
                    selectStyle={item.dpTableOptions.selectStyle}
                    optionWidth={item.dpTableOptions.optionWidth}
                    editOption={{
                      record,
                      index,
                    }}
                    autoCompleteOnChange={this.autoCompleteOnChange}
                    autoCompleteonInputing={this.autoCompleteonInputing}
                  />
                </FormItem>
              );
            }
            return value;
          },
        });
      }
    });
    if (userOperation) {
      this.columns.push(userOperation);
    }
    if (needColumnsAction !== false) {
      this.columns.push(columnsAction);
    }
    if (showNumber) {
      this.columns.unshift(columnsNum);
    }
    console.log('this.columns', this.columns);
  };

  // 编辑当前行
  editCurrentRow = (e: any, index: number) => {
    e.preventDefault();
    const { value, onChange, getAction, getCurrentLineIndex } = this.props;
    if (getCurrentLineIndex) {
      getCurrentLineIndex(index);
    }
    if (getAction) {
      getAction('edit', value[index], index);
    }
    const newData = [...value];
    newData[index].onEditing = true;
    if (onChange) {
      onChange(newData);
    }
  };

  // 点击取消
  cancelCurrentRow = (e: any, index: number) => {
    e.preventDefault();
    const { value, onChange, getAction } = this.props;
    this.onEditingState = false; // 取消编辑状态
    const newData = [...value];
    if (this.storageSwitch.switchName) {
      const { switchName, switchValue } = this.storageSwitch;
      newData[index][switchName] = switchValue;
    }
    newData[index].onEditing = false;
    this.storageSwitch = {};
    if (getAction) {
      getAction('cancel');
    }
    if (onChange) {
      onChange(newData);
    }
  };

  // 删除当前行
  removeCurrentRow = (e: any, index: number) => {
    e.preventDefault();
    const { value, onChange, fetchData, deleteLineCb } = this.props;
    const newData = [...value];
    // 现在约定：如果删除当前行需要走后台，那么保存当前行也需要走后台，如果删除不走后台那么保存也不走后台
    if (fetchData && !newData[index].onEditing) {
      // 编辑状态下 并且有删除按钮的 只能是新增的一行
      fetchData(newData[index], 'delete', (response?: any) => {
        if (response === 'success') {
          newData.splice(index, 1);
          if (onChange) {
            onChange(newData);
          }
        }
      });
      return;
    }
    // 在编辑状态下删除只有可能是新增的一行，此时删除需要设置编辑状态为false
    this.onEditingState = false;
    // 删除当前行不走接口(有fetchData，但是新增一行未保存也不走后台)
    newData.splice(index, 1);
    if (deleteLineCb) {
      deleteLineCb(newData.length);
    }
    if (onChange) {
      onChange(newData);
    }
  };

  // 新增一行数据
  addAnewLine = () => {
    const {
      value,
      columns,
      onChange,
      defaultNewLineData,
      addHideData,
      getAction,
      getCurrentLineIndex,
    } = this.props;
    if (getAction) {
      getAction('add', '', value.length);
    }
    const newData = [...value];
    let newLine;
    if (defaultNewLineData) {
      newLine = {
        key: uuidv4().split('-')[0],
        onEditing: true,
        isAddNewLine: true,
        ableToDelete: true,
        ...defaultNewLineData,
      };
    } else {
      newLine = {
        key: uuidv4().split('-')[0],
        onEditing: true,
        isAddNewLine: true,
        ableToDelete: true,
      };
      columns.forEach((item) => {
        if (item.renderType === 'switch') {
          newLine[item.dataIndex] = 'A';
        } else if (item.renderType === 'datePicker') {
          newLine[item.dataIndex] = null;
        } else if (item.renderType === 'rangePicker') {
          newLine[item.dataIndex] = [];
        } else if (item.renderType === 'dpTable') {
          newLine[item.dataIndex] = {};
        } else {
          newLine[item.dataIndex] = '';
        }
      });
    }
    newData.push({ ...newLine, ...addHideData });
    this.index += 1;
    if (getCurrentLineIndex) {
      getCurrentLineIndex(newData.length - 1);
    }
    if (onChange) {
      onChange(newData);
    }
  };

  // 保存当前行数据
  saveCurrentRow = (e: any, index: number) => {
    e.preventDefault();
    const {
      value,
      columns,
      onChange,
      fetchData,
      initValueCanDelete,
      getCurrentLineIndex,
      getAction,
    } = this.props;
    const { validateFields, getFieldValue } = this.formRef.current;
    // 深拷贝
    const newData = JSON.parse(JSON.stringify(value));
    const validCurrentLine: string[] = [];
    columns.forEach((item) => {
      validCurrentLine.push(`${item.dataIndex}@${index}`); // 获取需要当前行所有数据的form ID
    });
    if (getCurrentLineIndex) {
      getCurrentLineIndex(index);
    }
    if (getAction) {
      getAction('save', value[index], index);
    }
    // validateFields(validCurrentLine).then((values?: any) => {
    //   console.log("__________", values)
    // })
    validateFields(validCurrentLine).then((values?: any) => {
      console.log(values);
      columns.forEach((item) => {
        // 日期时间切换组件格式化
        if (item.renderType === 'datePOrTimeP') {
          newData[index][item.dataIndex] = moment(
            getFieldValue(`${item.dataIndex}@${index}`),
          ).format('YYYY-MM-DD HH:mm:ss');
          return false;
        }
        // 时间格式化
        if (item.renderType === 'timePicker') {
          newData[index][item.dataIndex] = moment(
            getFieldValue(`${item.dataIndex}@${index}`),
          ).format(item.timePickerFormat);
          return false;
        }
        // 日期数组格式化
        if (item.renderType === 'rangePicker') {
          const newRangePickerArr: string[] = [];
          getFieldValue(`${item.dataIndex}@${index}`).forEach((i?: any) => {
            newRangePickerArr.push(moment(i).format(item.datePickerFormat));
          });
          newData[index][item.dataIndex] = newRangePickerArr;
          return false;
        }
        // 日期格式化
        if (item.renderType === 'datePicker') {
          newData[index][item.dataIndex] = moment(
            getFieldValue(`${item.dataIndex}@${index}`),
          ).format(item.datePickerFormat);
          return false;
        }
        newData[index][item.dataIndex] = getFieldValue(`${item.dataIndex}@${index}`); // 从form中获取当前行的所有数据
        return false;
      });
      // 保存当前行走后台
      if (fetchData) {
        const actionLine = newData[index].isAddNewLine ? 'add' : 'change';
        fetchData(newData[index], actionLine, (response: string) => {
          if (response === 'success') {
            newData[index] = {
              ...newData[index],
              onEditing: false,
              isAddNewLine: false,
              ableToDelete: initValueCanDelete !== undefined ? initValueCanDelete : true, // 初始化数据默认支持删除
            };
            this.onEditingState = false; // 保存取消编辑状态
            if (onChange) {
              onChange(newData);
            }
          }
        });
        return;
      }
      // 保存当前行不走后台
      newData[index] = { ...newData[index], onEditing: false };
      this.onEditingState = false; // 保存取消编辑状态
      if (onChange) {
        onChange(newData);
      }
    });
  };

  // switch开关改变
  handleSwitch = (item?: any, itemValue?: any, index?: any, record?: any, tableCell?: any) => {
    const { value, onChange, fetchData } = this.props;
    const newData = [...value];
    if (itemValue === 'A') {
      newData[index][item.dataIndex] = 'I';
    }
    if (itemValue === 'I') {
      newData[index][item.dataIndex] = 'A';
    }
    if (fetchData && !record.onEditing) {
      fetchData(newData[index], 'change', (response: string) => {
        if (response === 'success') {
          if (onChange) {
            onChange(newData);
          }
        }
      });
    } else {
      if (record.onEditing) {
        this.storageSwitch = {
          switchName: tableCell,
          switchValue: itemValue,
        };
      }
      if (onChange) {
        onChange(newData);
      }
    }
  };

  // 批量删除，用户手动选择/取消选择某行的回调
  rowOnSelect = (currentRow?: any, selected?: any, selectedRows?: any) => {
    this.setState({
      selectedRows,
    });
  };

  // 批量删除，用户手动选择/取消选择所有行的回调
  rowOnSelectAll = (selected?: any, selectedRows?: any) => {
    this.setState({
      selectedRows,
    });
  };

  // 批量删除弹框
  batchDeleteModal = () => {
    Modal.confirm({
      title: '批量删除',
      content: '确定删除选中数据吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: this.batchDelete,
    });
  };

  // 点击批量删除按钮
  batchDelete = () => {
    const { value, onChange, fetchData } = this.props;
    const { selectedRows } = this.state;
    const newData = [...value];
    // 批量删除走接口
    if (fetchData) {
      fetchData(selectedRows, 'batchDelete', (response: string) => {
        if (response === 'success') {
          for (let i = 0; i < selectedRows.length; i += 1) {
            for (let j = 0; j < newData.length; j += 1) {
              if (newData[j].key === selectedRows[i].key) {
                newData.splice(j, 1);
                break;
              }
            }
          }
          if (onChange) {
            onChange(newData);
          }
        }
      });
      return;
    }
    // 批量删除不走接口
    for (let i = 0; i < selectedRows.length; i += 1) {
      for (let j = 0; j < newData.length; j += 1) {
        if (newData[j].key === selectedRows[i].key) {
          newData.splice(j, 1);
          break;
        }
      }
    }
    this.setState({
      selectedRows: [],
    });
    if (onChange) {
      onChange(newData);
    }
  };

  // 下拉字典项数据改变时暴漏方法
  dicselOnChange = (value?: any, option?: any) => {
    const { dicselOnChange, relyOnData, selectChangeClearColumns } = this.props;
    const { setFieldsValue } = this.formRef.current;
    if (selectChangeClearColumns && selectChangeClearColumns.length > 0) {
      selectChangeClearColumns.forEach((item) => {
        setFieldsValue({ [`${item}@${option.index}`]: null });
      });
    }
    if (dicselOnChange && option.tableCell !== `${relyOnData}@${option.index}`) {
      if (relyOnData) {
        setFieldsValue({ [`${relyOnData}@${option.index}`]: '' });
      }
      if (value === undefined || value === null) {
        // allowClear 清空
        dicselOnChange('allowClear', option.index, option, setFieldsValue);
      } else {
        dicselOnChange(value, option.index, option, setFieldsValue);
      }
    }
  };

  // DpTable 改变时，修改关联单元格
  dpTableOnChange = (record?: any, editOption?: any, action?: any) => {
    const { connectArr, getCurrentLineIndex, connectClearArr } = this.props;
    const { setFieldsValue } = this.formRef.current;
    const {
      item: { dpTableOptions },
    } = editOption;
    if (action !== 'allowClear') {
      if (getCurrentLineIndex) {
        getCurrentLineIndex(editOption.index);
      }
      if (connectArr && connectArr.length > 0) {
        connectArr.forEach((item: string | number) => {
          const tableCell = `${item}@${editOption.index}`;
          setFieldsValue({
            [tableCell]: record[item],
          });
        });
      }
      if (connectClearArr && connectClearArr.length > 0) {
        connectClearArr.forEach((item: any) => {
          const tableCell = `${item}@${editOption.index}`;
          setFieldsValue({
            [tableCell]: [],
          });
        });
      }
      if (dpTableOptions.dpConnect && dpTableOptions.dpConnect.length > 0) {
        dpTableOptions.dpConnect.forEach((item: string | number) => {
          const tableCell = `${item}@${editOption.index}`;
          setFieldsValue({
            [tableCell]: record[item],
          });
        });
      }
    } else if (dpTableOptions.dpConnect && dpTableOptions.dpConnect.length > 0) {
      dpTableOptions.dpConnect.forEach((item: any) => {
        const tableCell = `${item}@${editOption.index}`;
        setFieldsValue({
          [tableCell]: '',
        });
      });
    }
  };

  //  改变时，修改关联单元格
  autoCompleteOnChange = (action?: any, editOption?: any, option?: any) => {
    const { autoCompleteArr, getCurrentLineIndex, changeColumns } = this.props;
    const { setFieldsValue } = this.formRef.current;
    if (action === 'select') {
      if (getCurrentLineIndex) {
        getCurrentLineIndex(editOption.index);
      }
      if (autoCompleteArr && autoCompleteArr.length > 0) {
        autoCompleteArr.forEach((item: string | number) => {
          const tableCell = `${item}@${editOption.index}`;
          setFieldsValue({
            [tableCell]: option.props.optionrecord[item],
          });
        });
      }
      changeColumns('select');
    } else {
      if (getCurrentLineIndex) {
        getCurrentLineIndex(editOption.index);
      }
      if (autoCompleteArr && autoCompleteArr.length > 0) {
        autoCompleteArr.forEach((item: any) => {
          const tableCell = `${item}@${editOption.index}`;
          setFieldsValue({
            [tableCell]: '',
          });
        });
      }
    }
  };

  // 输入框输入时
  autoCompleteonInputing = () => {
    const { changeColumns } = this.props;
    changeColumns('input');
  };

  // select 改变时
  selectOnChange = (value?: any, option?: any) => {
    const { selectOnChange, selectChangeClearColumns } = this.props;
    const { setFieldsValue } = this.formRef.current;
    if (selectChangeClearColumns && selectChangeClearColumns.length > 0) {
      selectChangeClearColumns.forEach((item) => {
        setFieldsValue({ [`${item}@${option.props.selectonchangeoption.index}`]: null });
      });
    }
    if (selectOnChange) {
      selectOnChange(value, option, setFieldsValue);
    }
  };

  // input 改变时
  inputOnChange = (e?: any) => {
    const { inputOnChange } = this.props;
    const { setFieldsValue } = this.formRef.current;
    if (inputOnChange) {
      inputOnChange(JSON.parse(e.currentTarget.getAttribute('inputoption')), setFieldsValue);
    }
  };

  // inputNum 改变
  inputNumOnChange = (currentValue?: any, record?: any, index?: any, tableCell?: any) => {
    const { inputNumOnChange } = this.props;
    const { setFieldsValue } = this.formRef.current;
    if (inputNumOnChange) {
      inputNumOnChange(currentValue, record, index, tableCell, setFieldsValue);
    }
  };

  // 省市校验
  checkProvinceCity = (rule?: any, value?: any, callback?: any) => {
    console.log(rule);
    if (typeof value !== 'object') {
      callback('请选择省');
      return;
    }
    if (!value.city) {
      callback('请选择市');
      return;
    }
    callback();
  };

  // 省市区校验
  checkProvinceCityArea = (rule?: any, value?: any, callback?: any) => {
    if (typeof value !== 'object') {
      callback('请选择省');
      return;
    }
    if (!value.city) {
      callback('请选择市');
      return;
    }
    if (!value.area) {
      callback('请选择区');
      return;
    }
    callback();
  };

  // 点击小U
  xiaoU = (id?: any) => {
    this.setState({
      xiaoUid: id,
      showXiaoU: true,
    });
  };

  // 关闭小U
  handleTraceModalCancel = () => {
    this.setState({
      showXiaoU: false,
    });
  };

  // 点击小I
  xiaoI = (id?: any) => {
    this.setState({
      xiaoIid: id,
      showXiaoI: true,
    });
  };

  // 关闭小I
  handleTraceModalCancelI = () => {
    this.setState({
      showXiaoI: false,
    });
  };

  // 获取小U查询数据
  getTableTagTraces = (list?: any) => {
    const { onChange, value, toPreTableTagTraces } = this.props;
    // 查询到表格中数据是否有被删除的记录返回给父组件
    if (toPreTableTagTraces && list) {
      toPreTableTagTraces(list);
    }
    const { listUpdate, listInsert } = list;
    const newData = [...value];
    listUpdate.forEach((id?: any) => {
      newData.forEach((item, index) => {
        if (item.id === id) {
          newData[index].showXiaoU = true;
        }
      });
    });

    listInsert.forEach((id?: any) => {
      newData.forEach((item, index) => {
        if (item.id === id) {
          newData[index].showXiaoI = true;
        }
      });
    });
    if (onChange) {
      onChange(newData);
    }
  };

  // 禁止今天以前的时间
  disableBeforeTime = (current?: any) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };

  render() {
    const {
      value,
      buttonContent,
      tableFormDisbale,
      needBatchDelete,
      needAddNewLine,
      scroll,
      // moduleType, // 小U查变更模块标志
      loading,
      // queryXiaoUParam, // 查询小U变更参数
      // fromPage
    } = this.props;
    // const { selectedRows, showXiaoU, xiaoUid, showXiaoI, xiaoIid } = this.state;
    const { selectedRows } = this.state;
    this.getColumnsData();
    if (value && value.length > 0) {
      const newData = [...value];
      if (
        newData.find((item) => {
          return item.onEditing;
        })
      ) {
        this.onEditingState = true;
      } else {
        this.onEditingState = false;
      }
    }
    return (
      <Fragment>
        {needBatchDelete ? (
          <div className={styles.batchDelete}>
            <Button
              type="primary"
              disabled={selectedRows.length <= 0 || this.onEditingState || tableFormDisbale}
              onClick={this.batchDeleteModal}
            >
              批量删除
            </Button>
          </div>
        ) : null}
        <Form ref={this.formRef} component={false}>
          <Table
            rowKey={(record) => record.id || record.key || uuidv4().split('-')[0]}
            loading={loading}
            scroll={scroll}
            columns={this.columns}
            dataSource={value}
            pagination={false}
            rowClassName={(record) => (record.onEditing ? styles.onEditing : '')}
            rowSelection={needBatchDelete ? this.rowSelection : undefined}
          />
        </Form>
        {needAddNewLine !== false && (
          <Button
            className={styles.addNewLine}
            type="dashed"
            onClick={this.addAnewLine}
            disabled={tableFormDisbale || this.onEditingState}
          >
            {buttonContent || '新增'}
          </Button>
        )}
        {/* {queryXiaoUParam && queryXiaoUParam.id && !fromPage && (
          <ModifyTraceTagListInfo
            id={queryXiaoUParam.id}
            moduleType={moduleType}
            modalChildTableName={queryXiaoUParam.modalChildTableName}
            getTableTagTraces={this.getTableTagTraces}
          />
        )}
        {queryXiaoUParam && queryXiaoUParam.id && fromPage && (
          <CustomRelationTraceTagListInfo
            id={queryXiaoUParam.id}
            moduleType={moduleType}
            modalChildTableName={queryXiaoUParam.modalChildTableName}
            getTableTagTraces={this.getTableTagTraces}
          />
        )}

        {showXiaoU && moduleType && !fromPage && (
          <ModifyTraceModal
            id={xiaoUid}
            moduleType={moduleType}
            traceModalVisible
            updType="U"
            handleTraceModalCancel={this.handleTraceModalCancel}
          />
        )
        }
        {showXiaoU && moduleType && fromPage && (
          <CustInfoModifyModal
            id={xiaoUid}
            moduleType={moduleType}
            traceModalVisible
            updType="U"
            handleTraceModalCancel={this.handleTraceModalCancel}
          />
        )
        }
        {showXiaoI && moduleType && !fromPage && (
          <ModifyTraceModal
            id={xiaoIid}
            moduleType={moduleType}
            traceModalVisible
            updType="I"
            handleTraceModalCancel={this.handleTraceModalCancelI}
          />
        )
        }
        {showXiaoI && moduleType && fromPage && (
          <CustInfoModifyModal
            id={xiaoIid}
            moduleType={moduleType}
            traceModalVisible
            updType="I"
            handleTraceModalCancel={this.handleTraceModalCancelI}
          />
        )
        } */}
      </Fragment>
    );
  }
}

export default ZsfTableForm;
