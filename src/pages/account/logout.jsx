import { useRouter } from 'next/router';
import { useEffect, useCallback } from 'react';
import { useUser } from 'src/hooks/useUser';
import { fetchApi } from 'src/util/request';

export default function Logout() {
  const router = useRouter();
  const { setUser } = useUser();

  const postLogout = useCallback(async () => {
    await fetchApi('POST', '/api/accounts/logout');
    setUser(null);
    router.push('/');
  }, [router, setUser]);

  useEffect(() => {
    postLogout();
  }, [postLogout]);

  return null;
}
