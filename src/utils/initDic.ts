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
