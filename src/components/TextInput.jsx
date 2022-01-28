import React from 'react';

const TextInput = ({ placeholder, type, name }) => {
  return (
    <input
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      type={type}
      name={name}
      placeholder={placeholder}
    />
  );
};

TextInput.defaultProps = {
  placeholder: '',
  type: 'text',
  name: '',
};

export default TextInput;
