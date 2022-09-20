import { useAccount } from 'frontastic';
import React, { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AuthenticationWrapper: React.FC<{ children }> = ({ children }): ReactElement => {
  const { loggedIn } = useAccount();
  const router = useRouter();

  const [isAuthorized, setAuthorized] = useState(false);

  useEffect(() => {
    authCheck(router.asPath);

    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ['/login', '/register'];
    const path = url.split('?')[0];

    if (!loggedIn && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  }

  return isAuthorized && children;
};

export default AuthenticationWrapper;
