import React from 'react';
import { Tag } from '@chakra-ui/react';

interface LabelProps {
  colorScheme?: string;
  fontSize?: string;
  margin?: string;
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({
  colorScheme = 'violet',
  fontSize = 'md',
  margin = '0px',
  children,
}) => {
  return (
    <Tag colorScheme={colorScheme} fontSize={fontSize} m={margin}>
      {children}
    </Tag>
  );
};

export default Label;
