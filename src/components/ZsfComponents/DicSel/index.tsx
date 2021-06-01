import { Select } from 'antd';
import { PureComponent, Fragment } from 'react';

const { Option } = Select;

export interface DicSelProps {
  showSearch?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  mode?: any;
  style?: any;
  value?: any;
  filterOption?: () => any;
  dicType: string;
  exclude?: string[];
  include?: string[];
  onChange?: (value?: any) => any;
  findIndex?: any;
  changeDicselProps?: (selectedList?: any, findIndex?: any, option?: any) => void;
}

class DicSel extends PureComponent<DicSelProps> {
  /**
   * 组装字典Option
   * @param dicType 匹配字典码
   * @param exclude 匹配不包含字典项
   * @param include 匹配包含字典项
   * @returns
   */

  getDicOption = (dicType: string, exclude: string[], include: string[]) => {
    let dicDataItem = JSON.parse(sessionStorage.getItem('dic') as any)[dicType];
    if (dicDataItem) {
      dicDataItem = this.getIncludeData(include, dicDataItem);
      dicDataItem = this.getExcludeData(exclude, dicDataItem);
      dicDataItem.sort(function o(a?: any, b?: any) {
        return a.o - b.o;
      });
    }
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
      if (i > 0) {
        dicDataItem.splice(i, 1);
      }
      return dicDataItem;
    });
    return dicDataItem;
  };

  /**
   *  过滤字典数据
   */
  getIncludeData = (include: string[], dicDataItem: string[]) => {
    if (!include) {
      return dicDataItem;
    }
    const dicDataItemTemp: any[] = [];
    include.map((includeItem?: any) => {
      const i = dicDataItem.findIndex((dicItem?: any) => includeItem === dicItem.k);
      if (i >= 0) {
        dicDataItemTemp.push(dicDataItem[i]);
      }
      return dicDataItemTemp;
    });
    return dicDataItem;
  };

  /**
   * 组装下拉框option
   * @returns
   */
  getOption = (list: any[]) => {
    if (!list || list.length < 1) {
      return '';
    }
    return list.map((item) => (
      <Option key={item.k} value={item.k}>
        {item.v}
      </Option>
    ));
  };

  /**
   * 选中调用
   */
  handleChange = (selectedList?: any, option?: any) => {
    const { onChange, findIndex, changeDicselProps } = this.props;
    if (onChange) {
      onChange(selectedList);
    }
    if (changeDicselProps) {
      changeDicselProps(selectedList, findIndex, option);
    }
  };

  render() {
    const {
      showSearch,
      allowClear,
      mode,
      style,
      disabled,
      value,
      filterOption,
      dicType,
      exclude,
      include,
    } = this.props;
    return (
      <Fragment>
        <Select
          showSearch={showSearch || false}
          allowClear={allowClear === undefined || allowClear}
          mode={mode || false}
          style={style || { width: '100%' }}
          disabled={disabled}
          value={value}
          onChange={this.handleChange}
          filterOption={filterOption || false}
        >
          {this.getDicOption(dicType, exclude, include)}
        </Select>
      </Fragment>
    );
  }
}

export default DicSel;
