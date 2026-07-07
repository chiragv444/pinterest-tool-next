import Link from 'next/link';
import Layout from '../../components/Layout';
import { getAllBlogSlugs, getBlogBySlug } from '../../data/blogs';

export default function BlogDetailPage({ blog }) {
  if (!blog) {
    return (
      <Layout currentRoute="/blogs" meta={{ title: 'Blog not found - PinVideoDown', description: 'Blog not found', keywords: 'blog, not found' }}>
        <section className="container px-5 py-20 text-center">
          <h1 className="text-3xl font-bold">Blog not found</h1>
          <p className="mt-4 text-slate-600">The blog you are looking for does not exist or has been moved.</p>
          <p className="mt-6">
            <Link href="/blogs/" className="rounded-full bg-[#cb2444] px-6 py-3 text-white shadow hover:bg-[#a81b35]">
              Back to blogs
            </Link>
          </p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout
      currentRoute={`/blogs/${blog.slug}`}
      meta={{
        title: `${blog.title} - PinVideoDown`,
        description: blog.description,
        // keywords: 'blog, youtube downloader, mp3, mp4, yt1s, offline'
      }}
    >
      <section className="container px-5 py-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#cb2444]">Blog post</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight">{blog.title}</h1>
            <p className="mt-3 text-slate-600">{blog.date}</p>
          </div>
          <Link href="/blogs/" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-50">
            ← Back to blogs
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={`/img/${blog.image}.webp`}
            alt={blog.title}
            className="h-80 w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = '/img/PinVideoDown.webp';
            }}
          />
          <div className="p-8 prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = getAllBlogSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    return { notFound: true };
  }

  return {
    props: {
      blog
    }
  };
}
