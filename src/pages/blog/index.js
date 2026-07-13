import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { getAllBlogs } from "../../data/blogs";
import { getBlogImageSrc } from "../../lib/blogImages";
import Image from "next/image";

const BLOGS_PER_PAGE = 9;

export default function BlogsPage({ blogs }) {
  const sortedBlogs = [...blogs].sort(
    (a, b) => Number(b.blog_id) - Number(a.blog_id),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedBlogs.length / BLOGS_PER_PAGE),
  );

  const [mounted, setMounted] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // Load saved page only once
  useEffect(() => {
    const saved = Number(localStorage.getItem("blogsCurrentPage"));

    if (saved >= 1 && saved <= totalPages) {
      setCurrentPage(saved);
    }

    setMounted(true);
  }, [totalPages]);

  // Save page whenever it changes (after mounted)
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem("blogsCurrentPage", currentPage);
  }, [currentPage, mounted]);

  // Don't render until localStorage has been read
  if (!mounted) return null;

  const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
  const blogsToShow = sortedBlogs.slice(
    startIndex,
    startIndex + BLOGS_PER_PAGE,
  );

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Layout
      currentRoute="/blogs"
      meta={{
        title: "Download Videos, Idea Pins, and GIFs from Pinterest",
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
                key={`${blog.slug}-${blog.blog_id}`}
                className="overflow-hidden rounded-xl w-full sm:w-[48.5%] lg:w-[31.33%] border border-slate-200 bg-white shadow-sm hover:shadow-md mb-8"
              >
                <Link href={`/blog/${blog.slug}/`} className="block group">
                  <div className="relative overflow-hidden bg-slate-100 group-hover:scale-105 transition-transform duration-700">
                    <Image
                      src={getBlogImageSrc(blog)}
                      // alt={blog.title}
                      alt={"Pinterest video downloader"}
                      width={460}
                      height={208}
                      className="h-auto w-[1280px] object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="mb-3 text-xl font-semibold text-slate-900">
                      {blog.title}
                    </h2>
                    <p className="mb-6 text-base leading-7 text-slate-600">
                      {blog.description}
                    </p>
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
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                currentPage === 1
                  ? "cursor-not-allowed border-slate-200 text-slate-400"
                  : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Previous
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  currentPage === page
                    ? "bg-[#cb2444] text-white"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                currentPage === totalPages
                  ? "cursor-not-allowed border-slate-200 text-slate-400"
                  : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Next
            </button>
          </div>
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

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import Layout from "../../components/Layout";
// import { getAllBlogs } from "../../data/blogs";
// import { getBlogImageSrc } from "../../lib/blogImages";
// import Image from "next/image";

// const BLOGS_PER_PAGE = 9;

// export default function BlogsPage({ blogs }) {
//   const sortedBlogs = [...blogs].sort(
//     (a, b) => Number(b.blog_id) - Number(a.blog_id),
//   );

//   const totalPages = Math.max(
//     1,
//     Math.ceil(sortedBlogs.length / BLOGS_PER_PAGE),
//   );

//   const [mounted, setMounted] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);

//   // Load saved page only once
//   useEffect(() => {
//     const saved = Number(localStorage.getItem("blogsCurrentPage"));

//     if (saved >= 1 && saved <= totalPages) {
//       setCurrentPage(saved);
//     }

//     setMounted(true);
//   }, [totalPages]);

//   // Save page whenever it changes (after mounted)
//   useEffect(() => {
//     if (!mounted) return;

//     localStorage.setItem("blogsCurrentPage", currentPage);
//   }, [currentPage, mounted]);

//   // Don't render until localStorage has been read
//   if (!mounted) return null;

//   const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
//   const blogsToShow = sortedBlogs.slice(
//     startIndex,
//     startIndex + BLOGS_PER_PAGE,
//   );

//   const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <Layout
//       currentRoute="/blogs"
//       meta={{
//         title: "Pinterest Video Downloader- Download HD Videos",
//         description:
//           "Easily download Pinterest videos in high quality. Convert videos with our fast, free online Pinterest downloader.",
//       }}
//     >
//       <section className="py-10 blog">
//         <div className="mb-10 text-center border border-red-600 p-10 bg-[#cb2444] text-white">
//           <h1 className="mt-3 text-3xl font-bold" id="blog-title">
//             Our Blogs
//           </h1>

//           <p className="mx-auto mt-3 max-w-2xl text-base">
//             Fast Pinterest downloader for videos, Idea Pins, and GIFs in HD
//             quality.
//           </p>
//         </div>

//         <div className="container px-5 xl:px-0">
//           <div className="w-full flex flex-wrap gap-[3%]">
//             {blogsToShow.map((blog) => (
//               <article
//                 key={`${blog.slug}-${blog.blog_id}`}
//                 className="overflow-hidden rounded-xl w-full sm:w-[48.5%] lg:w-[31.33%] border border-slate-200 bg-white shadow-sm hover:shadow-md mb-8"
//               >
//                 <Link href={`/blog/${blog.slug}/`} className="block group">
//                   <div className="relative overflow-hidden bg-slate-100 group-hover:scale-105 transition-transform duration-700">
//                     <Image
//                       src={getBlogImageSrc(blog)}
//                       alt="Pinterest video downloader"
//                       width={460}
//                       height={208}
//                       className="h-auto w-[1280px] object-cover"
//                     />
//                   </div>

//                   <div className="p-5">
//                     <p>{blog.blog_id}</p>

//                     <h2 className="mb-3 text-xl font-semibold text-slate-900">
//                       {blog.title}
//                     </h2>

//                     <p className="mb-6 text-base leading-7 text-slate-600">
//                       {blog.description}
//                     </p>

//                     <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#cb2444]">
//                       Read More
//                       <svg
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         className="h-4 w-4 stroke-current"
//                         strokeWidth="2"
//                       >
//                         <path d="M5 12h14"></path>
//                         <path d="M13 6l6 6-6 6"></path>
//                       </svg>
//                     </span>
//                   </div>
//                 </Link>
//               </article>
//             ))}
//           </div>

//           <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//               disabled={currentPage === 1}
//               className={`rounded-full border px-4 py-2 text-sm font-semibold ${
//                 currentPage === 1
//                   ? "cursor-not-allowed border-slate-200 text-slate-400"
//                   : "border-slate-300 text-slate-700 hover:bg-slate-100"
//               }`}
//             >
//               Previous
//             </button>

//             {pageNumbers.map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`rounded-full px-4 py-2 text-sm font-semibold ${
//                   currentPage === page
//                     ? "bg-[#cb2444] text-white"
//                     : "border border-slate-300 text-slate-700 hover:bg-slate-100"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}

//             <button
//               onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//               disabled={currentPage === totalPages}
//               className={`rounded-full border px-4 py-2 text-sm font-semibold ${
//                 currentPage === totalPages
//                   ? "cursor-not-allowed border-slate-200 text-slate-400"
//                   : "border-slate-300 text-slate-700 hover:bg-slate-100"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// }

// export async function getStaticProps() {
//   return {
//     props: {
//       blogs: getAllBlogs(),
//     },
//   };
// }
