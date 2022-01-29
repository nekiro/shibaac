import * as Yup from 'yup';

export const deleteCharacterSchema = Yup.object().shape({
  //name: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export type DeleteCharacter = Yup.TypeOf<typeof deleteCharacterSchema>;
