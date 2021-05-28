import { Button } from 'antd';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import React from 'react';
import type { UserModelState } from './model';

export interface ZsfComponentsEntryProps {
  dispatch?: Dispatch;
  dicData?: any;
}

class ZsfComponentsEntry extends React.Component<ZsfComponentsEntryProps> {
  // 请求字典码值
  getDic = () => {
    console.log('***');
    const { dispatch, dicData } = this.props;
    if (dispatch) {
      dispatch({
        type: 'zsfcomponentsModel/fetchDic',
        callback: (res) => {
          if (res && res.data) {
            console.log(res.data, dicData);
          }
        },
      });
    }
  };

  render() {
    return <Button onClick={this.getDic}>获取字典码</Button>;
  }
}
export default connect(({ zsfcomponentsModel }: { zsfcomponentsModel: UserModelState }) => ({
  dicData: zsfcomponentsModel.dicData,
}))(ZsfComponentsEntry);
// export default ZsfComponentsEntry
