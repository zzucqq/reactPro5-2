/**
 * 可编辑表格单元格详情按钮 inputNum
 */
import React, { Fragment } from 'react';
import { InputNumber } from 'antd';
import { ContainerOutlined } from '@ant-design/icons';

export interface InputNumCellDetailProps {
  value?: any;
  clickHandle?: any;
  editingDisable?: any;
}
const InputNumCellDetail: React.FC<InputNumCellDetailProps> = (props) => {
  const { value, clickHandle, editingDisable, ...rest } = props;
  return (
    <Fragment>
      <InputNumber value={value} style={{ width: '60%', marginRight: '5%' }} {...rest} />
      {!editingDisable && (
        <ContainerOutlined style={{ color: '#08c', cursor: 'pointer' }} onClick={clickHandle} />
      )}
    </Fragment>
  );
};
export default InputNumCellDetail;
