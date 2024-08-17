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
    .required('Name is required.')
    .min(3, 'Name must be at least 3 characters long.')
    .max(29, 'Name must be at most 29 characters long.')
    .matches(
      /^[aA-zZ\s]+$/,
      'Invalid name: only letters (A-Z, a-z) and spaces are allowed.',
    )
    .test(
      'banned-words',
      'The name contains prohibited words.',
      (value: string | undefined) => {
        if (value) {
          const sequences = bannedSequences.filter(
            (str: string) =>
              value.split(' ').join('').toLowerCase().indexOf(str) !== -1,
          );

          if (sequences.length > 0) {
            return false;
          }

          const words = value
            .split(' ')
            .filter((str: string) => bannedWords.includes(str.toLowerCase()));

          return words.length === 0;
        } else {
          return false;
        }
      },
    )
    .test(
      'first-char-alphabet',
      'The first letter must be an uppercase letter (A-Z).',
      (value: string | undefined) => {
        return value ? /^[A-Z]/.test(value) : false;
      },
    )
    .test(
      'last-char-alphabet',
      'The last letter must be a lowercase letter (a-z).',
      (value: string | undefined) => {
        return value ? /[a-z]$/.test(value) : false;
      },
    )
    .test(
      'more-than-one-space-in-a-row',
      'The name cannot contain more than one consecutive space.',
      (value: string | undefined) => {
        return value ? !/\s\s+/.test(value) : false;
      },
    )
    .test(
      'max-3-words',
      'The name cannot contain more than three words.',
      (value: string | undefined) => {
        if (!value) return true;
        const split = value.split(' ');
        return split.length <= 3;
      },
    ),
});

export type CreateCharacter = Yup.TypeOf<typeof createCharacterSchema>;
