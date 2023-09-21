import React from 'react';
import { Select } from '@chakra-ui/react';

export const CustomSelect = ({ field, ...props }) => {
  return (
    <Select {...field} {...props}>
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </Select>
  );
};
