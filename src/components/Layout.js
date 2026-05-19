import Head from 'next/head';
import Script from 'next/script';
import Header from './Header';
import Footer from './Footer';
import { getSupportedLanguages } from '../lib/i18n';

const defaultNav = {
  video: 'Pinterest Video Downloader',
  image: 'Pinterest Image Downloader'
};

const defaultMeta = {
  title: 'Pinterest Video Downloader – Download Pinterest Videos in HD',
  description: 'Pinterest Video Downloader to download videos from Pinterest in high quality easily. Works safely on all devices including PC, mobile or tablet.',
  keywords: 'Pinterest, video, downloader, HD, download'
};

const TRANSLATABLE_ROUTES = new Set(['/', '/pinterest-image-downloader']);

function normalizeRoute(route) {
  if (!route || route === '/') {
    return '/';
  }

  const normalized = route.endsWith('/') ? route.slice(0, -1) : route;
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function getBaseRoute(route) {
  const normalized = normalizeRoute(route);
  const parts = normalized.split('/').filter(Boolean);
  if (parts.length > 0 && getSupportedLanguages().includes(parts[0])) {
    return parts.length === 1 ? '/' : `/${parts.slice(1).join('/')}`;
  }
  return normalized;
}

export default function Layout({ children, lang = 'en', nav = defaultNav, currentRoute = '/', meta = defaultMeta }) {
  const supportedLanguages = getSupportedLanguages();
  const normalizedRoute = normalizeRoute(currentRoute);
  const canonicalPath = normalizedRoute === '/' ? '/' : `${normalizedRoute}/`;
  const baseRoute = getBaseRoute(currentRoute);
  const showAlternate = TRANSLATABLE_ROUTES.has(baseRoute);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={meta.keywords} />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="author" content="pinvideodown.com" />
        <meta name="publisher" content="pinvideodown.com" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href={canonicalPath} />
        {showAlternate && (
          <>
            {supportedLanguages.map((language) => {
              const hrefLangPath = language === 'en' ? baseRoute : `/${language}${baseRoute === '/' ? '' : baseRoute}`;
              const relativePath = hrefLangPath === '/' ? '/' : `${hrefLangPath}/`;
              return <link key={language} rel="alternate" hrefLang={language} href={relativePath} />;
            })}
            <link rel="alternate" hrefLang="x-default" href={canonicalPath} />
          </>
        )}
        <Script 
          async 
          src="https://www.googletagmanager.com/gtag/js?id=G-FFD45968XK" 
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function gtag(){dataLayer.push(arguments)}
              window.dataLayer=window.dataLayer||[];
              gtag('js',new Date());
              gtag('config','G-FFD45968XK');
            `,
          }}
        />
      </Head>
      <div className="min-h-screen text-slate-900">
        <Header lang={lang} nav={nav} currentRoute={currentRoute} />
        <main>{children}</main>
        <Footer lang={lang} />
      </div>
    </>
  );
}
