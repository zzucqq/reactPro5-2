/**
 * 脱敏组件
 */
import React, { Fragment } from 'react';
import { Input, Tooltip } from 'antd';

export interface InputPorpsOj {
  type: string;
  placeholder?: string;
  disabled?: boolean;
  tableItem?: boolean;
  tableA?: boolean;
  noToolTip?: any;
  aHandle?: () => void;
}
export interface InputToolTipProps {
  inputPorps: InputPorpsOj;
  value?: any;
  onChange?: (value?: any) => any;
}

const InputToolTip: React.FC<InputToolTipProps> = (props) => {
  const { inputPorps, value, onChange } = props;

  const changeStr = (valueParam?: any, type?: string) => {
    let newValue = valueParam || '';
    if (type === 'idCard') {
      if (newValue.length > 0) {
        return `${valueParam.substring(0, 3)}***********${valueParam.substring(14)}`;
      }
      return '';
    }
    if (type === 'name') {
      if (newValue.length > 0) {
        if (newValue.length > 3) {
          newValue = `${valueParam.substring(0, 1)}*${valueParam.substring(valueParam.length - 1)}`;
        } else {
          newValue = `${valueParam.substring(0, 1)}*`;
        }
        return newValue;
      }
      return '';
    }
    if (type === 'phoneNum') {
      if (newValue.length > 0) {
        return `${valueParam.substring(0, 2)}****${valueParam.substring(valueParam.length - 3)}`;
      }
      return '';
    }
    if (type === 'telephone') {
      if (newValue.length > 0) {
        return `${valueParam.substring(0, 3)}****${valueParam.substring(valueParam.length - 4)}`;
      }
      return '';
    }
    if (type === 'bankNum') {
      if (newValue.length > 0) {
        return `${valueParam.substring(0, 4)}***********${valueParam.substring(
          valueParam.length - 4,
        )}`;
      }
      return '';
    }
    if (type === 'address') {
      if (newValue) {
        newValue = `**************`;
      }
      return newValue;
    }
    return newValue;
  };

  const onChangeFun = (values?: any) => {
    if (onChange) {
      onChange(values);
    }
  };
  const newValue = changeStr(value, inputPorps.type);
  if (inputPorps && inputPorps.tableItem) {
    return (
      <Tooltip placement="topLeft" title={value}>
        {newValue}
      </Tooltip>
    );
  }
  if (inputPorps.tableA) {
    return (
      <Tooltip title={value} placement="topLeft">
        <a onClick={inputPorps.aHandle}>{newValue}</a>
      </Tooltip>
    );
  }
  return (
    <Fragment>
      {inputPorps.disabled ? (
        <Tooltip title={value} placement="topLeft">
          <Input value={newValue} {...inputPorps} />
        </Tooltip>
      ) : (
        <Input {...inputPorps} value={value} onChange={onChangeFun} />
      )}
    </Fragment>
  );
};
export default InputToolTip;
