import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function fetchList(params): Promise<any> {
  return request('/api/config/base/com/getTableList', {
    method: 'POST',
    data: params,
  });
}

export async function queryDic(): Promise<any> {
  return request('/api/config/base/com/getAllComCde', {
    method: 'POST',
    data: {},
  });
}
