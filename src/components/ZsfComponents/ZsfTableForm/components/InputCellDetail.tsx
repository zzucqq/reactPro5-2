/**
 * 可编辑表格单元格详情按钮 input
 */
import React, { Fragment } from 'react';
import { Input } from 'antd';
import { ContainerOutlined } from '@ant-design/icons';

export interface InputCellDetailProps {
  value?: any;
  clickHandle?: any;
  editingDisable?: any;
  record?: any;
  allowClear?: any;
  onChange?: (value?: any) => void;
  specialDisabled?: boolean;
}
const InputCellDetail: React.FC<InputCellDetailProps> = (props) => {
  // specialDisabled 为true 为满足 运营配置中心-业务参数管理-自动审批配置 新增时候可以输入，点击编辑按钮不能输入情况特定
  const {
    value,
    clickHandle,
    editingDisable,
    record,
    allowClear,
    onChange,
    specialDisabled,
    ...rest
  } = props;
  return (
    <Fragment>
      {specialDisabled ? (
        <Input
          value={value}
          style={{ width: '60%', marginRight: '5%' }}
          disabled={!record.isAddNewLine}
          onChange={onChange}
        />
      ) : (
        <Input
          value={value}
          allowClear={allowClear}
          style={{ width: '60%', marginRight: '5%' }}
          {...rest}
        />
      )}

      {!editingDisable && (
        <ContainerOutlined style={{ color: '#08c', cursor: 'pointer' }} onClick={clickHandle} />
      )}
    </Fragment>
  );
};
export default InputCellDetail;
