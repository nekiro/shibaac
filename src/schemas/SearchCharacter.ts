import * as Yup from 'yup';

export const searchCharacterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
});

export type ChangeEmail = Yup.TypeOf<typeof searchCharacterSchema>;
