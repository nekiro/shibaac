import * as Yup from 'yup';

export const recoverPasswordSchema = Yup.object().shape({
  email: Yup.string().when('type', {
    is: '1',
    then: Yup.string().email('Invalid email').required('Email is required'),
    otherwise: Yup.string().email('Invalid email').notRequired(),
  }),
  characterName: Yup.string().when('type', {
    is: '1',
    then: Yup.string().required('Character name is required'),
    otherwise: Yup.string().notRequired(),
  }),
  accountName: Yup.string().when('type', {
    is: '1',
    then: Yup.string().required('Account name is required'),
    otherwise: Yup.string().notRequired(),
  }),
  recoveryKey: Yup.string().when('type', {
    is: '2',
    then: Yup.string().required('Recovery key is required'),
    otherwise: Yup.string().notRequired(),
  }),
  type: Yup.string().required('Type is required'),
});
