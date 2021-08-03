import React, { Fragment } from 'react';
import { Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// title table 列名
// text 文字说明
export default function TooltipTitle(title?: any, text?: any, flag?: any) {
  return (
    <Fragment>
      <span style={{ marginRight: 3 }}>{title}</span>
      <Tooltip placement="top" title={text}>
        {flag ? (
          <ExclamationCircleOutlined style={{ marginRight: 4, marginTop: '13px' }} />
        ) : (
          <ExclamationCircleOutlined style={{ marginRight: 4 }} />
        )}
      </Tooltip>
    </Fragment>
  );
}
