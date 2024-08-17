import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Select,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { fetchApi } from '../../lib/request';
import { withSessionSsr } from '../../lib/session';
import { createCharacterSchema } from '../../schemas/CreateCharacter';
import { ApiResponse } from '../../shared/types/ApiResponse';
import { useRouter } from 'next/router';
import Panel from '../../components/Panel';

const startLocation = process.env.NEXT_PUBLIC_START_ON_ROOK;

const vocations = [
  {
    value: '1',
    label: 'Druid',
    imageSrc: '/images/character/druid.jpg',
    description: 'A wise and powerful druid.',
  },
  {
    value: '2',
    label: 'Sorcerer',
    imageSrc: '/images/character/mage.jpg',
    description: 'Exevo gran mas vis.',
  },
  {
    value: '3',
    label: 'Paladin',
    imageSrc: '/images/character/paladin.jpg',
    description: 'A quick and agile hunter.',
  },
  {
    value: '4',
    label: 'Knight',
    imageSrc: '/images/character/knight.jpg',
    description: 'A brave and strong warrior.',
  },
];

const initialValues = {
  name: '',
  vocation: startLocation === 'rookguard' ? '0' : '1',
  sex: '0',
  server: 'Lumara',
};

export default function CreateCharacter() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [selectedVocation, setSelectedVocation] = useState(
    initialValues.vocation,
  );
  const router = useRouter();

  const onSubmit = async (values: typeof initialValues) => {
    const response: ApiResponse = await fetchApi(
      'POST',
      '/api/account/createcharacter',
      {
        data: {
          name: values.name,
          vocation: selectedVocation,
          sex: values.sex,
          server: values.server,
        },
      },
    );

    setResponse(response);

    if (response.success) {
      router.push('/account/login');
    }
  };

  return (
    <Panel header="Create Character">
      <Text align="center" margin="10px">
        Please choose a name, vocation, and sex for your character. <br />
        In any case, the name must not violate the naming conventions stated in
        the Rules or your character might get deleted or name locked.
      </Text>

      <Flex
        direction="column"
        align="center"
        p={6}
        bg="blackAlpha.900"
        borderRadius="md"
        boxShadow="xl"
      >
        <Text fontSize="2xl" mb={6} color="white" fontWeight="bold">
          Create Your Hero
        </Text>

        <Flex justify="center" mb={8} wrap="wrap">
          {vocations.map((vocation) => (
            <Tooltip
              key={vocation.value}
              label={vocation.description}
              aria-label={vocation.description}
            >
              <Box
                border={
                  selectedVocation === vocation.value
                    ? `2px solid rgb(178, 120, 255)`
                    : '2px solid transparent'
                }
                bg="rgba(255, 255, 255, 0.1)"
                borderRadius="md"
                overflow="hidden"
                onClick={() => setSelectedVocation(vocation.value)}
                cursor="pointer"
                mx={2}
                p={3}
                transition="all 0.3s"
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: `0px 0px 10px rgb(178, 120, 255)`,
                }}
              >
                <Image
                  src={vocation.imageSrc}
                  alt={vocation.label}
                  boxSize="150px"
                  borderRadius="md"
                />
                <Text textAlign="center" mt={2} fontWeight="bold" color="white">
                  {vocation.label}
                </Text>
              </Box>
            </Tooltip>
          ))}
        </Flex>

        <Formik
          initialValues={initialValues}
          validationSchema={createCharacterSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={{ width: '100%', maxWidth: '400px' }}>
              {' '}
              {/* Ajuste na largura */}
              <Box mb={4}>
                <Text mb={2} color="white">
                  Nickname
                </Text>
                <Field
                  as={Input}
                  name="name"
                  placeholder="Enter nickname"
                  mb={3}
                  h="50px"
                  bg="gray.800"
                  borderColor="gray.600"
                  color="white"
                  _placeholder={{ color: 'gray.500' }}
                  borderRadius="md"
                />
                <Text color="red.500" fontSize="sm">
                  <ErrorMessage name="name" />
                </Text>
              </Box>
              <Flex justifyContent="space-between" mb={4}>
                <Box width="48%">
                  <Text mb={2} color="white">
                    Sex
                  </Text>
                  <Field
                    as={Select}
                    name="sex"
                    h="50px"
                    bg="gray.800"
                    borderColor="gray.600"
                    color="white"
                    borderRadius="md"
                  >
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                  </Field>
                  <Text color="red.500" fontSize="sm">
                    <ErrorMessage name="sex" />
                  </Text>
                </Box>

                <Box width="48%">
                  <Text mb={2} color="white">
                    Server
                  </Text>
                  <Field
                    as={Select}
                    name="server"
                    h="50px"
                    bg="gray.800"
                    borderColor="gray.600"
                    color="white"
                    borderRadius="md"
                  >
                    <option value="Lumara">Lumara</option>
                    <option value="Other">Other</option>
                  </Field>
                  <Text color="red.500" fontSize="sm">
                    <ErrorMessage name="server" />
                  </Text>
                </Box>
              </Flex>
              <Button
                type="submit"
                bg="rgb(178, 120, 255)"
                color="white"
                width="100%"
                h="50px"
                mt={6}
                borderRadius="md"
                _hover={{ bg: 'rgb(150, 100, 230)' }}
                _active={{ bg: 'rgb(150, 100, 230)' }}
                boxShadow="lg"
                isLoading={isSubmitting}
              >
                Create Character
              </Button>
            </Form>
          )}
        </Formik>
      </Flex>
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
