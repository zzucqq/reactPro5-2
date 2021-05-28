import request from '@/utils/request';

export async function queryDic(): Promise<any> {
  return request('/api/config/base/com/getAllComCde', {
    method: 'POST',
    data: {},
  });
}
