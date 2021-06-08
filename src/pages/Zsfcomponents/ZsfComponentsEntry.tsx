import React, { Fragment, useState, useEffect } from 'react';
import { Form, Button } from 'antd';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import { FooterToolbar } from '@ant-design/pro-layout';
import type { UserModelState } from './model';
import DicSel from '@/components/ZsfComponents/DicSel/index'; // 下拉框
import DicRadio from '@/components/ZsfComponents/DicRadio/index'; // radio
import ZsfDpTable from '@/components/ZsfComponents/ZsfDpTable/ZsfDpTable'; // ZsfDpTable
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
  const [form] = Form.useForm();
  const [dicShow, setDicShow] = useState<boolean>(false);
  const pagination = {
    current: 1,
    pageSize: 10,
  };
  const columnsOrg = [
    { dataIndex: 'cooprOrgName', title: '机构名称' },
    { dataIndex: 'cooprOrgNo', title: '机构编号' },
  ];
  // 获取字典码值
  const getDic = () => {
    const { dispatch, dicData } = props;
    const param = {
      ...pagination,
    };
    if (dispatch) {
      dispatch({
        type: 'zsfcomponentsModel/fetchDic',
        payload: { ...param },
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
  // 获取请求列表
  const getTableList = () => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'zsfcomponentsModel/fetchList',
        callback: (res) => {
          if (res && res.data) {
            console.log(res);
          }
        },
      });
    }
  };
  useEffect(() => {
    getDic();
    getTableList();
  }, []);

  /**
   * 保存
   */
  const saveForm = async () => {
    const { validateFields } = form;
    const values = await validateFields();
    console.log(`获取表单数据：${values}`);
  };

  return (
    <Fragment>
      {dicShow && (
        <Fragment>
          <h3>一：组件【radio】【select】</h3>
          <Form form={form} {...layout} name="basic" initialValues={{ radio1: '02' }}>
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
            <h3>二：组件 下拉表格 【ZsfDpTable】</h3>
            <Form.Item
              label="【zsfDpTable】"
              name="zsfDpTable"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <ZsfDpTable
                columns={columnsOrg}
                dataType="cooprOrgName" // 默认展示的数据类型
                dataId="cooprOrgNo" // 当前行唯一标识
                dataCode="cooprOrgNo" // 后台存储的code
                optionWidth={{ width: '100%' }} // option的宽度
                selectStyle={{ width: '100%' }} // 选择框的样式
                dataSourceModel="zsfDpTableModel/fetchList"
              />
            </Form.Item>
          </Form>
        </Fragment>
      )}
      <FooterToolbar>
        <Button type="primary" onClick={saveForm}>
          保存
        </Button>
      </FooterToolbar>
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
