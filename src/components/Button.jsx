import React from 'react';
import Link from 'next/link';
import { Button as ChakraButton } from '@chakra-ui/react';

const btnTypeToColor = { danger: 'red', primary: 'violet' };

const Button = ({
  value,
  type,
  btnType,
  size,
  href,
  isLoading,
  loadingText,
}) => {
  const btn = (
    <ChakraButton
      type={type}
      colorScheme={btnTypeToColor[btnType]}
      size={size}
      fontWeight="normal"
      isLoading={isLoading}
      loadingText={loadingText}
    >
      {value}
    </ChakraButton>
  );

  return href ? (
    <Link href={href} passHref>
      {btn}
    </Link>
  ) : (
    btn
  );
};

Button.defaultProps = {
  value: '',
  size: 'md',
  type: 'button',
  color: null,
  href: null,
  btnType: 'primary',
};

export default Button;
