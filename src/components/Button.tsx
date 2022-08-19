import React from 'react';
import Link from 'next/link';
import { Button as ChakraButton } from '@chakra-ui/react';

const btnTypeToColor = { danger: 'red', primary: 'violet' };

type ButtonProps = {
  value: string;
  size?: string;
  type: 'button' | 'submit' | 'reset';
  href?: string;
  btnType: string;
  isLoading: boolean;
  isActive: boolean;
  loadingText: string;
};

const Button = ({
  value,
  type = 'button',
  btnType = 'primary',
  size = 'md',
  href,
  isLoading,
  isActive,
  loadingText,
}: ButtonProps) => {
  const btn = (
    <ChakraButton
      type={type}
      colorScheme={btnTypeToColor[btnType]}
      size={size}
      fontWeight="normal"
      isLoading={isLoading}
      isActive={isActive}
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

export default Button;
