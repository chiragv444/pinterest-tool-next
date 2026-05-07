import Layout from '../../components/Layout';

export default function PrivacyPolicy() {
  const meta = {
    title: 'Privacy Policy - Pinterest Video Downloader',
    description: 'Read our Privacy Policy to understand how Pinterest Video Downloader collects, uses, and protects your personal information.'
  };
  return (
    <Layout currentRoute="/privacy-policy" meta={meta}>
      <div className="container px-5 footer-content py-10">
        <h1 className="text-4xl font-semibold text-slate-900">Privacy Policy</h1>
        <p className="mt-6 text-slate-700 leading-7">This Privacy Policy describes our policies and procedures on the collection, use and disclosure of your information when you use the Service and tells you about your privacy rights and how the law protects you.</p>
        <p className="mt-4 text-slate-700 leading-7">By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy.</p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">Interpretation and Definitions</h2>
        <h3 className="mt-6 text-xl font-semibold text-slate-900">Interpretation</h3>
        <p className="mt-3 text-slate-700 leading-7">The words whose initial letters are capitalized have meanings defined under the following conditions. These definitions apply whether they appear in singular or plural.</p>

        <h3 className="mt-8 text-xl font-semibold text-slate-900">Definitions</h3>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-700">
          <li><strong>Account</strong> means a unique account created for you to access our Service.</li>
          <li><strong>Company</strong> refers to pinvideodown.</li>
          <li><strong>Cookies</strong> are small files placed on your device by a website.</li>
          <li><strong>Personal Data</strong> means information that can identify you.</li>
          <li><strong>Service</strong> refers to the Website.</li>
          <li><strong>You</strong> means the individual using the Service.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">Collecting and Using Your Personal Data</h2>
        <h3 className="mt-6 text-xl font-semibold text-slate-900">Types of Data Collected</h3>
        <h4 className="mt-4 text-lg font-semibold text-slate-900">Personal Data</h4>
        <p className="mt-3 text-slate-700 leading-7">While using our Service, we may ask you to provide certain personally identifiable information that can be used to contact or identify you.</p>
        <h4 className="mt-6 text-lg font-semibold text-slate-900">Usage Data</h4>
        <p className="mt-3 text-slate-700 leading-7">Usage Data is collected automatically when using the Service and may include information such as your device IP address, browser type, pages visited, and time spent on the site.</p>

        <h3 className="mt-10 text-xl font-semibold text-slate-900">Tracking Technologies and Cookies</h3>
        <p className="mt-4 text-slate-700 leading-7">We use Cookies and similar tracking technologies to track activity on our Service and store certain information. Tracking technologies may include beacons, tags, and scripts.</p>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-700">
          <li><strong>Cookies</strong>: small files placed on your device.</li>
          <li><strong>Web Beacons</strong>: small electronic files used to collect site statistics.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">Use of Your Personal Data</h2>
        <p className="mt-4 text-slate-700 leading-7">We may use your personal data to provide and maintain the Service, manage your requests, and improve the Service experience.</p>

        <h2 className="mt-10 text-2xl font-semibold text-slate-900">Contact Us</h2>
        <p className="mt-4 text-slate-700 leading-7">If you have any questions regarding this privacy statement, please contact us by visiting this page on our website:</p>
        <p className="mt-3 text-red-600 underline"><a href="https://pinvideodown.com/contact-us/" target="_blank" rel="noreferrer">https://pinvideodown.com/contact-us/</a></p>
      </div>
    </Layout>
  );
}
