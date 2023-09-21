import React from 'react';
import { Select } from '@chakra-ui/react';

export const CustomSelect = ({ field, options }) => {
  return (
    <Select {...field}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </Select>
  );
};
