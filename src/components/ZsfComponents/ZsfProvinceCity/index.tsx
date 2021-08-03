/**
 * 省市选择控件
 */
import React from 'react';
import { useState, useEffect, Fragment } from 'react';
import { Select } from 'antd';
import { getDicAreaData } from '@/utils/initDic';

const { Option } = Select;
export interface ZsfProvinceCityProps {
  value?: any;
  onChange?: (value?: any) => any;
  disabled?: boolean;
}
// 全局变量
let cityArrVariate: any[]; // 加载市oprions用于反显

const ZsfProvinceCity: React.FC<ZsfProvinceCityProps> = (props) => {
  const { onChange, value, disabled } = props;
  const [provinceVal, setProvinceVal] = useState(undefined); // 省
  const [provinceArr, setProvinceArr] = useState([]); // 加载省oprions
  const [cityArr, setCityArr] = useState([]); // 加载市oprions

  useEffect(() => {
    setProvinceArr(getDicAreaData('province'));
  }, []);

  // 省select事件
  const selectProvinceItem = (item?: any) => {
    setProvinceVal(item);
    setCityArr(getDicAreaData('city')[item]);
    if (onChange) {
      onChange({
        ...value,
        city: '',
      });
    }
  };

  // 市select事件
  const selectCityItem = (item?: any) => {
    const newValue = {
      province: provinceVal,
      city: item,
    };
    if (onChange) {
      onChange(newValue);
    }
  };

  if (value && value.province && value.city) {
    cityArrVariate = getDicAreaData('city')[value.province];
  }
  const newCityArr = cityArr.length > 0 ? cityArr : cityArrVariate;
  return (
    <Fragment>
      <Select
        value={provinceVal || value.province}
        placeholder="省"
        style={{ width: 120 }}
        onChange={selectProvinceItem}
        disabled={disabled}
      >
        {provinceArr.length > 0
          ? provinceArr.map((item?: any) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))
          : null}
      </Select>
      <Select
        value={value.city}
        placeholder="市"
        style={{ width: 120 }}
        onChange={selectCityItem}
        disabled={disabled}
      >
        {newCityArr.length > 0
          ? newCityArr.map((item?: any) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))
          : null}
      </Select>
    </Fragment>
  );
};

export default ZsfProvinceCity;
