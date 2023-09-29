import React, { useState } from 'react';
import { FormikHelpers } from 'formik';
import Panel from '../../components/Panel';
import { withSessionSsr } from '../../lib/session';
import { fetchApi } from '../../lib/request';
import FormWrapper from '../../components/FormWrapper';
import { createCharacterSchema } from '../../schemas/CreateCharacter';
import { Select, Text } from '@chakra-ui/react';
import { ButtonProps } from '../../shared/types/FormButton';
import { ApiResponse } from '../../shared/types/ApiResponse';
import { FormValues } from '../../shared/interfaces/FormValues';

const startLocation = process.env.NEXT_PUBLIC_START_ON_ROOK;

const vocationsOptions =
  startLocation === 'rookguard'
    ? [{ value: '0', text: 'None' }]
    : [
        { value: '1', text: 'Sorcerer' },
        { value: '2', text: 'Druid' },
        { value: '3', text: 'Paladin' },
        { value: '4', text: 'Knight' },
      ];

const fields = [
  {
    type: 'text',
    name: 'name',
    placeholder: '3 to 29 characters',
    label: { text: 'Name', size: 3 },
    size: 9,
  },
  {
    as: Select,
    type: 'select',
    name: 'vocation',
    label: { text: 'Vocation', size: 3 },
    size: 9,
    options: vocationsOptions,
  },
];

const buttons: ButtonProps[] = [
  {
    type: 'submit',
    btnColorType: 'primary',
    value: 'Submit',
    isLoading: false,
    isActive: false,
    loadingText: 'Loading',
  },
  {
    href: '/account',
    value: 'Back',
    btnColorType: 'danger',
    isLoading: false,
    isActive: false,
    loadingText: 'Loading',
  },
];

const initialValues = {
  name: '',
  vocation: startLocation === 'rookguard' ? '0' : '1',
  sex: '0',
};

export default function CreateCharacter() {
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const onSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    const response: ApiResponse = await fetchApi(
      'POST',
      '/api/account/createcharacter',
      {
        data: {
          name: values.name,
          vocation: values.vocation,
          sex: values.sex,
        },
      },
    );

    setResponse(response);
    formikHelpers.resetForm();
  };

  return (
    <Panel header="Create Character">
      <Text align="center" margin="10px">
        Please choose a name, vocation and sex for your character. <br />
        In any case the name must not violate the naming conventions stated in
        the Rules or your character might get deleted or name locked.
      </Text>

      <FormWrapper
        validationSchema={createCharacterSchema}
        onSubmit={onSubmit}
        fields={fields}
        buttons={buttons}
        response={response}
        initialValues={initialValues}
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
    props: {},
  };
});
