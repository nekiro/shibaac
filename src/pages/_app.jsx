import Layout from '../layout/layout';

import { UserContextWrapper } from '../hooks/useUser';

import '../../public/css/metro-bootstrap.css';
import '../../public/css/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <UserContextWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContextWrapper>
  );
}
