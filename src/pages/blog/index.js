import Link from "next/link";
import Layout from "../../components/Layout";
import { getAllBlogs } from "../../data/blogs";
import Image from "next/image";

export default function BlogsPage({ blogs }) {
  const blogsToShow = [...blogs].sort(
    (a, b) => Number(b.blog_id) - Number(a.blog_id),
  );

  return (
    <Layout
      currentRoute="/blogs"
      meta={{
        title: "Pinterest Video Downloader- Download HD Videos",
        description:
          "Easily download Pinterest videos in high quality. Convert videos with our fast, free online Pinterest downloader.",
      }}
    >
      <section className="py-10 blog">
        <div className="mb-10 text-center border border-red-600 p-10 bg-[#cb2444] text-white">
          {/* <p className="text-sm uppercase tracking-[0.28em] text-[#cb2444]">Latest articles</p> */}
          <h1 className="mt-3 text-3xl font-bold" id="blog-title">
            Our Blogs
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base">
            Fast Pinterest downloader for videos, Idea Pins, and GIFs in HD
            quality.
          </p>
        </div>

        <div className="container px-5 xl:px-0">
          {/* Main list */}
          <div className=" w-full flex flex-wrap gap-[3%]">
            {blogsToShow.map((blog) => (
              <article
                key={blog.slug}
                className="overflow-hidden rounded-xl w-full sm:w-[48.5%] lg:w-[31.33%] border border-slate-200 bg-white shadow-sm hover:shadow-md mb-8"
              >
                <Link href={`/blog/${blog.slug}/`} className="block group">
                  <div className="relative overflow-hidden bg-slate-100 group-hover:scale-105 transition-transform duration-700">
                    <Image
                      src={`/src/assets/${blog.image}.png`}
                      alt={blog.title}
                      width={460}
                      height={208}
                      className="h-auto w-[1280px] object-cover"
                      onError={(event) => {
                        event.currentTarget.src = "/img/PinVideoDown.webp";
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <p>{blog.blog_id}</p>
                    <h2 className="mb-3 text-xl font-semibold text-slate-900">
                      {blog.title}
                    </h2>
                    <p className="mb-6 text-base leading-7 text-slate-600">
                      {blog.description}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#cb2444]">
                        Read More
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-4 w-4 stroke-current"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M13 6l6 6-6 6"></path>
                        </svg>
                      </span>
                      <span className="inline-flex text-sm font-semibold text-[#cb2444]">
                        {blog.date}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          {/* <aside className="order-first lg:order-last">
            <div className="sticky top-8 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="mb-4 text-lg font-bold">Popular Posts</span>
                <ul className="space-y-4">
                  {popularPosts.map((p) => (
                    <li key={p.slug} className="flex items-start gap-3">
                      <div>
                        <Link
                          href={`/blog/${p.slug}/`}
                          className="font-semibold text-slate-900"
                        >
                          {p.title}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">{p.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside> */}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const blogs = getAllBlogs();

  return {
    props: {
      blogs,
    },
  };
}
