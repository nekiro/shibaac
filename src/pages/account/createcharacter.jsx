import React, { useState } from 'react';
import Panel from '../../components/Panel';
import { withSessionSsr } from '../../util/session';
import { fetchApi } from '../../util/request';
import * as Yup from 'yup';
import FormWrapper from '../../components/FormWrapper';

// TODO: fix this schema with all requirements
const Schema = Yup.object().shape({
  name: Yup.string().required('Required'),
});

const fields = [
  {
    type: 'text',
    name: 'name',
    placeholder: '4 to 30 characters',
    label: { text: 'Name', size: 3 },
    size: 9,
  },
  {
    as: 'select',
    name: 'vocation',
    label: { text: 'Vocation', size: 3 },
    size: 9,
    options: [
      { value: '1', text: 'Sorcerer' },
      { value: '2', text: 'Druid' },
      { value: '3', text: 'Paladin' },
      { value: '4', text: 'Knight' },
    ],
  },
  {
    as: 'select',
    name: 'sex',
    label: { text: 'Sex', size: 3 },
    size: 9,
    options: [
      { value: '0', text: 'Female' },
      { value: '1', text: 'Male' },
    ],
  },
];

const buttons = [
  { type: 'submit', btnType: 'primary', value: 'Submit' },
  { href: '/account', value: 'Back' },
];

const initialValues = {
  name: '',
  vocation: '1',
  sex: '0',
};

export default function CreateCharacter() {
  const [response, setResponse] = useState(null);

  const onSubmit = async (values, { resetForm }) => {
    const response = await fetchApi('POST', '/api/accounts/createcharacter', {
      data: {
        name: values.name,
        vocation: values.vocation,
        sex: values.sex,
      },
    });

    setResponse(response);
    resetForm();
  };

  return (
    <Panel header="Create Character">
      <p align="center">
        Please choose a name, vocation and sex for your character. <br />
        In any case the name must not violate the naming conventions stated in
        the Rules or your character might get deleted or name locked.
      </p>

      <FormWrapper
        validationSchema={Schema}
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
