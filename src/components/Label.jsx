import React from 'react';
import { Tag, Box } from '@chakra-ui/react';

const Label = ({ colorScheme, fontSize, margin, children }) => {
  return (
    <Tag variant="solid" colorScheme={colorScheme}>
      <Box fontSize={fontSize} margin={margin}>
        {children}
      </Box>
    </Tag>
  );
};

Label.defaultProps = {
  colorScheme: 'violet',
  fontSize: 'md',
  margin: '4px',
};

export default Label;
