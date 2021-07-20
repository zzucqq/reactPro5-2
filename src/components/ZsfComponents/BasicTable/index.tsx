/**
 * 基础列表组件
 */
import React from "react";
import { Table, Alert } from 'antd';
import { checkNull } from '@/utils/functions/validation';
import styles from './index.less';

export interface paginationObj {
  total?: number
}

export interface dataObj {
  list: any[];
  pagination?: paginationObj
}
export interface BasicTableProps {
  alertMessage?: React.ReactNode;
  data: dataObj;
  loading: boolean;
  columns: any[];
  pageSizeOptions?: any;
  pageIsShow?: any;
  rowKey: any;
  onChange?: (value?: any,value2?: any,value3?: any) => void;

}
const BasicTable: React.FC<BasicTableProps> = props => {
  const {
    alertMessage,
    data,
    loading,
    columns,
    pageSizeOptions,
    pageIsShow,
    onChange,
    rowKey,
    ...rest
  } = props
  const { list = [], pagination } = data;
  const paginationProps = {
    showTotal: () => {
      return `共 ${pagination ? pagination.total : '0'} 条数据`;
    },
    showSizeChanger: true, // 是否可以改变 pageSize
    showQuickJumper: true, // 是否可以快速跳转至某页
    pageSizeOptions,
    ...pagination,
  };
  let pageShow = true;
  // 根据父组件传标识判断分页是否展示
  if (!checkNull(pageIsShow)) {
    pageShow = pageIsShow;
  }
  const tableChange = (pagination2?: any, filters?: any, sorter?: any) => {
    if (onChange) {
      onChange(pagination2, filters, sorter);
    }
  };

  return (
    <div className={styles.standardTable}>
        {alertMessage && (
          <div className={styles.tableAlert}>
            <Alert message={alertMessage} type="info" showIcon />
          </div>
        )}
        <Table
          rowKey={rowKey}
          loading={loading}
          columns={columns}
          dataSource={list}
          pagination={(pageShow && pagination && paginationProps) || false}
          onChange={tableChange} // 分页、排序、筛选变化时触发
          className={[styles.checkFixed, styles.extendTableStyle].join(' ')}
          {...rest}
        />
      </div>
  )
}

export default BasicTable
