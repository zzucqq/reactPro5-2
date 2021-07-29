/**
 * 基础查询表单组件
 */
import React from 'react';
import { Col, Form, Row, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import styles from './index.less';

const FormItem = Form.Item;
// 变量定义
const formLayoutDefault = {
  // 布局
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const labelCol = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 8 },
};
let initData: any[]; // 暂存重置数据
export interface QueryColumnsItem {
  title: string;
  value?: any;
  dataIndex: string;
  render: (value?: any) => void;
}
export interface BasicQueryFormProps {
  queryColumns: QueryColumnsItem[];
  expand?: any;
  showBackButton?: any;
  goBackPage?: any;
  customReset?: any;
  loading?: any;
  formLayout?: any;
  showResetButton?: any;
  getSearchValue?: (value?: any) => void;
  resetFieldProps?: (value?: any) => void;
  chageExpandState?: (value?: any) => void;
}

const BasicQueryForm: React.FC<BasicQueryFormProps> = (props) => {
  const [form] = Form.useForm();
  const {
    queryColumns,
    expand,
    showBackButton,
    goBackPage,
    customReset,
    loading,
    formLayout,
    showResetButton,
    getSearchValue,
    resetFieldProps,
    chageExpandState,
  } = props;
  const thisFormLayout = formLayout || formLayoutDefault;

  /**
   * 点击查询按钮
   */
  const onQueryButton = async (): Promise<void> => {
    const { validateFields } = form;
    const values = await validateFields();
    // 父组件获取输入参数
    if (getSearchValue) {
      getSearchValue(values);
    }
  };
  /**
   * 点击重置按钮
   */
  const onResetButton = (): void => {
    const { setFieldsValue } = form;
    setFieldsValue(initData);
    // 如果父组件有自己重置逻辑 可自己处理
    if (resetFieldProps) {
      resetFieldProps();
    }
  };

  /**
   * 点击展开关闭按钮
   */
  const expandHandle = (): void => {
    if (chageExpandState) {
      chageExpandState();
    }
  };

  return (
    <Form form={form} {...thisFormLayout}>
      <div className={styles.tableListForm}>
        {queryColumns && queryColumns.length > 0 && (
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            {queryColumns.map((item: any, index: number) => {
              if (customReset && customReset[item.dataIndex] !== undefined) {
                initData = {
                  ...initData,
                  [item.dataIndex]: customReset[item.dataIndex],
                };
              } else {
                initData = { ...initData, [item.dataIndex]: null };
              }
              return (
                <Col
                  {...labelCol}
                  key={item.dataIndex}
                  style={(index > 5 && !expand && { display: 'none' }) || undefined}
                >
                  <FormItem
                    label={item.title}
                    name={item.dataIndex}
                    {...thisFormLayout}
                    initialValue={item.value}
                    rules={
                      item.rules ? [{ required: true, message: `请输入${item.title || null}` }] : []
                    }
                  >
                    {item.render()}
                  </FormItem>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
      <div className={styles.queryButton}>
        <Button
          className={styles.searchButton}
          type="primary"
          htmlType="submit"
          onClick={onQueryButton}
          loading={loading || false}
        >
          {' '}
          查询
        </Button>
        {!showResetButton && (
          <Button className={styles.resetButton} onClick={onResetButton}>
            重置{' '}
          </Button>
        )}
        {showBackButton && (
          <Button className={styles.resetButton} onClick={goBackPage}>
            返回{' '}
          </Button>
        )}
        {queryColumns.length > 6 && (
          <a className={styles.arrowButton} onClick={expandHandle}>
            {expand ? '收起' : '展开'}
            {expand && <UpOutlined />}
            {!expand && <DownOutlined />}
          </a>
        )}
      </div>
    </Form>
  );
};

export default BasicQueryForm;
