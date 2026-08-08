import { useState } from 'react';
import HeroSection from './HeroSection';

function HtmlBlock({ html }) {
  if (!html) return null;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function ImageDownloaderPage({ hero, form, home_content, what_section, why_section, how_section, features, faq }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const featList = features?.items || [
    features?.feature_1,
    features?.feature_2,
    features?.feature_3,
    features?.feature_4,
    features?.feature_5,
    features?.feature_6
  ].filter(Boolean);

  const defaultIcons = features?.defaultIcons || [
    'free.svg',
    'multi-platform.svg',
    'all-media.svg',
    'signup.svg',
    'animated.svg',
    'one-click.svg'
  ];

  const defaultAlts = features?.defaultAlts || [
    'Free Pinterest Image Downloader',
    'Download Pinterest Image',
    'Pinterest Image Downloader',
    'NO signup Pinterest Image Downloader',
    'Download Pinterest Images',
    'One Click Download Pinterest Image'
  ];

  return (
    <>
      <HeroSection hero={hero} form={form} />

      <div className="home_content container mx-auto py-4 px-5">
        <HtmlBlock html={home_content?.text} />
      </div>

      <div className="what_section container px-5 mx-auto py-4">
        <HtmlBlock html={what_section?.text} />
      </div>

      <section id="why-section" className="py-4">
        <div className="container px-5 mx-auto bg-[#fff3f5] py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-3 text-center">{why_section?.title}</h2>
            <p>{why_section?.intro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#fff3f5] flex items-center justify-center mb-4 mx-auto">
                <img src="/img/fast.svg" alt="Fast Download Pinterest Images" className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">{why_section?.feature_1?.title}</h3>
              <p className="text-sm">{why_section?.feature_1?.text}</p>
            </div>

            <div className="bg-white p-6 rounded shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#fff3f5] flex items-center justify-center mb-4 mx-auto">
                <img src="/img/badge.svg" alt="HD Downloader Pinterest Image" className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">{why_section?.feature_2?.title}</h3>
              <p className="text-sm">{why_section?.feature_2?.text}</p>
            </div>

            <div className="bg-white p-6 rounded shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#fff3f5] flex items-center justify-center mb-4 mx-auto">
                <img src="/img/secure.svg" alt="Secure Pinterest Downloader" className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-medium mb-2">{why_section?.feature_3?.title}</h3>
              <p className="text-sm">{why_section?.feature_3?.text}</p>
            </div>
          </div>
        </div>
      </section>

      {how_section && (
        <section id="how-section" className="py-4">
          <div className="container px-5 mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-3">{how_section.title}</h2>
              {/* {how_section.intro && (
                <p className="max-w-3xl mx-auto">{how_section.intro}</p>
              )} */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {(how_section.steps || []).map((step, idx) => (
                <div key={idx} className="bg-white px-2 flex gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#fff3f5] flex items-center justify-center mb-4 text-primary font-bold text-[#e60023]">
                    {idx + 1}
                  </div>
                  <p className="flex-1 text-sm pt-0">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {features && featList.length > 0 && (
        <section id="features-section" className="py-4 bg-white">
          <div className="container px-5 mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold mb-3">{features.title || 'Features'}</h2>
              {features.intro && <p>{features.intro}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mx-auto">
              {featList.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-[#fff3f5] shadow-md">
                  <div className="mb-4 p-4 bg-[#fff3f5] rounded-lg" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
                    <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                      <img
                        src={`/img/fetures-img/${defaultIcons[idx % defaultIcons.length]}`}
                        alt={item.alt || defaultAlts[idx % defaultAlts.length]}
                        className="w-12 h-12"
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2" style={{ textAlign: 'center' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm text-justify">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {faq && Array.isArray(faq.items) && faq.items.length > 0 && (
        <section id="faq-section" className="py-4">
          <div className="container px-5 mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-semibold">{faq.title || 'Frequently Asked Questions (FAQs)'}</h2>
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
