import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUser } from '../../hooks/useUser';
import fetchJson from '../../util/fetchJson';

export default function Logout() {
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    fetchJson('/api/accounts/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setUser(null);

    router.push('/');
  }, [setUser, router]);

  return null;
}
