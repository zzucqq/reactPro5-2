import React, { useContext } from 'react';
import type { IColorContext } from './Color';
import { ColorContext, UPDATE_COLOR } from './Color';

const Btns = () => {
  const { dispatch } = useContext(ColorContext) as IColorContext;
  return (
    <div>
      <button onClick={() => dispatch({ type: UPDATE_COLOR, color: 'yellow' })}>yellow</button>
      <button onClick={() => dispatch({ type: UPDATE_COLOR, color: 'red' })}>red</button>
      <button onClick={() => dispatch({ type: UPDATE_COLOR, color: 'green' })}>恢复</button>
    </div>
  );
};
export default Btns;
