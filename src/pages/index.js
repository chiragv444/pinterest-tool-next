import Layout from '../components/Layout';
import HomePage from '../components/HomePage';
import { getLocale } from '../lib/i18n';

export default function Home({ locale, nav }) {
  return (
    <Layout lang="en" nav={nav} currentRoute="/" meta={locale.meta}>
      <HomePage
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

export async function getStaticProps() {
  const lang = 'en';
  const locale = getLocale(lang, 'video-downloader');
  const imageLocale = getLocale(lang, 'img-downloader');

  if (!locale || typeof locale !== 'object') {
    return { notFound: true };
  }

  const nav = {
    video: locale.hero?.title || 'Pinterest Video Downloader',
    image: imageLocale?.hero?.title || 'Pinterest Image Downloader'
  };

  return {
    props: {
      locale,
      nav
    }
  };
}
