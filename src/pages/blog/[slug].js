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
        title: `${blog.title}`,
        description: blog.description,
        // keywords: 'blog, youtube downloader, mp3, mp4, yt1s, offline'
      }}
    >
      <section className="container blog px-5 pb-10" id="blog-detail">
        <div className="mb-8 mt-2 text-[16px] font-bold bg-[#fff3f5] rounded p-3">
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
          {/* <Link href={`/blog/${blog?.slug}/`} className="hover:text-red-600"> */}
          {blog?.title}
          {/* </Link> */}
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <Image
            src={getBlogImageSrc(blog)}
            alt={blog.imagealt}
            // alt="Pinterest video downloader"
            width={1280}
            height={720}
            className="w-full max-w-[1280px] object-contain rounded mb-6"
          />
          <div className="p-8 prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>
      </section>
      <div className="max-w-[700px] mb-8 mx-auto border border-[#dfdfdf] bg-[#f5f5f577] rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-3 inline-block">
          Need to download Pinterest videos & Images?
        </h3>
        <p className="text-[15px] leading-6 !mb-6">
          Download Pinterest videos and images instantly with the Pinterest
          Downloader. No installation required.
        </p>
        <a
          className="inline-flex items-center justify-center rounded-lg bg-[#cb2444] text-white text-[15px] font-semibold h-12 px-8 shadow-[0_4px_10px_rgba(255,0,0,0.22)] hover:bg-[#df2849] hover:shadow-none transition-all"
          href="/"
        >
          Go to Downloader →
        </a>
      </div>
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
  const nextBlog =
    currentIndex >= 0 && currentIndex < sortedBlogs.length - 1
      ? sortedBlogs[currentIndex + 1]
      : null;

  return {
    props: {
      blog,
      previousBlog,
      nextBlog,
    },
  };
}
