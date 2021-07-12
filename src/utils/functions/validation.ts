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

/**
 * 科学计数转数字
 */

/**
 *
 * @param {NewType} num
 * @param {*} digits
 */
export function toNumberStr(num?: any, digits?: any) {
  // 正则匹配小数科学记数法
  // eslint-disable-next-line no-useless-escape
  if (/^(\d+(?:\.\d+)?)(e)([\-]?\d+)$/.test(num)) {
    // 正则匹配小数点最末尾的0
    const temp = /^(\d{1,}(?:,\d{3})*\.(?:0*[1-9]+)?)(0*)?$/.exec(num.toFixed(digits));
    if (temp) {
      return temp[1];
    }
    return num.toFixed(digits);
  }
  return `${num}`;
}
