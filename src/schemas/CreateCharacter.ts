import * as Yup from 'yup';

// TODO: add banned words, gm, tutor etc

export const createCharacterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Required')
    .min(3)
    .max(29)
    .matches(
      /^[aA-zZ\s]+$/,
      'Invalid letters, words or format. Use a-Z and spaces.'
    ),
});

export type CreateCharacter = Yup.TypeOf<typeof createCharacterSchema>;
