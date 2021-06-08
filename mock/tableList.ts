import { Request, Response } from 'express';
const tableListDataSource = [
  {
    cooprOrgName: '1105测试机构',
    cooprOrgNo: 'EN0023',
    cooprOrgType: '04,03,02,01',
    acctIdType: '32',
    acctIdNo: '91440300MA5DC75B4M',
  },
  {
    cooprOrgName: '异常蚂蚁金服9927853871',
    cooprOrgNo: 'EN0074',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '新增桔子分期5408778566',
    cooprOrgNo: 'EN0076',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '变更合作机构7576372274',
    cooprOrgNo: 'EN0078',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '非关键国庆5796644087',
    cooprOrgNo: 'EN0081',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '复议五四4460275513',
    cooprOrgNo: 'EN0083',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '测试京东金条4738969459',
    cooprOrgNo: 'EN0084',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '变更国庆5449091387',
    cooprOrgNo: 'EN0085',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '关键桔子分期5627084927',
    cooprOrgNo: 'EN0086',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '测试蚂蚁金服2041590947',
    cooprOrgNo: 'EN0087',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '测试京东金条4738969459',
    cooprOrgNo: 'EN0084',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '变更国庆5449091387',
    cooprOrgNo: 'EN0085',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '关键桔子分期5627084927',
    cooprOrgNo: 'EN0086',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '测试蚂蚁金服2041590947',
    cooprOrgNo: 'EN0087',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '测试京东金条4738969459',
    cooprOrgNo: 'EN0084',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '变更国庆5449091387',
    cooprOrgNo: 'EN0085',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '关键桔子分期5627084927',
    cooprOrgNo: 'EN0086',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
  {
    cooprOrgName: '测试蚂蚁金服2041590947',
    cooprOrgNo: 'EN0087',
    cooprOrgType: '02,03',
    acctIdType: '01',
    acctIdNo: '91410800755178552Y',
  },
];

function getTableList(req: Request, res: Response) {
  const result = {
    data: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
      pageSize: req.body.pageSize,
      current: req.body.current,
    },
    code: '0000000',
    message: 'SUCCESS',
  };
  return res.json(result);
}

export default {
  'POST /api/config/base/com/getTableList': getTableList,
};
