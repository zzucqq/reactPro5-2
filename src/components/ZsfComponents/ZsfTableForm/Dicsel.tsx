import React, { PureComponent } from 'react';
import { Select } from 'antd';

const { Option } = Select;
export interface DicSelProps {
  value?: any;
  dicType: string;
  disabled?: boolean;
  exclude?: any[];
  include?: any[];
  mode?: any;
  superCde?: any;
  onChange?: (value?: any) => any;
  dicselOnChange?: (value?: any, value2?: any) => any;
  dicselCurrentRecord?: any;
}
class DicSel extends PureComponent<DicSelProps> {
  /**
   * 组装字典Option
   * @param dicType 匹配字典码
   * @param exclude 匹配不包含字典项
   * @param include 匹配包含字典项
   * @returns
   */

  getDicOption = (dicType: string, exclude?: string[], include?: string[]) => {
    let dicDataItem = JSON.parse(sessionStorage.getItem('dic') as any)[dicType];
    const { superCde } = this.props;
    if (superCde !== undefined) {
      dicDataItem = dicDataItem.filter(this.filterBySuperCode);
    }
    dicDataItem = this.getExcludeData(exclude, dicDataItem);
    dicDataItem = this.getIncludeData(include, dicDataItem);
    return this.getOption(dicDataItem);
  };

  /**
   * 排除数据字典项
   * @returns
   */
  getExcludeData = (exclude?: any, dicDataItem?: any) => {
    if (!exclude) {
      return dicDataItem;
    }
    exclude.map((excludeItem?: any) => {
      const i = dicDataItem.findIndex((dicItem?: any) => excludeItem === dicItem.k);
      if (i >= 0) {
        dicDataItem.splice(i, 1);
      }
      return dicDataItem;
    });
    return dicDataItem;
  };

  /**
   *  过滤字典数据
   */
  getIncludeData = (include?: any[], dicDataItem?: any) => {
    if (!include) {
      return dicDataItem;
    }
    const dicDataItemTemp: any[] = [];
    include.map((includeItem) => {
      const i = dicDataItem.findIndex((dicItem?: any) => includeItem === dicItem.k);
      if (i >= 0) {
        dicDataItemTemp.push(dicDataItem[i]);
      }
      return dicDataItemTemp;
    });
    return dicDataItemTemp;
  };

  filterBySuperCode = (item?: any) => {
    const { superCde } = this.props;
    // 常规字典，无superCde
    if (!item.s) {
      return true;
    }
    // 只有superCde分组
    if (item.s && superCde === item.s) {
      return true;
    }
    return false;
  };

  getOption = (list: any[]) => {
    if (!list || list.length < 1) {
      // 返回暂无数据
      return '';
    }
    return list.map((item) => (
      <Option key={item.k} value={item.k}>
        {item.v}
      </Option>
    ));
  };

  handleChange = (selectedList?: any, option?: any) => {
    const { onChange, dicselOnChange, dicselCurrentRecord } = this.props;
    if (onChange) {
      onChange({
        dicVal: selectedList || '',
        dicName: option && option.props && option.props.children ? option.props.children : '',
      });
    }
    if (dicselOnChange) {
      dicselOnChange(selectedList, dicselCurrentRecord);
    }
  };

  render() {
    const { dicType, disabled, exclude, include, mode } = this.props;
    const { value } = this.props;
    return (
      <Select
        allowClear
        mode={mode || false}
        style={{ width: '100%' }}
        placeholder="请选择"
        disabled={disabled}
        value={value && typeof value === 'object' ? value.dicVal : value}
        onChange={this.handleChange}
      >
        {this.getDicOption(dicType, exclude, include)}
      </Select>
    );
  }
}

export default DicSel;
