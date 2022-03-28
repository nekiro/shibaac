import Layout from 'src/layout';
import { UserContextWrapper } from 'src/hooks/useUser';
import { ChakraProvider } from '@chakra-ui/react';
import { Theme, Fonts } from 'src/layout/theme';

export default function MyApp({ Component, pageProps }) {
  return (
    <UserContextWrapper>
      <ChakraProvider theme={Theme}>
        <Fonts />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </UserContextWrapper>
  );
}
