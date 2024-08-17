import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  name: Yup.string().required('Please enter your username.'),
  password: Yup.string().required('Please enter your password.'),
  twoFAToken: Yup.string(),
});

export type Login = Yup.TypeOf<typeof loginSchema>;
