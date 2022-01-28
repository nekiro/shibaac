import React from 'react';

const Label = ({ text, success }) => {
  return (
    <span
      style={{ fontSize: '14px' }}
      className={`label ${success ? 'label-success' : 'label-danger'}`}
    >
      {text}
    </span>
  );
};

export default Label;
