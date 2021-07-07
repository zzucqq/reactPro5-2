import type { ReactElement } from 'react';
import React, { createContext, useReducer, useState } from 'react';

export const ColorContext = createContext({});
export const CountContext = createContext(0);
export const UPDATE_COLOR = 'updateColor';
export interface IColorContext {
  color: string;
  dispatch: Function;
}
export interface ICountContext {
  count: number;
  setCount: Function;
}

const reducer2 = (state: string, action: { type: string; color: string }) => {
  switch (action.type) {
    case UPDATE_COLOR:
      return action.color;
    default:
      return state;
  }
};

interface IProps {
  children: ReactElement[];
}

/**
 * useReducer
 * 有两个参数 一个是reducer函数【接受两个参数 一个state 一个action，action可以改变state的值】,一个是初始化state的值，此处是初始化color值为'blue'
 * 返回一个状态color 和 dispatch
 *
 * useContext
 * 1:先创建createContex const C = createContext(null)
 * 2:Provoder 指定使用的范围
 * <C.Provider value={{n,setN}}>
 * </C.Provider>
 * 3:使用useContext
 * const {n,setN} = useContext(C)
 *
 */

const Color = (props: IProps) => {
  const [color, dispatch] = useReducer(reducer2, 'blue');
  const [count, setCount] = useState(null);
  return (
    <div>
      <ColorContext.Provider value={{ color, dispatch }}>
        <CountContext.Provider value={{ count, setCount }}>{props.children}</CountContext.Provider>
      </ColorContext.Provider>
    </div>
  );
};

export default Color;
