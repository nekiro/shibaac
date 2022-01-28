import React from 'react';
import Link from 'next/link';

const Button = ({ value, type, btnType, href }) => {
  return href ? (
    <Link href={href} passHref>
      <button type={type} className={`btn btn-${btnType}`}>
        {value}
      </button>
    </Link>
  ) : (
    <button type={type} className={`btn btn-${btnType}`}>
      {value}
    </button>
  );
};

Button.defaultProps = {
  value: '',
  type: 'button',
  btnType: 'default',
  href: null,
};

export default Button;
