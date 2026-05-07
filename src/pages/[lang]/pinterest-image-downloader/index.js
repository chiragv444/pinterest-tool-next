import Layout from '../../../components/Layout';
import ImageDownloaderPage from '../../../components/ImageDownloaderPage';
import { getSupportedLanguages, getLocale, isSupportedRoute } from '../../../lib/i18n';

export default function LocalizedImageDownloader({ locale, nav, lang }) {
  return (
    <Layout lang={lang} nav={nav} currentRoute={`/${lang}/pinterest-image-downloader`} meta={locale.meta}>
      <ImageDownloaderPage
        hero={locale.hero}
        form={locale.form}
        home_content={locale.home_content}
        what_section={locale.what_section}
        why_section={locale.why_section}
        features={locale.features}
        how_section={locale.how_section}
        faq={locale.faq}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  const languages = getSupportedLanguages().filter((lang) => lang !== 'en');
  return {
    paths: languages.map((lang) => ({ params: { lang } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const { lang } = params;

  if (!isSupportedRoute(lang) || lang === 'en') {
    return {
      redirect: {
        destination: '/pinterest-image-downloader',
        permanent: false
      }
    };
  }

  const locale = getLocale(lang, 'img-downloader');
  const videoLocale = getLocale(lang, 'video-downloader');

  if (!locale || typeof locale !== 'object') {
    return {
      notFound: true
    };
  }

  const nav = {
    video: videoLocale?.hero?.title || 'Pinterest Video Downloader',
    image: locale?.hero?.title || 'Pinterest Image Downloader'
  };

  return {
    props: {
      locale,
      nav,
      lang
    }
  };
}
