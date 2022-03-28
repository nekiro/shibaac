import React from 'react';

import { Input } from '@chakra-ui/react';

const TextInput = ({ placeholder, type, name }) => {
  return (
    <Input
      placeholder={placeholder}
      variant="filled"
      _focus={{ borderColor: 'violet.400' }}
      _hover={{ borderColor: 'violet.400' }}
      borderColor="violet.200"
      bg="white"
      name={name}
      type={type}
    />
  );
};

TextInput.defaultProps = {
  placeholder: '',
  type: 'text',
  name: '',
};

export default TextInput;
