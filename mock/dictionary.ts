import { Request, Response } from 'express';
const tableListDataSource = {
  CAL_BASIS: [
    {
      s: null,
      t: null,
      v: '按金额',
      k: '01',
      o: null,
    },
    {
      s: null,
      t: null,
      v: '按比例',
      k: '02',
      o: null,
    },
  ],
  CONSM_TYPE: [
    {
      s: null,
      t: null,
      v: '消费类',
      k: '01',
      o: null,
    },
    {
      s: null,
      t: null,
      v: '账单分期类',
      k: '02',
      o: null,
    },
    {
      s: null,
      t: null,
      v: '商品分期类',
      k: '03',
      o: null,
    },
  ],
  PRE_RULE: [
    {
      s: null,
      t: null,
      v: '费用',
      k: '01',
      o: null,
    },
    {
      s: null,
      t: null,
      v: '成功率',
      k: '02',
      o: null,
    },
    {
      s: null,
      t: null,
      v: '默认通道',
      k: '03',
      o: null,
    },
  ],
};
function getAllComCde(req: Request, res: Response) {
  const result = {
    data: tableListDataSource,
    code: '0000000',
    message: 'SUCCESS',
  };
  return res.json(result);
}

export default {
  'POST /api/config/base/com/getAllComCde': getAllComCde,
};
