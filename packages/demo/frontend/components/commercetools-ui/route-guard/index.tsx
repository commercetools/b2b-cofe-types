import { useAccount } from 'frontastic';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';

const RouteGuard: React.FC<{ children }> = ({ children }): ReactElement => {
  const { loggedIn } = useAccount();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const debounced = useRef(
    debounce(async (isLoggedIn) => {
      const path = router.asPath.split('?')[0];

      const publicPaths = ['/login', '/register'];

      if (!isLoggedIn && !publicPaths.includes(path)) {
        await router.push({
          pathname: '/login',
          query: { returnUrl: router.asPath },
        });
      }
      setIsLoading(false);
    }, 400),
  );

  useEffect(() => debounced.current(loggedIn), [loggedIn]);

  return (
    <>
      {isLoading && <div>loading</div>}
      {!isLoading && children}
    </>
  );
};

export default RouteGuard;
