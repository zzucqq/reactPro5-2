/**
 * 省市区选择控件
 */
import React from 'react';
import { useState, useEffect, Fragment } from 'react';
import { Select, Input } from 'antd';
import { getDicAreaData } from '@/utils/initDic';
import ToType from '@/utils/ToType/ToType';

const { Option } = Select;
export interface ZsfProvinceCityAreaProps {
  value?: any;
  disabled?: boolean;
  zioCodeVisible?: boolean;
  dontShowdetails?: any;
  loanApprove?: any;
  onChange?: (value?: any) => any;
}
const ZsfProvinceCityArea: React.FC<ZsfProvinceCityAreaProps> = (props) => {
  const { value, disabled, zioCodeVisible, dontShowdetails, loanApprove, onChange } = props;
  const [provinceArr, setProvinceArr] = useState([]); // 加载省oprions
  const [cityArr, setCityArr] = useState([]); // 加载市oprions
  const [areaArr, setAreaArr] = useState([]); // 加载区oprions
  let cityArrStore = []; // 存储市
  let areaArrStore = []; // 存储区

  console.log(loanApprove);
  useEffect(() => {
    setProvinceArr(getDicAreaData('province'));
  }, []);

  /**
   *  省select事件
   */
  const selectProvinceItem = (item?: any) => {
    setCityArr(getDicAreaData('city')[item]);
    let newValue;
    if (ToType(value) === 'object') {
      newValue = { ...value };
      newValue.province = item;
      newValue.city = '';
      newValue.area = '';
    } else {
      newValue = {
        province: item,
        city: '',
        area: '',
      };
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  /**
   * 市select事件
   */
  const selectCityItem = (item?: any) => {
    setAreaArr(getDicAreaData('region')[item]);
    const newValue = { ...value };
    newValue.city = item;
    newValue.area = '';
    if (onChange) {
      onChange(newValue);
    }
  };

  /**
   * 区select选择
   */
  const selectAreaItem = (item?: any) => {
    const newValue = { ...value };
    newValue.area = item;
    if (onChange) {
      onChange(newValue);
    }
  };

  /**
   * 邮编详细地址改变
   */
  const zipCodeHandleChange = (e?: any) => {
    const newValue = { ...value };
    newValue.zipCode = e.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  const addressHandleChange = (e?: any) => {
    const newValue = { ...value };
    newValue.address = e.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  if (value && value.city && value.area) {
    cityArrStore = getDicAreaData('city')[value.province];
    areaArrStore = getDicAreaData('region')[value.city];
  }
  if (value && value.city) {
    cityArrStore = getDicAreaData('city')[value.province];
  }
  const newCityArr = cityArr.length > 0 ? cityArr : cityArrStore || [];
  const newAreaArr = areaArr.length > 0 ? areaArr : areaArrStore || [];
  console.log('___', value, newCityArr, newAreaArr);
  const newInput = (
    <Input
      style={{ width: zioCodeVisible ? '20%' : '40%' }}
      value={value && value.address}
      disabled={disabled}
      onChange={addressHandleChange}
      placeholder="详细地址"
    />
  );
  // if (disabled) {
  //   newInput = (
  //     <InputToolTip
  //       style={{ width: zioCodeVisible ? '20%' : '40%' }}
  //       inputPorps={{ type: 'address', disabled, noToolTip: loanApprove }}
  //       value={value.address}
  //     />
  //   );
  // }
  return (
    <Fragment>
      <Select
        value={value && value.province}
        placeholder="省"
        style={{ width: '20%' }}
        onChange={selectProvinceItem}
        disabled={disabled}
      >
        {provinceArr.length > 0
          ? provinceArr.map((item?: any) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })
          : null}
      </Select>
      <Select
        value={value && value.city}
        placeholder="市"
        style={{ width: '20%' }}
        onChange={selectCityItem}
        disabled={disabled}
      >
        {newCityArr.length > 0
          ? newCityArr.map((item?: any) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })
          : null}
      </Select>
      <Select
        value={value && value.area}
        placeholder="区"
        style={{ width: '20%' }}
        onChange={selectAreaItem}
        disabled={disabled}
      >
        {newAreaArr.length > 0
          ? newAreaArr.map((item?: any) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })
          : null}
      </Select>
      {zioCodeVisible && !dontShowdetails && (
        <Input
          style={{ width: '20%' }}
          value={value.zipCode}
          disabled={disabled}
          onChange={zipCodeHandleChange}
          placeholder="邮编"
        />
      )}
      {!dontShowdetails && newInput}
    </Fragment>
  );
};
export default ZsfProvinceCityArea;
