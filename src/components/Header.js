import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header({ lang = 'en', nav = { video: 'Pinterest Video Downloader', image: 'Pinterest Image Downloader' }, currentRoute = '/' }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const route = currentRoute || router.asPath || '/';
  const normalizedRoute = route === '/' ? '/' : '/' + route.replace(/^\/+|\/+$/g, '');
  const routeWithoutLocale = normalizedRoute.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
  const isRoot = normalizedRoute === '/';
  const isLangOnly = /^\/[a-z]{2}$/.test(normalizedRoute);
  const isFooterPage = ['/privacy-policy', '/contact-us', '/terms-of-service', '/about-us'].includes(routeWithoutLocale);
  const isBlogRoute = routeWithoutLocale === '/blog' || routeWithoutLocale.startsWith('/blog/');
  const routePath = isRoot || isLangOnly || isFooterPage || isBlogRoute ? '' : routeWithoutLocale;

  const makeHref = (langCode) => {
    const prefix = langCode === 'en' ? '' : '/' + langCode;
    const tail = (routePath || '').replace(/^\/+|\/+$/g, '');
    let href = tail ? `${prefix}/${tail}` : prefix || '/';
    href = href.replace(/\/\/{2,}/g, '/');
    if (href !== '/' && !href.endsWith('/')) href += '/';
    return href === '//' ? '/' : href;
  };

  return (
    <header className="bg-white z-50">
      <style>{`
        @media (min-width: 768px) {
          #pinvideodown-menu { display: flex !important; }
          #pinvideodown-mobile-menu { display: none !important; }
        }
      `}</style>

      <div className="container flex items-center justify-between py-3 px-5">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <img src="/img/PinVideoDown.webp" alt="PinVideoDown" className="h-[18px] w-[144px]" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div id="pinvideodown-menu" className="hidden md:flex md:flex-nowrap items-center gap-8 justify-center flex-1">
            <Link href={lang === 'en' ? '/' : `/${lang}/`} className="font-bold hover:text-[#cb2444] whitespace-nowrap">
              {nav.video}
            </Link>
            <Link href={lang === 'en' ? '/pinterest-image-downloader/' : `/${lang}/pinterest-image-downloader/`} className="font-bold hover:text-[#cb2444] whitespace-nowrap">
              {nav.image}
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div id="lang-dropdown" className="relative">
              <button
                type="button"
                id="lang-dropdown-trigger"
                aria-haspopup="true"
                aria-expanded={langDropdownOpen}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setLangDropdownOpen(!langDropdownOpen);
                }}
                className="flex items-center gap-2 bg-white drop-shadow-[0_0_24px_rgba(0,0,0,0.1)] px-3 md:px-5 py-3 rounded-full cursor-pointer hover:bg-gray-50"
              >
                <img src="/img/translation.svg" alt="lang" className="w-5 h-5" />
                <svg className="w-5 h-5 text-[#cb2444]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1l-4.25 4.656a.75.75 0 01-1.12 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {langDropdownOpen && (
              <div
                id="lang-dropdown-menu"
                className="absolute z-10 right-0 top-[36px] mt-2 bg-white border border-gray-200 shadow-md rounded-md p-2 w-[168px]"
              >
                <ul className="list-none">
                  <li>
                    <Link href={makeHref('en')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      English
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('id')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Bahasa Indonesia
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('vi')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Tiếng Việt
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('ms')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Bahasa Malaysia
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('es')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Español
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('fr')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Français
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('de')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      German
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('hu')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Hungary
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('it')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Italian
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('pl')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Polish
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('pt')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Português
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('ro')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Romanian
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('th')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Thai
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('tr')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Turkish
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('ru')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      Русский
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('hi')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      हिंदी
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('zh')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      中文(简体)
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('ja')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      日本語
                    </Link>
                  </li>
                  <li>
                    <Link href={makeHref('ar')} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lang-item" onClick={() => setLangDropdownOpen(false)}>
                      عربي
                    </Link>
                  </li>
                </ul>
              </div>
              )}
            </div>

            <button
              id="navbar-burger"
              type="button"
              className="md:hidden flex items-center"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div id="pinvideodown-mobile-menu" className={`${mobileOpen ? 'block absolute w-full' : 'hidden'} md:hidden bg-white border-t border-gray-200`}>
        <div className="container py-4 px-5">
          <Link href={lang === 'en' ? '/' : `/${lang}/`} className="block py-2 font-bold">
            {nav.video}
          </Link>
          <Link href={lang === 'en' ? '/pinterest-image-downloader/' : `/${lang}/pinterest-image-downloader/`} className="block py-2 font-bold">
            {nav.image}
          </Link>
        </div>
      </div>
    </header>
  );
}
