export type Field = {
  type: string;
  name: string;
  placeholder?: string;
  label: {
    text: string;
    size: number;
  };
  size: number;
  options?: Option[];
};

type Option = {
  label: string;
  value: string | number;
  text: string;
};
