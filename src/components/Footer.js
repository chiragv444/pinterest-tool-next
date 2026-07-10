import Link from 'next/link';

export default function Footer({lang = 'en'}) {
  return (
    <footer className="container px-5 py-3 md:py-10 border-t">
      <div className="border-bottom">
        <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-6">
          <div className="flex items-center gap-4 group">
            <Link href={lang === 'en' ? '/' : `/${lang}/`} className="text-xl font-bold flex items-center gap-2">
              <img src="/img/PinVideoDown.webp" alt="PinVideoDown Logo" className="h-[18px] w-[144px]" />
            </Link>
          </div>

          <ul className="flex flex-wrap gap-4 md:gap-6 font-bold text-sm md:text-base items-center justify-center">
            <li className="hover:text-[#cb2444] whitespace-nowrap">
              <Link href="/blog/" className="text-decoration-none" itemProp="name">
                Blog
              </Link>
            </li>
            <li className="hover:text-[#cb2444] whitespace-nowrap">
              <Link href="/privacy-policy/" className="text-decoration-none" itemProp="name">
                Privacy Policy
              </Link>
            </li>
            <li className="hover:text-[#cb2444] whitespace-nowrap">
              <Link href="/contact-us/" className="text-decoration-none" itemProp="name">
                Contact Us
              </Link>
            </li>
            <li className="hover:text-[#cb2444] whitespace-nowrap">
              <Link href="/terms-of-service/" className="text-decoration-none" itemProp="name">
                Terms of services
              </Link>
            </li>
            <li className="hover:text-[#cb2444] whitespace-nowrap">
              <Link href="/about-us/" className="text-decoration-none" itemProp="name">
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
