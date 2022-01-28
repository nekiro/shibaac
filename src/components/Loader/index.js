import React from 'react';
import style from './style.module.css';

const Loader = () => {
  return (
    <div className={style['loader-wrapper']}>
      <div className={style.spinner} />
    </div>
  );
};

export default Loader;
