import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html lang={this.props.__NEXT_DATA__.props?.pageProps?.lang || 'en'}>
        <Head />
        <body>
          <Main />
          <NextScript />
          <Script
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.__fixAlternateLinks = function() {
                  const siteUrl = window.location.origin.replace(/\\/$/, '');
                  const alternateLinks = document.querySelectorAll('link[rel="alternate"][hrefLang]');
                  alternateLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && (href.startsWith('http://localhost') || href.startsWith('http://127.0.0.1'))) {
                      const path = href.replace(/^https?:\\/\\/[^/]+/, '');
                      link.setAttribute('href', siteUrl + path);
                    }
                  });
                };
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', window.__fixAlternateLinks);
                } else {
                  window.__fixAlternateLinks();
                }
              `,
            }}
          />
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
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-FFD45968XK');
              `,
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;