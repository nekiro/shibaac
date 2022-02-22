import * as Yup from 'yup';

const bannedSequences = ['tutor', 'cancer', 'suck', 'sux', 'fuck'];

const bannedWords = ['gm', 'cm', 'god'];

// Names is valid when:
// - doesn't contains banned words
// - has minimum of 3 letters and maximum of 29 characters
// - first letter is upper case alphabet character
// - last letter is lower case alphabet character
// - doesn't have more than 3 words
// - contains only alphabet letters and spaces

export const createCharacterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Field is required')
    .min(3)
    .max(29)
    .matches(
      /^[aA-zZ\s]+$/,
      'Invalid letters, words or format. Use a-Z and spaces.'
    )
    .test(
      'banned-words',
      'Contains illegal words',
      async (value: string | undefined) => {
        console.log(value);
        if (value) {
          const sequences = bannedSequences.filter(
            (str: string) =>
              value.split(' ').join('').indexOf(str.toLowerCase()) != -1
          );

          if (sequences.length > 0) {
            return false;
          }

          const words = value
            .split(' ')
            .filter((str: string) => bannedWords.includes(str.toLowerCase()));

          return words.length == 0;
        } else {
          return false;
        }
      }
    )
    .test(
      'first-char-alphabet',
      'First letter must be an A-Z capital letter.',
      async (value: any) => {
        return value?.charAt(0).match(/[A-Z]/);
      }
    )
    .test(
      'last-char-alphabet',
      'Last letter must be an a-z letter.',
      async (value: any) => {
        return value?.charAt(value?.length - 1).match(/[a-z]/);
      }
    )
    .test(
      'more-than-one-space-in-a-row',
      "Name can't have more than one space in a row.",
      async (value: any) => {
        return !value?.match(/\s\s+/);
      }
    )
    .test(
      'max-3-words',
      "Name can't have more than three words.",
      async (value: any) => {
        if (!value) return true;
        const split = value.split(' ');
        return split.length < 4;
      }
    ),
});

export type CreateCharacter = Yup.TypeOf<typeof createCharacterSchema>;
