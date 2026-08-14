import blogImage01 from '../assets/1st-blog-webp.webp';
import blogImage02 from '../assets/2nd-blog-webp.webp';
import blogImage03 from '../assets/3rd-blog-webp.webp';
import blogImage04 from '../assets/4th-blog-webp.webp';
import blogImage05 from '../assets/5th-blog-webp.webp';
import blogImage06 from '../assets/6th-blog-webp.webp';
import blogImage07 from '../assets/7th-blog-webp.webp';
import blogImage08 from '../assets/8th-blog-webp.webp';
import blogImage09 from '../assets/9th-blog-webp.webp';
import blogImage10 from '../assets/10th-blog-webp.webp';
import blogImage11 from '../assets/11th-blog-webp.webp';
import blogImage12 from '../assets/12th-blog-webp.webp';
import blogImage13 from '../assets/13th-blog-webp.webp';
import blogImage14 from '../assets/14th-blog-webp.webp';
import blogImage15 from '../assets/15th-blog-webp.webp';
import blogImage16 from '../assets/16th-blog-webp.webp';
import blogImage17 from '../assets/17th-blog-webp.webp';
import blogImage18 from '../assets/18th-blog-webp.webp';
import blogImage19 from '../assets/19th-blog-webp.webp';
import blogImage20 from '../assets/20th-blog-webp.webp';
import blogImage21 from '../assets/21th-blog-webp.webp';
import blogImage22 from '../assets/22th-blog-webp.webp';
import blogImage23 from '../assets/23th-blog-webp.webp';
// import blogImage24 from '../assets/24th-blog-webp.webp';
// import blogImage25 from '../assets/25th-blog-webp.webp';
// import blogImage26 from '../assets/26th-blog-webp.webp';
// import blogImage27 from '../assets/27th-blog-webp.webp';
// import blogImage28 from '../assets/28th-blog-webp.webp';
// import blogImage29 from '../assets/29th-blog-webp.webp';
// import blogImage30 from '../assets/30th-blog-webp.webp';
// import blogImage31 from '../assets/31st-blog-webp.webp';
// import blogImage32 from '../assets/32th-blog-webp.webp';
// import blogImage33 from '../assets/33th-blog-webp.webp';
// import blogImage34 from '../assets/34th-blog-webp.webp';
// import blogImage35 from '../assets/35th-blog-webp.webp';
// import blogImage36 from '../assets/36th-blog-webp.webp';

const blogImageMap = {
  '01': blogImage01,
  '02': blogImage02,
  '03': blogImage03,
  '04': blogImage04,
  '05': blogImage05,
  '06': blogImage06,
  '07': blogImage07,
  '08': blogImage08,
  '09': blogImage09,
  '10': blogImage10,
  '11': blogImage11,
  '12': blogImage12,
  '13': blogImage13,
  '14': blogImage14,
  '15': blogImage15,
  '16': blogImage16,
  '17': blogImage17,
  '18': blogImage18,
  '19': blogImage19,
  '20': blogImage20,
  '21': blogImage21,
  '22': blogImage22,
  '23': blogImage23,
  // '24': blogImage24,
  // '25': blogImage25,
  // '26': blogImage26,
  // '27': blogImage27,
  // '28': blogImage28,
  // '29': blogImage29,
  // '30': blogImage30,
  // '31': blogImage31,
  // '32': blogImage32,
  // '33': blogImage33,
  // '34': blogImage34,
  // '35': blogImage35,
  // '36': blogImage36,
};

export function getBlogImageSrc(blog) {
  if (!blog?.image) {
    return blogImage01;
  }

  return blogImageMap[blog.image] || blogImage01;
}
