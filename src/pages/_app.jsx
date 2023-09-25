import Layout from 'src/layout';
import { UserContextWrapper } from 'src/hooks/useUser';
import { ChakraProvider } from '@chakra-ui/react';
import { Theme, Fonts } from 'src/layout/theme';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

// @ts-ignore
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

export default function MyApp({ Component, pageProps }) {
  return (
    <UserContextWrapper>
      <ChakraProvider theme={Theme}>
        <Fonts />
        <Layout>
          <PayPalScriptProvider
            options={{
              'client-id':
                'ARAYaginzctapHBubF6s84ro_XNmK1pu2VR2_vcOaj6BVBN49GxzBL8TNJxUJs1NuMH7vinG6bigMCqS',
              currency: 'BRL',
            }}
          >
            <Component {...pageProps} />
          </PayPalScriptProvider>
        </Layout>
      </ChakraProvider>
    </UserContextWrapper>
  );
}
