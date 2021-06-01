import { Button } from 'antd';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import React, { Fragment, useState } from 'react';
import type { UserModelState } from './model';
import DicSel from '@/components/ZsfComponents/DicSel/index';
import { setDicData } from '@/utils/initDic';

export interface ZsfComponentsEntryProps {
  dispatch?: Dispatch;
  dicData?: any;
}

const ZsfComponentsEntry: React.FC<ZsfComponentsEntryProps> = (props) => {
  const [dicShow, setDicShow] = useState<boolean>(false);
  const getDic = () => {
    const { dispatch, dicData } = props;
    if (dispatch) {
      dispatch({
        type: 'zsfcomponentsModel/fetchDic',
        callback: (res) => {
          if (res && res.data) {
            console.log(dicData);
            setDicData(res.data); // 存储数据字典
            setDicShow(true);
          }
        },
      });
    }
  };

  return (
    <Fragment>
      <Button onClick={getDic}>获取字典码</Button>
      {dicShow && <DicSel dicType="PRE_RULE" />}
    </Fragment>
  );
};

// class ZsfComponentsEntry extends React.Component<ZsfComponentsEntryProps> {
//   // 请求字典码值
//   getDic = () => {
//     const { dispatch, dicData } = this.props;
//     if (dispatch) {
//       dispatch({
//         type: 'zsfcomponentsModel/fetchDic',
//         callback: (res) => {
//           if (res && res.data) {
//             console.log(res.data, dicData);
//           }
//         },
//       });
//     }
//   };

//   render() {
//     return <Button onClick={this.getDic}>获取字典码</Button>;
//   }
// }
export default connect(({ zsfcomponentsModel }: { zsfcomponentsModel: UserModelState }) => ({
  dicData: zsfcomponentsModel.dicData,
}))(ZsfComponentsEntry);
// export default ZsfComponentsEntry
