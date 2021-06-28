import { checkNull } from '@/utils/functions/validation';

export function setDicData(dicData?: any) {
  return sessionStorage.setItem('dic', JSON.stringify(dicData));
}

export function getDicData() {
  if (!checkNull(sessionStorage.getItem('dic'))) {
    return JSON.parse(sessionStorage.getItem('dic') as any);
  }
  return [];
}

export function getDicComDescByCde(dicName?: any, text?: any) {
  const dic = getDicData()[dicName];
  if (!dic) {
    return text;
  }
  if (checkNull(text)) {
    return '';
  }
  const cde = text.split(',');
  let desc = '';
  for (let j = 0; j < cde.length; j += 1) {
    for (let i = 0; i < dic.length; i += 1) {
      const { k, v } = dic[i];
      if (k === cde[j]) {
        if (j === 0) {
          desc += v;
        } else {
          desc = `${desc},${v}`;
        }
      }
    }
  }
  if (desc === '') {
    desc = text;
  }
  return desc;
}
