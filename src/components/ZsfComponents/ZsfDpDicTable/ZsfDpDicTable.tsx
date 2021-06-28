/**
 * @description 下拉字典项-表格(展示 k, v)
 * @author chengqingqing
 * @since 2021-6-21
 */

import React from 'react';
import { useState, useEffect } from 'react';
import { Select, Divider } from 'antd';
import { getDicData, getDicComDescByCde } from '@/utils/initDic';
import ToType from '@/utils/ToType/ToType';
import styles from './index.less';

const { Option } = Select;
export interface ZsfDpDicTableProps {
  value?: any;
  dataSourceDicType?: any;
  disable?: any;
  placeholder?: any;
  selectStyle?: any;
  optionWidth?: any;
  columnsTitle?: any;
  onChange?: (value?: any) => any;
  dpTableOnChange?: (value?: any, flag?: any) => any;
}

const ZsfDpDicTable: React.FC<ZsfDpDicTableProps> = (props) => {
  const {
    dataSourceDicType,
    disable,
    placeholder,
    value,
    selectStyle,
    optionWidth,
    columnsTitle, // 标题
    onChange,
    dpTableOnChange,
  } = props;
  const [dataSource, setDataSource] = useState([]);
  const widths = '50%'; // 均分表格宽度
  let mapKey = 0; // 设置map的key的标记位
  let showValue;
  let columnsTit;
  useEffect(() => {
    setDataSource(getDicData()[dataSourceDicType]); // 拿到全部的字典值
  }, []);
  const onSelectRecord = (value2?: any, record?: any) => {
    // 全部清除
    if (value2 === 'allowClear') {
      if (onChange) {
        onChange({});
      }
      if (dpTableOnChange) {
        dpTableOnChange(record, 'allowClear');
      }
      return;
    }
    // 获取当前行数据处理关联单元格返显数据
    if (dpTableOnChange && record) {
      dpTableOnChange(record);
    }
    if (onChange && record) {
      onChange(record);
    }
  };
  if (!value) {
    showValue = { v: '' };
  } else if (ToType(value) === 'string') {
    const v = getDicComDescByCde(dataSourceDicType, value);
    showValue = { k: value, v };
  } else if (JSON.stringify(value) === '{}') {
    showValue = { v: '' };
  } else {
    showValue = value;
  }
  if (columnsTitle && columnsTitle.length > 0) {
    columnsTit = [...columnsTitle];
  } else {
    columnsTit = ['编号', '名称'];
  }
  return (
    <Select
      disabled={disable}
      allowClear
      dropdownClassName={styles.dpTable}
      showSearch
      placeholder={placeholder || '请输入'}
      showArrow={false}
      value={showValue.k}
      dropdownMatchSelectWidth={false}
      optionLabelProp="label" // 展示label组装内容
      filterOption={(input?: any, option?: any) => {
        return (
          option.props.optionrecord &&
          (option.props.optionrecord.v + option.props.optionrecord.k)
            .toLowerCase()
            .indexOf(input.toLowerCase()) > 0
        );
      }}
      style={selectStyle || { width: '260px' }}
      onChange={(optionValue?: any, optionProps?: any) => {
        // 全部清除
        if (!optionValue) {
          onSelectRecord('allowClear');
          return;
        }
        // 选中下拉框
        onSelectRecord(optionValue, optionProps.props.optionrecord);
      }}
    >
      <Option value="columnsTitle" disabled style={optionWidth}>
        {columnsTit.map((item?: any) => {
          mapKey += 1;
          return (
            <div key={`aa${mapKey}`} className={styles.lineItemHead} style={{ width: widths }}>
              {item}
            </div>
          );
        })}
        <Divider className={styles.divider} />
      </Option>
      {dataSource &&
        dataSource.map((item?: any) => {
          mapKey += 1;
          return (
            <Option
              value={item.k}
              key={mapKey}
              style={{ width: '100%' }}
              optionrecord={item}
              label={item.v}
            >
              <div className={styles.lineItem} style={{ width: widths }}>
                {item.k}
              </div>
              <div className={styles.lineItem} style={{ width: widths }}>
                {item.v}
              </div>
            </Option>
          );
        })}
    </Select>
  );
};

export default ZsfDpDicTable;
