import React, { useEffect } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
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
import Button, { ButtonType, ButtonColorType } from './Button';
import { FetchResult } from '../lib/request';

export type FormField = {
  type: string;
  name: string;
  label: { text: string };
  placeholder?: string;
  as?: any;
  options?: { value: string; text: string }[];
};

export type FormButton = {
  type?: ButtonType;
  btnColorType: ButtonColorType;
  value: string;
  href?: string;
};

type FormWrapperProps = {
  initialValues?: object;
  validationSchema: {};
  onSubmit: (
    values: any,
    formikHelpers: FormikHelpers<any>,
  ) => void | Promise<void>;
  fields: FormField[];
  buttons: FormButton[];
  response: FetchResult | null;
};

const FormWrapper = ({
  initialValues = {},
  validationSchema,
  onSubmit,
  fields,
  buttons,
  response,
}: FormWrapperProps) => {
  const toast = useToast();

  useEffect(() => {
    if (
      response &&
      response.message?.length > 0 &&
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

  if (Object.keys(initialValues).length === 0) {
    fields.forEach((field) => {
      initialValues[field.name] = '';
    });
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      validateOnMount={true}
    >
      {({ errors, isValid, isSubmitting }) => (
        <Form>
          <Container alignContent={'center'} padding={2}>
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
                      {errors[field.name] as string}
                    </FormErrorMessage>
                  </FormControl>
                ))}

              <Wrap spacing={2} padding="10px">
                {buttons.map((button) => (
                  <Button
                    isLoading={button.type == 'submit' && isSubmitting}
                    isActive={button.type == 'submit' && !isValid}
                    loadingText="Submitting"
                    key={button.value}
                    type={button.type}
                    value={button.value}
                    btnColorType={button.btnColorType}
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
