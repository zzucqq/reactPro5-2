import React from 'react';
import { Tooltip } from 'antd';

export interface LineWrapProps {
  title?: any;
  clampNum?: any;
}

const LineWrap: React.FC<LineWrapProps> = (props) => {
  const { title, clampNum } = props;
  const subNum = undefined !== clampNum ? clampNum : '15';
  const substringTitle =
    undefined !== title && title !== null && title.length > subNum
      ? `${title.substring(0, subNum)}...`
      : title;
  return (
    <span>
      {undefined !== title && title !== null && title.length > subNum ? (
        <Tooltip placement="topLeft" title={title}>
          <span>{substringTitle}</span>
        </Tooltip>
      ) : (
        <span>{substringTitle}</span>
      )}
    </span>
  );
};
export default LineWrap;
