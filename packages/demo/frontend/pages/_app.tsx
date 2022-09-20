import React, { useContext } from 'react';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import Toaster from 'components/commercetools-ui/toaster';
import { FrontasticProvider } from 'frontastic';
import 'tailwindcss/tailwind.css';
import '../styles/app.css';
import '../styles/themes/default.css';
import '../styles/themes/theme1.css';
import '../styles/themes/theme2.css';
import '../styles/themes/theme3.css';
import '../styles/components/slider.css';
import '../styles/components/default-loader.css';
import RouteGuard from 'components/commercetools-ui/route-guard';

function FrontasticStarter({ Component, pageProps }: AppProps) {
  return (
    <FrontasticProvider>
      <RouteGuard>
        <Component {...pageProps} />
        <Toaster />
      </RouteGuard>
    </FrontasticProvider>
  );
}

export default appWithTranslation(FrontasticStarter);
