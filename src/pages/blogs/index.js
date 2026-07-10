import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { getAllBlogs } from '../../data/blogs';

const BLOG_PAGE_STORAGE_KEY = 'blog-page-number';

export default function BlogsPage({ blogs }) {
  const router = useRouter();
  const pageSize = 10; // items per page
  const [currentPage, setCurrentPage] = useState(1);
  const hasLoadedSavedPage = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!hasLoadedSavedPage.current) {
        hasLoadedSavedPage.current = true;
        const savedPage = window.localStorage.getItem(BLOG_PAGE_STORAGE_KEY);
        const parsedPage = parseInt(savedPage || '1', 10);

        if (!isNaN(parsedPage) && parsedPage > 0) {
          setCurrentPage(parsedPage);
        }

        return;
      }

      window.localStorage.setItem(BLOG_PAGE_STORAGE_KEY, String(currentPage));
    }
  }, []);

  const sortedBlogs = [...blogs].sort((a, b) => Number(b.blog_id) - Number(a.blog_id));
  const totalPages = Math.max(1, Math.ceil(sortedBlogs.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  useEffect(() => {
    if (typeof window !== 'undefined' && hasLoadedSavedPage.current) {
      window.localStorage.setItem(BLOG_PAGE_STORAGE_KEY, String(currentPage));
    }
  }, [currentPage]);

  function changePage(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    router.replace('/blogs/', undefined, { shallow: true });
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const start = (currentPage - 1) * pageSize;
  const blogsToShow = sortedBlogs.slice(start, start + pageSize);
  const popularPosts = sortedBlogs.slice(0, 4);

  return (
    <Layout currentRoute="/blogs" meta={{ title: 'Pinterest Video Downloader- Download HD Videos', description: 'Easily download Pinterest videos in high quality. Convert videos with our fast, free online Pinterest downloader.'}}>
      <section className="container px-5 py-10">
        <div className="mb-10 text-center">
          {/* <p className="text-sm uppercase tracking-[0.28em] text-[#cb2444]">Latest articles</p> */}
          <h1 className="mt-3 text-3xl font-bold">Our Blogs</h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[#cb2444]">Browse our latest YouTube download guides, tips, and how-to articles. Click any post to read the full blog.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main list */}
          <div className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              {blogsToShow.map((blog) => (
                <article key={blog.slug} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <Link href={`/blog/${blog.slug}/`} className="block">
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      <img
                        src={`/src/assets/${blog.image}.webp`}
                        alt={blog.title}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = '/img/PinVideoDown.webp';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#cb2444]">{blog.date}</p>
                      <h2 className="mb-3 text-xl font-semibold text-slate-900">{blog.title}</h2>
                      <p className="mb-6 text-base leading-7 text-slate-600">{blog.description}</p>
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#cb2444]">
                        Read More
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current" strokeWidth="2">
                          <path d="M5 12h14"></path>
                          <path d="M13 6l6 6-6 6"></path>
                        </svg>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
              <button
                className="rounded-full border px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    className={`rounded-full px-4 py-2 text-sm ${currentPage === page ? 'bg-[#cb2444] text-white' : 'bg-white border'}`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                className="rounded-full border px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="order-first lg:order-last">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold">Popular Posts</h3>
                <ul className="space-y-4">
                  {popularPosts.map((p) => (
                    <li key={p.slug} className="flex items-start gap-3">
                      <img src={`/img/${p.image}.webp`} alt={p.title} className="h-12 w-12 flex-none rounded-lg object-cover" onError={(e)=>{e.currentTarget.src='/img/PinVideoDown.webp'}} />
                      <div>
                        <Link href={`/blog/${p.slug}/`} className="font-semibold text-slate-900">{p.title}</Link>
                        <p className="mt-1 text-xs text-slate-500">{p.date}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const blogs = getAllBlogs();

  return {
    props: {
      blogs
    }
  };
}
