import React from 'react';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { FlyingCart } from 'components/commercetools-ui/flying-cart';
import RouteGuard from 'components/commercetools-ui/route-guard';
import Toaster from 'components/commercetools-ui/toaster';
import { FrontasticProvider, UIStateProvider } from 'frontastic';
import 'tailwindcss/tailwind.css';
import '../styles/app.css';
import '../styles/themes/default.css';
import '../styles/themes/theme1.css';
import '../styles/themes/theme2.css';
import '../styles/themes/theme3.css';
import '../styles/components/index.scss';
import { BusinessUnitProvider } from 'frontastic/provider/BusinessUnitState';

function FrontasticStarter({ Component, pageProps }: AppProps) {
  return (
    <FrontasticProvider>
      <BusinessUnitProvider>
        <UIStateProvider>
          <RouteGuard>
            <Component {...pageProps} />
            <Toaster />
            <FlyingCart />
          </RouteGuard>
        </UIStateProvider>
      </BusinessUnitProvider>
    </FrontasticProvider>
  );
}

export default appWithTranslation(FrontasticStarter);
