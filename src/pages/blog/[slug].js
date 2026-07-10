import Link from "next/link";
import Layout from "../../components/Layout";
import { getAllBlogSlugs, getBlogBySlug, getAllBlogs } from "../../data/blogs";
import { getBlogImageSrc } from "../../lib/blogImages";
import Image from "next/image";

export default function BlogDetailPage({ blog, previousBlog, nextBlog }) {
  if (!blog) {
    return (
      <Layout
        currentRoute="/blog"
        meta={{
          title: "Blog not found - PinVideoDown",
          description: "Blog not found",
          keywords: "blog, not found",
        }}
      >
        <section className="container px-5 py-20 text-center">
          <h1 className="text-3xl font-bold">Blog not found</h1>
          <p className="mt-4 text-slate-600">
            The blog you are looking for does not exist or has been moved.
          </p>
          <p className="mt-6">
            <Link
              href="/blog/"
              className="rounded-full bg-[#cb2444] px-6 py-3 text-white shadow hover:bg-[#a81b35]"
            >
              Back to blogs
            </Link>
          </p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout
      currentRoute={`/blog/${blog.slug}`}
      meta={{
        title: `${blog.title} - PinVideoDown`,
        description: blog.description,
        // keywords: 'blog, youtube downloader, mp3, mp4, yt1s, offline'
      }}
    >
      <section className="container blog px-5 py-10">
        {/* <div className="mb-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="relative h-[320px] sm:h-[420px] lg:h-[520px]">
            <Image
              src={`/src/assets/${blog.image}.png`}
              alt={blog.title}
              fill
              className="object-cover"
              onError={(event) => {
                event.currentTarget.src = "/img/PinVideoDown.webp";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <p className="text-sm text-white/80">
                <Link href="/" className="underline-offset-4 hover:underline">
                  Home
                </Link>{' '}
                / {blog.title}
              </p>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                {blog.title}
              </h1>
              <p className="mt-3 text-sm text-white/80">{blog.date}</p>
            </div>
          </div>
        </div> */}

        <div className="mb-6 mt-2 text-[16px] font-bold bg-gray-50 rounded p-3">
          {/* breadcrumb here */}
          🏠︎{" "}
          <Link href="/" className="hover:text-red-600">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/blog/" className="hover:text-red-600">
            Blog
          </Link>{" "}
          /{" "}
          <Link href={`/blog/${blog?.slug}/`} className="hover:text-red-600">
            {blog?.title}
          </Link>
        </div>

        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#cb2444]">
              Blog post
            </p>
            {/* <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight">{blog.title}</h1> */}
            <p className="mt-3 text-slate-600">{blog.date}</p>
          </div>
          <Link
            href="/blog/"
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-50"
          >
            ← Back to blogs
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <Image
            src={getBlogImageSrc(blog)}
            // alt={blog.title}
            alt="Pinterest video downloader"
            width={1280}
            height={720}
            className="w-full max-w-[1280px] object-contain rounded mb-6"
          />
          <div className="p-8 prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>

        {/* <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {previousBlog ? (
            <Link
              href={`/blog/${previousBlog.slug}/`}
              className="inline-flex items-center justify-start rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              ← Previous Post
            </Link>
          ) : (
            <span className="text-sm text-slate-400">← Previous Post</span>
          )}

          {nextBlog ? (
            <Link
              href={`/blog/${nextBlog.slug}/`}
              className="inline-flex items-center justify-end rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Next Post →
            </Link>
          ) : (
            <span className="text-sm text-slate-400">Next Post →</span>
          )}
        </div> */}
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = getAllBlogSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const blogs = getAllBlogs();
  const sortedBlogs = [...blogs].sort(
    (a, b) => Number(b.blog_id) - Number(a.blog_id),
  );
  const blog = getBlogBySlug(params.slug);

  if (!blog) {
    return { notFound: true };
  }

  const currentIndex = sortedBlogs.findIndex((item) => item.slug === blog.slug);
  const previousBlog = currentIndex > 0 ? sortedBlogs[currentIndex - 1] : null;
  const nextBlog = currentIndex >= 0 && currentIndex < sortedBlogs.length - 1 ? sortedBlogs[currentIndex + 1] : null;

  return {
    props: {
      blog,
      previousBlog,
      nextBlog,
    },
  };
}
