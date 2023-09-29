import React, { useEffect, useState, useCallback } from 'react';
import Panel from '../../components/Panel';
import { withSessionSsr } from '../../lib/session';
import { fetchApi } from '../../lib/request';
import FormWrapper from '../../components/FormWrapper';
import { deleteCharacterSchema } from 'src/schemas/DeleteCharacter';
import { Select, Text } from '@chakra-ui/react';

const buttons = [
  { type: 'submit', btnType: 'primary', value: 'Submit' },
  { href: '/account', value: 'Back' },
];

export default function DeleteCharacter({ user }) {
  const [response, setResponse] = useState(null);
  const [data, setData] = useState(null);

  const fetchCharacters = useCallback(async () => {
    const response = await fetchApi('GET', `/api/account/${user.id}`);
    if (response.success) {
      setData({
        fields: [
          {
            as: Select,
            name: 'name',
            label: { text: 'Name', size: 3 },
            size: 9,
            options: response.account.players.map((char) => ({
              value: char.name,
              text: char.name,
            })),
          },
          {
            type: 'password',
            name: 'password',
            label: { text: 'Password', size: 3 },
            size: 9,
          },
        ],
        initialValues: {
          name: response.account.players[0]?.name,
          password: '',
        },
      });
    }
  }, [user]);

  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  if (!data) {
    return <Panel isLoading={true} />;
  }

  const onSubmit = async (values, { resetForm }) => {
    const response = await fetchApi('POST', '/api/account/deletecharacter', {
      data: {
        name: values.name,
        password: values.password,
      },
    });

    setResponse(response);
    resetForm();
  };

  return (
    <Panel header="Delete Character">
      <Text align="center" margin="10px">
        To delete a character choose the character and enter your password.
      </Text>

      <FormWrapper
        validationSchema={deleteCharacterSchema}
        onSubmit={onSubmit}
        fields={data.fields}
        buttons={buttons}
        response={response}
        initialValues={data.initialValues}
      />
    </Panel>
  );
}

export const getServerSideProps = withSessionSsr(async function ({ req }) {
  const { user } = req.session;
  if (!user) {
    return {
      redirect: {
        destination: '/account/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
});
