import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Panel from '../../../components/Panel';
import Head from '../../../layout/Head';
import { fetchApi } from '../../../lib/request';
import { withSessionSsr } from '../../../lib/session';
import { TextEditor } from '../../../components/Editor';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
} from '@chakra-ui/react';

function EditNews() {
  const router = useRouter();
  const { id } = router.query;

  const [newsData, setNewsData] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchNewsDetails = async () => {
      if (!id) return;

      try {
        const response = await fetchApi('GET', `/api/news/${id}`);

        setNewsData(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        setImageUrl(response.data.imageUrl);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNewsDetails();
  }, [id]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await fetchApi('PUT', `/api/news/${id}`, {
        data: {
          title,
          content,
          imageUrl,
        },
      });

      router.push('/admin');
    } catch (error) {
      console.error(error);
    }
  };

  if (!newsData) return <div>Loading...</div>;

  return (
    <>
      <Head title="Edit News" />
      <Panel header="Edit News">
        <VStack spacing={4} w="100%">
          <FormControl id="title">
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl id="content">
            <FormLabel>Content</FormLabel>
            <TextEditor
              value={content}
              onChange={(value) => setContent(value)}
              onImageUpload={handleSubmit}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            type="submit"
            onClick={(event) => handleSubmit(event)}
          >
            Update
          </Button>
        </VStack>
      </Panel>
    </>
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

  if (user.type < Number(process.env.NEXT_PUBLIC_PERMISSION_ADMINPANEL)) {
    return {
      redirect: {
        destination: '/account',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
});

export default EditNews;
