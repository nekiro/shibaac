import React from 'react';
import { Input } from '@chakra-ui/react';

const TextInput = (props) => {
  return (
    <Input
      {...props}
      variant="filled"
      _focus={{ borderColor: 'violet.400' }}
      _hover={{ borderColor: 'violet.400' }}
      borderColor="violet.200"
      bg="white"
      _placeholder={{ color: 'purple.900' }}
    />
  );
};

TextInput.defaultProps = {
  placeholder: '',
  type: 'text',
  name: '',
};

export default TextInput;
