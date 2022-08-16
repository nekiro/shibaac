import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import {
  VStack,
  FormControl,
  FormLabel,
  Container,
  FormErrorMessage,
  Wrap,
  useToast,
} from '@chakra-ui/react';

import TextInput from './TextInput';

import Button from './Button';

const FormWrapper = ({
  initialValues,
  validationSchema,
  onSubmit,
  fields,
  buttons,
  response,
}) => {
  if (!initialValues) {
    initialValues = {};
    fields.forEach((field) => {
      initialValues[field.name] = '';
    });
  }

  const toast = useToast();

  useEffect(() => {
    if (
      response &&
      response.message.length > 0 &&
      !toast.isActive('forms-response-toast')
    ) {
      toast({
        title: response.message,
        id: 'forms-response-toast',
        position: 'top',
        status: response.success ? 'success' : 'error',
        isClosable: true,
        duration: 10000,
      });
    }
  }, [response, toast]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validate={true}
    >
      {({ errors, values, isValid, isSubmitting }) => (
        <Form>
          <Container alignContent padding={2}>
            <VStack spacing={5}>
              {fields &&
                fields.map((field) => (
                  <FormControl key={field.name} isInvalid={!isValid}>
                    <FormLabel fontSize="sm" htmlFor={field.name}>
                      {field.label.text}
                    </FormLabel>
                    <Field
                      as={field.as ?? TextInput}
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                    >
                      {field.options &&
                        field.options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.text}
                          </option>
                        ))}
                    </Field>
                    <FormErrorMessage fontSize="sm">
                      {errors[field.name]}
                    </FormErrorMessage>
                  </FormControl>
                ))}

              <Wrap spacing={2} padding="10px">
                {buttons.map((button) => (
                  <Button
                    isLoading={button.type == 'submit' && isSubmitting}
                    loadingText="Submitting"
                    key={button.value}
                    type={button.type}
                    value={button.value}
                    btnType={button.btnType}
                    href={button.href}
                  />
                ))}
              </Wrap>
            </VStack>
          </Container>
        </Form>
      )}
    </Formik>
  );
};

export default FormWrapper;
