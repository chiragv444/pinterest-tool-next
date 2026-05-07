import Layout from '../../components/Layout';

export default function ContactUs() {
  const meta = {
    title: 'Contact Us - Pinterest Video Downloader',
    description: 'Get in touch with Pinterest Video Downloader. Contact us for questions, feedback, or support regarding our Pinterest download tools.'
  };
  return (
    <Layout currentRoute="/contact-us" meta={meta}>
      <div className="container px-5 footer-content py-10">
        <h1 className="text-4xl font-semibold text-slate-900">Contact Us</h1>
        <p className="mt-6 text-slate-700 leading-7">If you have any questions regarding this privacy statement, please contact us at:</p>
        <ul className="mt-6 list-disc space-y-3 pl-5 text-slate-700">
          <li>
            By visiting this page on our website: <a href="https://pinvideodown.com/contact-us/" target="_blank" rel="noreferrer" className="text-red-600 underline">https://pinvideodown.com/contact-us/</a>
          </li>
        </ul>
      </div>
    </Layout>
  );
}
