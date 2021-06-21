/**
 * Checkbox
 */
import React, { useState } from 'react';
import { Checkbox, Col, Row } from 'antd';
import { getDicData } from '@/utils/initDic';
import { checkNull } from '@/utils/functions/validation';

export interface DicCheckboxProps {
  onChange?: (value?: any) => any;
  showAll?: boolean;
  disabled?: any;
  value?: any;
  span?: any;
  dicType: string;
  exclude?: any;
  include?: any;
}
const DicCheckbox: React.FC<DicCheckboxProps> = (props) => {
  const { showAll, disabled, value, span, dicType, exclude, include, onChange } = props;
  const [checkAll, setCheckAll] = useState(false);
  let checkAllSet: React.ReactNode[] = [];
  // 排除处理
  const getExcludeData = (exclude2?: any, dicDataItem?: any) => {
    if (!exclude2) {
      return dicDataItem;
    }
    exclude2.map((excludeItem?: any) => {
      const i = dicDataItem.findIndex((dicItem?: any) => excludeItem === dicItem.key);
      if (i > 0) {
        dicDataItem.splice(i, 1);
      }
      return dicDataItem;
    });
    return dicDataItem;
  };

  // 包含处理
  const getIncludeData = (exclude2?: any, dicDataItem?: any) => {
    if (!exclude2) {
      return dicDataItem;
    }
    const dicDataItemTemp: React.ReactNode[] = [];
    exclude2.map((excludeItem?: any) => {
      const i = dicDataItem.findIndex((dicItem?: any) => excludeItem === dicItem.key);
      if (i >= 0) {
        dicDataItemTemp.push(dicDataItem[i]);
      }
      return dicDataItemTemp;
    });
    return dicDataItemTemp;
  };

  // 组装结构
  const getCheck = (list?: any) => {
    if (!list || list.length < 1) {
      return '';
    }
    if (checkAllSet.length <= 0) {
      for (let i = 0; i < list.length; i += 1) {
        checkAllSet.push(list[i].k);
      }
    }
    return list.map((item?: any) => (
      <Col key={item.k} span={span}>
        <Checkbox key={item.k} value={item.k}>
          {item.v}
        </Checkbox>
      </Col>
    ));
  };

  // 组装数据处理
  const getDicCheck = (dicType2: string, exclude2: string[], include2: string[]) => {
    let dicDataItem = getDicData()[dicType2];
    if (!checkNull(dicDataItem)) {
      dicDataItem = getExcludeData(exclude2, dicDataItem);
      dicDataItem = getIncludeData(include2, dicDataItem);
      dicDataItem.sort((a?: any, b?: any) => {
        return a.o - b.o;
      });
    }
    return getCheck(dicDataItem);
  };

  // 选择处理
  const handleChange = (checkedList?: any) => {
    if (onChange) {
      onChange(checkedList);
    }
  };

  // 全选处理
  const handleAllChange = (e?: any) => {
    setCheckAll(e.target.checked);
    if (e.target.checked) {
      if (onChange) {
        onChange(checkAllSet);
      }
    } else {
      checkAllSet = [];
      if (onChange) {
        onChange([]);
      }
    }
  };
  return (
    <Row>
      {showAll ? (
        <Col span={4}>
          <Col>
            <Checkbox checked={checkAll} onChange={handleAllChange}>
              全部
            </Checkbox>
          </Col>
        </Col>
      ) : null}
      <Col span={showAll ? 20 : 24}>
        <Checkbox.Group
          style={{ width: '100%', verticalAlign: 'middle' }}
          disabled={disabled}
          value={value}
          onChange={handleChange}
        >
          {getDicCheck(dicType, exclude, include)}
        </Checkbox.Group>
      </Col>
    </Row>
  );
};

export default DicCheckbox;
