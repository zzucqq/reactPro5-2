import React, { Fragment, useState, useEffect } from 'react';
import { Form, Button, Input } from 'antd';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import { FooterToolbar } from '@ant-design/pro-layout';
import type { UserModelState } from './model';
import DicSel from '@/components/ZsfComponents/DicSel/index'; // 下拉框
import DicRadio from '@/components/ZsfComponents/DicRadio/index'; // radio
import DicCheckbox from '@/components/ZsfComponents/DicCheckbox/index'; // Checkbox
import ZsfDpTable from '@/components/ZsfComponents/ZsfDpTable/ZsfDpTable'; // ZsfDpTable
import ZsfDpDicTable from '@/components/ZsfComponents/ZsfDpDicTable/ZsfDpDicTable'; // ZsfDpDicTable
import ZsfMulitSelectDpTable from '@/components/ZsfComponents/ZsfMulitSelectDpTable/index'; // ZsfMulitSelectDpTable
import BasicQueryForm from '@/components/ZsfComponents/BasicQueryForm/index'; // BasicQueryForm
import BasicTable from '@/components/ZsfComponents/BasicTable/index'; // BasicTable
import ZsfProvinceCityArea from '@/components/ZsfComponents/ZsfProvinceCityArea/index'; // ZsfProvinceCityArea
import ZsfAutoComplete from '@/components/ZsfComponents/ZsfAutoComplete/index'; // ZsfAutoComplete
import ReplaceRedux from '@/components/ZsfComponents/ReplaceRedux/index';
import { setDicData, setDicProvinceData, setDicCityData, setDicRegionData } from '@/utils/initDic';
import provinceData from '../../../public/geographic/province.json';
import cityData from '../../../public/geographic/city.json';
import regionData from '../../../public/geographic/region.json';

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 },
};
export interface ZsfComponentsEntryProps {
  dispatch?: Dispatch;
  dicData?: any;
  queryParam?: any;
}
export interface ValueType {
  province?: string;
  city?: string;
  area?: string;
  address?: string;
}
const ZsfComponentsEntry: React.FC<ZsfComponentsEntryProps> = (props) => {
  const { dispatch, dicData } = props;
  const [form] = Form.useForm();
  const [tableList, setTableList] = useState([]);
  const [tablePagination, setTablePagination] = useState({});
  const [dicShow, setDicShow] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(true);
  const [upload, setUpload] = useState<boolean>(false);
  const pagination = {
    current: 1,
    pageSize: 10,
  };
  const columnsOrg = [
    { dataIndex: 'cooprOrgName', title: '机构名称' },
    { dataIndex: 'cooprOrgNo', title: '机构编号' },
  ];
  console.log(dicData);
  // 获取字典码值
  const getDic = () => {
    const param = {
      ...pagination,
    };
    if (dispatch) {
      dispatch({
        type: 'zsfcomponentsModel/fetchDic',
        payload: { ...param },
        callback: (res) => {
          if (res && res.data) {
            setDicData(res.data); // 存储数据字典
            setDicShow(true);
          }
        },
      });
    }
  };
  // 获取请求列表
  const getTableList = (pagination2?: any) => {
    console.log(pagination2);
    if (dispatch) {
      dispatch({
        type: 'zsfcomponentsModel/fetchList',
        callback: (res) => {
          if (res && res.data) {
            setTableList(res.data);
            setTablePagination(res.pagination);
          }
        },
      });
    }
  };
  const handleDic = () => {
    setDicProvinceData(provinceData);
    setDicCityData(cityData);
    setDicRegionData(regionData);
  };

  useEffect(() => {
    getDic();
    getTableList();
    handleDic();
    setTimeout(() => {
      setUpload(true);
    }, 2000);
  }, []);

  /**
   * 保存
   */
  const saveForm = async () => {
    const { validateFields } = form;
    const values = await validateFields();
    // const jsonData = JSON.stringify(values);// 转成JSON格式
    // const result = JSON.parse(jsonData);// 转成JSON对象
    console.log(values);
  };

  const dpTableOnChange = (record?: any) => {
    console.log('dpTableOnChange', record);
  };

  /**
   * 查询条件定义
   */
  const queryColumns = () => {
    const { queryParam } = props;
    let columns = [];
    columns = [
      {
        title: '服务费申请编号',
        dataIndex: 'rebateApplyNo',
        value: '334444', // 初始化值
        render: () => <Input allowClear />,
      },
      {
        title: '服务费名称',
        value: queryParam && queryParam.rebateName,
        dataIndex: 'rebateName',
        render: () => <Input allowClear />,
      },
      {
        title: '服务费名称2',
        dataIndex: 'rebateName2',
        value: queryParam && queryParam.rebateName2,
        render: () => <Input allowClear />,
      },
      {
        title: '服务费类别',
        value: '01',
        dataIndex: 'rebateType',
        render: () => <DicSel dicType="PRE_RULE" allowClear />,
      },
      {
        title: '服务费类别2',
        dataIndex: 'rebateType2',
        render: () => <DicSel dicType="PRE_RULE" allowClear />,
      },
      {
        title: '服务费类别3',
        dataIndex: 'rebateType3',
        render: () => <DicSel dicType="PRE_RULE" allowClear />,
      },
      {
        title: '服务费类别4',
        dataIndex: 'rebateType4',
        render: () => <DicSel dicType="PRE_RULE" allowClear />,
      },
    ];
    return columns;
  };

  /**
   * 获取查询条件
   */
  const getSearchValue = (value?: any) => {
    console.log(value);
  };

  /**
   * 展开-折叠
   */
  const chageExpandState = () => {
    setExpand(!expand);
  };

  /** ===============表格事件============= */
  const alertMessage = <div>1556456456456454</div>;
  const columnsTable = [
    { dataIndex: 'cooprOrgName', title: '机构名称', align: 'center' },
    { dataIndex: 'cooprOrgNo', align: 'center', title: '机构编号' },
    { dataIndex: 'acctIdNo', title: 'acctIdNo', align: 'center' },
  ];
  const tableChange = (pagination3?: any) => {
    getTableList(pagination3);
  };

  /** ==================省市区校验=============== */
  const checkProvince = (_: any, value: ValueType, callback: (message?: string) => void) => {
    if (!value.province) {
      callback('请选择单位地址的省');
      return;
    }
    if (!value.city) {
      callback('请选择单位地址的市');
      return;
    }
    if (!value.area) {
      callback('请选择单位地址的区');
      return;
    }
    if (!value.address) {
      callback('请填写单位地址的详细地址');
      return;
    }
    callback();
  };

  return (
    <Fragment>
      <h1>测试useContext和useRedcer替换redux</h1>
      <ReplaceRedux />
      <br />
      <br />
      <br />
      {dicShow && (
        <Fragment>
          <h3>一：组件【radio】【select】【Checkbox】</h3>
          <Form
            form={form}
            {...layout}
            name="basic"
            initialValues={{ radio1: '02', dicTable: '01' }}
          >
            <Form.Item
              label="【radio】"
              name="radio1"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <DicRadio dicType="PRE_RULE" />
            </Form.Item>
            <Form.Item
              label="【Checkbox】"
              name="Checkbox"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <DicCheckbox dicType="PRE_RULE" />
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
            <h3>三：组件 下拉字典项表格 【ZsfDpDicTable】</h3>
            <Form.Item
              label="【ZsfDpDicTable】"
              name="dicTable"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <ZsfDpDicTable
                columnsTitle={['编号', '名称']} // 下拉表格title
                optionWidth={{ width: '100%' }}
                selectStyle={{ width: '100%' }}
                dataSourceDicType="CAL_BASIS" // 字典项类型
                dpTableOnChange={dpTableOnChange} // 选中后的回调
              />
            </Form.Item>
            <h3>四：组件 下拉多选表格 【ZsfMulitSelectDpTable】</h3>
            <Form.Item
              label="【ZsfMulitSelectDpTable】"
              name="ZsfMulitSelectDpTable"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <ZsfMulitSelectDpTable
                columns={columnsOrg}
                dataType="cooprOrgName" // 配置select框展示的数据
                searchType="cooprOrgName" // 输入框输入时传后台对应筛选字段
                dataId="cooprOrgNo" // 下拉表格数据单行数据唯一id，也是传后台的数据类型
                optionWidth="500" // 表格宽度
                selectWidth="500" // select框宽度
                dataSourceModel="zsfDpTableModel/fetchList"
                fetchParams="" // 需要配置的请求参数
              />
            </Form.Item>
            <h3>五：组件 省市区下拉框</h3>
            {upload && (
              <Form.Item
                label="【省市区】"
                name="unitAddr"
                rules={[{ required: true }, { validator: checkProvince }]}
              >
                <ZsfProvinceCityArea />
              </Form.Item>
            )}
            <h3>六：组件 下拉框可输入</h3>
            <Form.Item
              label="ZsfAutoComplete"
              name="ZsfAutoComplete"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <ZsfAutoComplete
                columns={columnsOrg}
                dataType="cooprOrgName" // select框展示的字段（一般为中文翻译）
                optionWidth={{ width: '500px' }} // 表格的宽度
                selectStyle={{ width: '500px' }} // select的宽度
                dataSourceModel="zsfDpTableModel/fetchList"
                fetchParams={{}} // 需要配置的请求参数
              />
            </Form.Item>
          </Form>
          <h3>七：form查询条件组件</h3>
          <BasicQueryForm
            queryColumns={queryColumns()}
            getSearchValue={getSearchValue} // 点击查询获取搜索条件，必传
            expand={!expand}
            chageExpandState={chageExpandState} // 控制展开折叠状态函数，必传
          />
          <h3>八：table组件</h3>
          <BasicTable
            rowKey={(record?: any) => record.cooprOrgNo}
            alertMessage={alertMessage}
            columns={columnsTable}
            data={{
              list: tableList,
              pagination: tablePagination,
            }}
            loading={false}
            onChange={tableChange}
          />
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

export default connect(({ zsfcomponentsModel }: { zsfcomponentsModel: UserModelState }) => ({
  dicData: zsfcomponentsModel.dicData,
}))(ZsfComponentsEntry);
