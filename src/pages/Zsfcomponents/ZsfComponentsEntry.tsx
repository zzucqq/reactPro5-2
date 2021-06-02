import { Form } from 'antd';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import React, { Fragment, useState, useEffect } from 'react';
import type { UserModelState } from './model';
import DicSel from '@/components/ZsfComponents/DicSel/index';
import DicRadio from '@/components/ZsfComponents/DicRadio/index';
import { setDicData } from '@/utils/initDic';

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 },
};
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
  useEffect(() => {
    return getDic();
  }, []);

  return (
    <Fragment>
      {dicShow && (
        <Fragment>
          <h3>一：组件【radio】【select】</h3>
          <Form {...layout} name="basic" initialValues={{ radio1: '02' }}>
            <Form.Item
              label="【radio】"
              name="radio1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <DicRadio dicType="PRE_RULE" />
            </Form.Item>
            <Form.Item
              label="【select】"
              name="select1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <DicSel dicType="PRE_RULE" mode />
            </Form.Item>
          </Form>
        </Fragment>
      )}
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
