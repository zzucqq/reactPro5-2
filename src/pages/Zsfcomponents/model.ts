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
    queryDic: Reducer<UserModelState>;
  };
};

const ZsfcomponentsModel: ZsfcomponentsModelType = {
  namespace: 'zsfcomponentsModel',

  state: {
    dicData: {},
  },

  effects: {
    *fetchDic({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryDic, payload);
      yield put({
        type: 'setDic',
        payload: response,
      });
      if (callback) callback(response);
    },
  },

  reducers: {
    queryDic(state, action) {
      return {
        ...state,
        dicData: action.payload || {},
      };
    },
  },
};

export default ZsfcomponentsModel;
