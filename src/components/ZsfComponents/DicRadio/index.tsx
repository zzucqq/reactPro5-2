/**
 * 单选框radio组件
 */

import { Radio } from 'antd';
import { PureComponent, Fragment } from 'react';
import { getDicData } from '@/utils/initDic';
import { checkNull } from '@/utils/functions/validation';
import styles from './index.less';

export interface DicRadioProps {
  disabled?: boolean;
  style?: any;
  value?: string;
  dicType: string;
  exclude?: any;
  include?: any;
  stylesDefine?: any;
  onChange?: (value?: any) => any;
}

class DicRadio extends PureComponent<DicRadioProps> {
  /**
   * 组装字典Option
   * @param dicType 匹配字典码
   * @param exclude 匹配不包含字典项
   * @param include 匹配包含字典项
   * @returns
   */

  getDicCheck = (dicType: string, exclude: string[], include: string[]) => {
    let dicDataItem = getDicData()[dicType];
    if (!checkNull(dicDataItem)) {
      dicDataItem = this.getIncludeData(include, dicDataItem);
      dicDataItem = this.getExcludeData(exclude, dicDataItem);
      dicDataItem.sort(function o(a?: any, b?: any) {
        return a.o - b.o;
      });
    }
    return this.getCheck(dicDataItem);
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
  getCheck = (list: any[]) => {
    const { stylesDefine } = this.props;
    if (!list || list.length < 1) {
      return '';
    }
    return list.map((item) => {
      return (
        <Radio key={item.k} value={item.k} className={stylesDefine ? styles.radioDefine : ''}>
          {item.v}
        </Radio>
      );
    });
  };

  /**
   * 选中调用
   */
  handleChange = (checkedList?: any) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(checkedList);
    }
  };

  render() {
    const { style, disabled, value, dicType, exclude, include } = this.props;
    return (
      <Fragment>
        <Radio.Group
          style={style || { width: '100%' }}
          disabled={disabled}
          value={value}
          onChange={this.handleChange}
        >
          {this.getDicCheck(dicType, exclude, include)}
        </Radio.Group>
      </Fragment>
    );
  }
}

export default DicRadio;
