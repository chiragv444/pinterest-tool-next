import Layout from '../../components/Layout';
import ImageDownloaderPage from '../../components/ImageDownloaderPage';
import { getLocale } from '../../lib/i18n';

export default function PinterestImageDownloader({ locale, nav }) {
  return (
    <Layout lang="en" nav={nav} currentRoute="/pinterest-image-downloader">
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

export async function getStaticProps() {
  const lang = 'en';
  const locale = getLocale(lang, 'img-downloader');
  const videoLocale = getLocale(lang, 'video-downloader');

  if (!locale || typeof locale !== 'object') {
    return { notFound: true };
  }

  const nav = {
    video: videoLocale?.hero?.title || 'Pinterest Video Downloader',
    image: locale?.hero?.title || 'Pinterest Image Downloader'
  };

  return {
    props: {
      locale,
      nav
    }
  };
}
