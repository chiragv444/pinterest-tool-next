import Layout from '../../components/Layout';

export default function AboutUs() {
  return (
    <Layout currentRoute="/about-us">
      <div className="container px-5 footer-content py-10">
        <h1 className="text-4xl font-semibold text-slate-900">About Us</h1>
        <p className="mt-6 text-slate-700 leading-7">Welcome to Pindown — a simple tool to help you download images and videos for personal use quickly and easily.</p>
        <h2 className="mt-10 text-2xl font-semibold text-slate-900">Our Mission</h2>
        <p className="mt-4 text-slate-700 leading-7">We aim to provide a fast, privacy-friendly experience for users who need a lightweight downloader for personal content. We do not collect or store user content permanently.</p>
        <h2 className="mt-10 text-2xl font-semibold text-slate-900">Contact</h2>
        <p className="mt-4 text-slate-700 leading-7">If you have questions or feedback, please <a href="/contact-us" className="text-red-600 underline">reach out to us</a>.</p>
      </div>
    </Layout>
  );
}
