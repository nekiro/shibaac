import React from 'react';
import Loader from '../Loader';
import style from './panel.module.css';

const FloatingWindow = ({ header, date, identifier, children, isLoading }) => {
  return (
    <div key={identifier} className="panel panel-default">
      <div key={identifier} className="panel-heading">
        <span className="col-span-3">{header}</span>
        {date ? (
          <div className="row-span-1 text-right">
            <i className="fa fa-clock-o"></i> {date}
          </div>
        ) : null}
      </div>
      <div className="panel-body">{isLoading ? <Loader /> : children}</div>
    </div>
  );
};

FloatingWindow.defaultProps = {
  header: 'Loading...',
  date: null,
  identifier: null,
  isLoading: false,
};

export default FloatingWindow;
