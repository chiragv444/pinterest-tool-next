import blogs from './blogs.json';

export function getAllBlogs() {
  return blogs;
}

export function getAllBlogSlugs() {
  return blogs.map((blog) => blog.slug);
}

export function getBlogBySlug(slug) {
  return blogs.find((blog) => blog.slug === slug) || null;
}

export default blogs;
