import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export type Login = Yup.TypeOf<typeof loginSchema>;
