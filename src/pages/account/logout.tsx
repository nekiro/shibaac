import { useRouter } from 'next/router';
import { useEffect, useCallback } from 'react';
import { useUser } from '../../hooks/useUser';
import { fetchApi } from '../../lib/request';

export default function Logout() {
  const router = useRouter();
  const { setUser } = useUser();

  const postLogout = async () => {
    await fetchApi('POST', '/api/account/logout');
    setUser(null);
    router.push('/');
  };

  useEffect(() => {
    postLogout();
  });

  return null;
}
