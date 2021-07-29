import { message } from 'antd';

// 手机号校验
export const Phone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
// 身份证校验
export const Identity = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
// 身份证校验2
export const Identitys = /^[1-9]\d{5}((((19|[2-9][0-9])\d{2})(0?[13578]|1[02])(0?[1-9]|[12][0-9]|3[01]))|(((19|[2-9][0-9])\d{2})(0?[13456789]|1[012])(0?[1-9]|[12][0-9]|30))|(((19|[2-9][0-9])\d{2})0?2(0?[1-9]|1[0-9]|2[0-8]))|(((1[6-9]|[2-9][0-9])(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))0?229))\d{3}[0-9Xx]$/;

// 姓名校验
export const ChineseName = '';

// 邮箱校验
export const Email =
  "^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
// 固定电话
export const TelPhone = '^(0?[0-9]{2,3}-?){0,1}[0-9]{7,8}(-[0-9]{1,4}){0,1}$';
// 邮政编号
export const PostCode = /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/; // 身份证号合法性验证 //支持15位和18位身份证号//支持地址编码、出生日期、校验位验证
// 函数校验身份证'[0-9]\\d{5}(?!\\d)
/* 根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。 地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。 出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。 顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。 校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。 出生日期计算方法。 15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人; 2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗... 下面是正则表达式: 出生日期1800-2099 (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01]) 身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i 15位校验规则 6位地址编码+6位出生日期+3位顺序号 18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位 校验位规则 公式:∑(ai×Wi)(mod 11)……………………………………(1) 公式(1)中： i----表示号码字符从由至左包括校验码在内的位置序号； ai----表示第i位置上的号码字符值； Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。 i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1 */
export function checkIdentity(code?: any, msg?: any) {
  const city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 ',
  };
  let tip = '';
  let pass = true;
  if (
    !code ||
    !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)
  ) {
    tip = '身份证号格式错误';
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = '身份证地址编码错误';
    pass = false;
  } else {
    // 18位身份证需要验证最后一位校验位
    // eslint-disable-next-line no-lonely-if
    if (code.length === 18) {
      // eslint-disable-next-line no-param-reassign
      code = code.split('');
      // ∑(ai×Wi)(mod 11)//加权因子
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 校验位
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i += 1) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      // const last = parity[sum % 11];
      if (parity[sum % 11] !== code[17]) {
        tip = '身份证校验位错误';
        pass = false;
      }
    }
  }
  if (!msg) tip = msg;
  if (!pass) message.error(tip);
  return pass;
}
// 函数校验手机号
export function checkPhone(idNo?: any, msg?: any) {
  const reg = /^1\d{10}$/;
  let msgNew = '';
  if (!msg) {
    msgNew = '手机号校验不通过';
  } else {
    msgNew = msg;
  }

  if (reg.test(idNo)) {
    return true;
  }
  message.error(msgNew);
  return false;
}

function checkSocialCreditCode(Code?: any) {
  const codes = Code.toUpperCase();
  if (codes.length !== 18) {
    return false;
  }
  let reg = /^\w\w\d{6}\w{9}\w$/;
  if (!reg.test(codes)) {
    return false;
  }
  reg = /^[1,5,9,Y]\w\d{6}\w{9}\w$/;
  if (!reg.test(codes)) {
    return false;
  }
  reg = /^(11|12|13|19|51|52|53|59|91|92|93|Y1)\d{6}\w{9}\w$/;
  if (!reg.test(codes)) {
    return false;
  }
  reg = /^(11|12|13|19|51|52|53|59|91|92|93|Y1)\d{6}\w{9}\w$/;
  if (!reg.test(codes)) {
    return false;
  }
  let Ancode; // 统一社会信用代码的每一个值
  let Ancodevalue; // 统一社会信用代码每一个值的权重
  let total = 0;
  const weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]; // 加权因子
  const str = '0123456789ABCDEFGHJKLMNPQRTUWXY'; // 不用I、O、S、V、Z
  for (let i = 0; i < Code.length - 1; i += 1) {
    Ancode = Code.substring(i, i + 1);
    Ancodevalue = str.indexOf(Ancode);
    total += Ancodevalue * weightedfactors[i]; // 权重与加权因子相乘之和
  }
  let logiccheckcode = 31 - (total % 31);
  if (logiccheckcode === 31) {
    logiccheckcode = 0;
  }
  const Str = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y';
  const ArrayStr = Str.split(',');
  logiccheckcode = ArrayStr[logiccheckcode.toString()];
  const checkcode = Code.substring(17, 18);
  if (logiccheckcode !== checkcode) {
    return false;
  }
  return true;
}

export function validatorSocialCreditCode(value: any, callback: (message?: string) => void) {
  if (!value) {
    callback('888');
  }
  if (!checkSocialCreditCode(value)) {
    callback('请输入正确的证照号码！');
  }
  callback();
}

function checkMob(value?: any) {
  const isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
  if (!isMob.test(value)) {
    return false;
  }
  return true;
}

function checkPhones(value?: any) {
  const isPhone = /^(0?[0-9]{2,3}-?){0,1}[0-9]{7,8}(-[0-9]{1,4}){0,1}$/;
  if (!isPhone.test(value)) {
    return false;
  }
  return true;
}

// 电话号码正则校验--座机和手机号
export function checkMobAndPhone(value: any, callback: (message?: string) => void) {
  if (!value) {
    callback();
  }
  if (value.indexOf('-') > 0) {
    if (!checkPhones(value)) {
      callback('请输入正确的固话号码！');
      return;
    }
  } else if (!checkMob(value)) {
    callback('请输入正确的手机号码！');
    return;
  }
  callback();
}
export const numAndAmpha = /^[A-Za-z0-9]+$/;
