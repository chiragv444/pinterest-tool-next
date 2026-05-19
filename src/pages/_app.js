import App from 'next/app';
import '../styles/globals.css';
import { getSiteUrl } from '../lib/siteUrl';
import { SiteUrlProvider } from '../lib/siteUrlContext';

export default function MyApp({ Component, pageProps, siteUrl }) {
  return (
    <SiteUrlProvider siteUrl={siteUrl}>
      <Component {...pageProps} />
    </SiteUrlProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  const siteUrl = getSiteUrl(appContext.ctx.req);

  return {
    ...appProps,
    siteUrl,
  };
};
