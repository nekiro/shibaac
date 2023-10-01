import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface PropsI {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  height?: number | string;
  onImageUpload: (file: File, callback: (url: string) => void) => void;
}

export const TextEditor = (props: PropsI) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <Editor
        apiKey="vavrcexgdwv0drlb9h8z4ijv2zazzrd1esoz70sy669sz4r6"
        value={props.value}
        disabled={props.disabled || loading}
        init={{
          language: 'pt_BR',
          height: props.height ?? 530,
          width: '100%',
          menubar: true,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'emoticons',
            'link',
            'image',
            'charmap',
            'preview',
            'searchreplace',
            'visualblocks',
            'code',
            'insertdatetime',
            'media',
            'table',
            'code',
            'wordcount',
          ],
          toolbar:
            'blocks bold italic underline forecolor | emoticons image media | alignleft aligncenter alignright bullist numlist',
          file_picker_callback(callback, value, meta) {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.onchange = (_) => {
              if (!input.files) return;
              const file = input.files[0];
              props.onImageUpload(file, callback);
            };

            input.click();
          },

          file_picker_types: 'image',
        }}
        onEditorChange={(content, _) => {
          if (props.onChange) props.onChange(content);
        }}
      />
    </>
  );
};
