import type { Effect, Reducer } from 'umi';

import { queryDic, fetchList } from '@/services/user';

export type UserModelState2 = {
  dicData?: object;
  resbody?: object;
  aatest?: string;
};

export type zsfDpTableModelType = {
  namespace: string;
  state: UserModelState2;
  effects: {
    fetchDic: Effect;
    fetchList: Effect;
  };
  reducers: {
    setDic: Reducer<UserModelState2>;
    queryList: Reducer<UserModelState2>;
  };
};

const zsfDpTableModel: zsfDpTableModelType = {
  namespace: 'zsfDpTableModel',

  state: {
    dicData: {},
    resbody: {},
    aatest: '好',
  },

  effects: {
    *fetchDic({ payload, callback }, { call, put }) {
      const response = yield call(queryDic, payload);
      if (response.code === '0000000') {
        yield put({
          type: 'setDic',
          payload: response,
        });
        if (callback) callback(response);
      }
    },
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      if (response.code === '0000000') {
        yield put({
          type: 'queryList',
          payload: response,
        });
        if (callback) callback(response);
      }
    },
  },

  reducers: {
    setDic(state, action) {
      return {
        ...state,
        dicData: action.payload || {},
      };
    },
    queryList(state, action) {
      return {
        ...state,
        resbody: action.payload || {},
      };
    },
  },
};

export default zsfDpTableModel;
