import sanitize from 'sanitize-html';
import { useState, useEffect, useCallback } from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { fetchApi } from '../lib/request';
import HeaderBanner from '../layout/HeaderBanner';

export default function Index() {
  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetchApi('GET', '/api/news');

      if (response.success) {
        setNews(response.data);
      }
    } catch (error) {
      console.error('Houve um problema', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const bgMaximized = useColorModeValue(
    'rgba(0, 0, 0, 0.7)',
    'rgba(0, 0, 0, 0.7)',
  );
  const bgMinimized = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  if (!news && !isLoading) {
    return (
      <Box
        width="100%"
        mt="20px"
        p={5}
        bg={bgMaximized}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="1rem"
        boxShadow="20px 0px 20px 20px rgba(0, 0, 0, 0.1)"
        color={textColor}
        textAlign="center"
      >
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <>
      <HeaderBanner />

      <Box
        width="100%"
        mt="20px"
        p={5}
        bg={bgMaximized}
        border="1px solid"
        borderColor={borderColor}
        boxShadow="20px 0px 20px 20px rgba(0, 0, 0, 0.1)"
        color={textColor}
      >
        {news?.map((post) => (
          <Box
            key={post.title}
            mb={8}
            p={5}
            ml={20}
            bg={bgMinimized}
            borderRadius="1rem"
            border="1px solid"
            borderColor={borderColor}
            boxShadow="md"
          >
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              {post.title}
            </Text>
            <Text fontSize="sm" mb={4}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
            <div dangerouslySetInnerHTML={{ __html: sanitize(post.content) }} />
          </Box>
        ))}
      </Box>
    </>
  );
}
