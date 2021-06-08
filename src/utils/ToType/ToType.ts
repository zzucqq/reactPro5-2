/**
 * @description 检测数据类型格式
 * @author cqq
 * @since 2021-3-19
 */
const class2type = {};
// 设定数据类型的映射表
[
  'Boolean',
  'Number',
  'String',
  'Function',
  'Array',
  'Date',
  'RegExp',
  'Object',
  'Error',
  'Symbol',
].forEach((name) => {
  class2type[`[object ${name}]`] = name.toLocaleLowerCase();
});

function toType(obj?: any) {
  if (obj === null) {
    return `${obj}`;
  }
  // 基本数据类型都采用typeof
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2type[Object.prototype.toString.call(obj)] || 'object'
    : typeof obj;
}

export default toType;
