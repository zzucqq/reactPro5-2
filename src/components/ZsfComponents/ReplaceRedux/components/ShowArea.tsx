import React, { useContext } from 'react';
import type { IColorContext, ICountContext } from './Color';
import { CountContext } from './Color';
import { ColorContext } from './Color';

const ShowArea = () => {
  const { color } = useContext(ColorContext) as IColorContext;
  const { count, setCount } = (useContext(CountContext) as unknown) as ICountContext;
  const add = () => {
    setCount(count + 1);
  };
  return (
    <>
      <div style={{ color }}>你好</div>
      <div>数字：{count}</div>
      <button onClick={add}>+1</button>
    </>
  );
};
export default ShowArea;
