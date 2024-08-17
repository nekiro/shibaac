import * as Yup from 'yup';

export const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required('Please enter your name.')
    .min(5, 'The name must be at least 5 characters long.')
    .max(20, 'The name can be up to 20 characters long.')
    .matches(
      /^[aA-zZ0-9]+$/,
      'The name contains invalid characters. Please use only letters (a-Z) and numbers.',
    ),
  password: Yup.string()
    .required('Please enter your password.')
    .min(8, 'The password must be at least 8 characters long.')
    .max(20, 'The password can be up to 20 characters long.'),
  repeatPassword: Yup.string().when('password', {
    is: (val: string) => (val?.length > 0 ? true : false),
    then: Yup.string().oneOf(
      [Yup.ref('password')],
      'The passwords must match.',
    ),
  }),
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Please enter your email.'),
});

export type Register = Yup.TypeOf<typeof registerSchema>;
