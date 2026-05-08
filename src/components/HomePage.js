import { useState } from 'react';
import HeroSection from './HeroSection';

function HtmlBlock({ html }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function HomePage({ hero, form, home_content, what_section, why_section, features, how_section, faq }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const featList = features?.items || [
    features?.feature_1,
    features?.feature_2,
    features?.feature_3,
    features?.feature_4,
    features?.feature_5,
    features?.feature_6
  ].filter(Boolean);

  const defaultIcons = [
    'all-media.svg',
    'free.svg',
    'fast.svg',
    'signup.svg',
    'multi-platform.svg',
    'safe-secure.svg'
  ];

  const defaultAlts = [
    'Pinterest Video Downloader',
    'Free Pinterest Video Downloader',
    'Fast Download Pinterest Videos',
    'NO signup Pinterest Downloader',
    'Download Pinterest Video',
    'Safe Secure Pinterest Downloader'
  ];

  return (
    <>
      <HeroSection hero={hero} form={form} />

      <div className="home_content container px-5 mx-auto py-6">
        <HtmlBlock html={home_content?.text} />
      </div>

      <div className="what_section container px-5 mx-auto py-6">
        <HtmlBlock html={what_section?.text} />
      </div>

      <section id="why-section" className="py-6">
        <div className="container px-5 mx-auto bg-[#fff3f5] py-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-semibold mb-3">{why_section?.title}</h2>
            <p className="text-slate-700">{why_section?.intro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[why_section?.feature_1, why_section?.feature_2, why_section?.feature_3].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#fff3f5] flex items-center justify-center mb-4 mx-auto">
                  <img
                    src={idx === 0 ? '/img/offline.svg' : idx === 1 ? '/img/easy-share.svg' : '/img/badge.svg'}
                    alt={idx === 0 ? 'Offline Pinterest Downloader' : idx === 1 ? 'Pinterest video Downloader' : 'HD Downloader Pinterest video'}
                    className="w-6 h-6"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature?.title}</h3>
                <p className="text-sm text-slate-600">{feature?.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {how_section && (
        <section id="how-section" className="py-12">
          <div className="container mx-auto px-5">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-3">{how_section.title}</h2>
              {how_section.intro && <p className="max-w-3xl mx-auto text-slate-700">{how_section.intro}</p>}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
              {(how_section.steps || []).map((step, idx) => (
                <div key={idx} class="bg-white px-2 flex gap-2">
                  <div class="w-12 h-12 rounded-full bg-[#fff3f5] flex items-center justify-center mb-4 text-primary font-bold text-[#e60023]">
                    {idx + 1}
                  </div>
                  <p class="flex-1 text-sm pt-0">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {features && featList.length > 0 && (
        <section id="features-section" className="py-12">
          <div className="container mx-auto px-5">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-3">{features.title || 'Features'}</h2>
              {features.intro && <p className="text-slate-700">{features.intro}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mx-auto">
              {featList.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-[#fff3f5] shadow-md overflow-hidden">
                  <div className="bg-[#fff3f5] p-4" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                    <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                      <img
                        src={`/img/fetures-img/${defaultIcons[idx % defaultIcons.length]}`}
                        alt={item.alt || defaultAlts[idx % defaultAlts.length]}
                        className="w-12 h-12"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2" style={{ textAlign: 'left !important' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {faq && faq.items && faq.items.length > 0 && (
        <section id="faq-section" className="py-12">
          <div className="container px-5 mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-semibold">{faq.title}</h2>
            </div>

            {faq.items.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border border-[#fff3f5] mb-4">
                  <button
                    type="button"
                    className="w-full bg-[#fff3f5] px-5 py-4 text-left text-[18px] font-semibold"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  >
                    {item.question}
                  </button>
                  <div className={`${isOpen ? 'block' : 'hidden'} px-5 py-4 bg-white text-[#494949]`}>{item.answer}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
