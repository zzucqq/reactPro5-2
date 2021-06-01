import type { Effect, Reducer } from 'umi';

import { queryDic } from './service';

export type UserModelState = {
  dicData?: object;
};

export type ZsfcomponentsModelType = {
  namespace: string;
  state: UserModelState;
  effects: {
    fetchDic: Effect;
  };
  reducers: {
    setDic: Reducer<UserModelState>;
  };
};

const ZsfcomponentsModel: ZsfcomponentsModelType = {
  namespace: 'zsfcomponentsModel',

  state: {
    dicData: {},
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
  },

  reducers: {
    setDic(state, action) {
      return {
        ...state,
        dicData: action.payload || {},
      };
    },
  },
};

export default ZsfcomponentsModel;
