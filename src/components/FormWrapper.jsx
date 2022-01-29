import React from 'react';
import { Formik, Form, Field } from 'formik';
import Label from './Label';
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

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors }) => (
        <Form className="form-horizontal">
          {response && (
            <p align="center">
              <Label success={response.success} text={response.message} />
            </p>
          )}

          {fields &&
            fields.map((field) => (
              <div className="form-group" key={field.name}>
                <label
                  htmlFor={field.name}
                  className={`col-lg-${field.label.size ?? 2} control-label`}
                >
                  {field.label.text}
                </label>
                <div className={`col-lg-${field.size ?? 10}`}>
                  <Field
                    as={field.as ?? 'input'}
                    type={field.type}
                    className="form-control"
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
                  <Label success={false} text={errors[field.name]} />
                </div>
              </div>
            ))}
          <div className="text-center">
            {buttons.map((button) => (
              <Button
                key={button.value}
                type={button.type}
                value={button.value}
                btnType={button.btnType}
                href={button.href}
              />
            ))}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormWrapper;
