export type ButtonProps = {
  value: string;
  size?: string;
  type?: ButtonType;
  href?: string;
  btnColorType: ButtonColorType;
  isLoading: boolean;
  isActive: boolean;
  loadingText: string;
};

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonColorType = 'danger' | 'primary';
