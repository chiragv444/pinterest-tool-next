import '../styles/globals.css';
import { SiteUrlProvider } from '../lib/siteUrlContext';
import { getSiteUrlStatic } from '../lib/siteUrl';

export default function MyApp({ Component, pageProps }) {
  const siteUrl = getSiteUrlStatic();
  return (
    <SiteUrlProvider siteUrl={siteUrl}>
      <Component {...pageProps} />
    </SiteUrlProvider>
  );
}
