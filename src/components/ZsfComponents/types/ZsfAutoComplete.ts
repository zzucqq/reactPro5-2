import type { Dispatch } from 'umi';

export interface ZsfAutoCompleteProps {
  dataSourceModel: string;
  columns: any[]; // 列表表头
  selectStyle?: object; // 选择框的样式
  optionWidth?: object; // option的宽度
  fetchParams?: object; // 父组件传参数
  dataType?: any; // 当前行展示中文
  editOption?: any;
  value?: any;
  dispatch?: Dispatch<any>;
  onChange?: (value?: any) => void;
  autoCompleteonInputing?: (value?: any) => void;
  autoCompleteOnChange?: (value?: any, editOption?: any, option?: any) => void;
}
