/**
 * 校验空值
 *
 * @export
 * @param {*} data
 * @returns
 */
export function checkNull(data?: any) {
  if (typeof data === 'undefined' || data == null || data === '' || data === undefined) {
    return true;
  }
  return false;
}
