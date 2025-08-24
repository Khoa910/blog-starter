import axios from "axios";
import mongoose from "mongoose";
import connectDB from "../lib/connectDB.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import * as cheerio from "cheerio"; // npm i cheerio

// Hàm tạo slug từ title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export const runCrawler = async () => {
  try {
    await connectDB();

    let user = await User.findOne({ email: "crawler@viblo.vn" });
    if (!user) {
      user = await User.create({
        clerkUserId: "crawler_001",
        username: "viblo_crawler",
        email: "crawler@viblo.vn",
        img: "https://www.gravatar.com/avatar?d=identicon",
      });
    }

    // 👉 Gọi API Viblo (JSON format)
    const url = "https://api.viblo.asia/posts/newest?page=1&per_page=1";
    const { data } = await axios.get(url);

    // Viblo API trả về { data: [ {id, title, body, ...} ] }
    const firstPost = data.data[0];

    const title = firstPost.title || "";
    const link = "https://viblo.asia/p/" + firstPost.slug;
    //const content = firstPost.meta_description || firstPost.body ||"";
    const img = firstPost.cover_image || "";
    const slug = slugify(title);
    // Crawl trang HTML thật để lấy nội dung <div class="md-content">
    const { data: html } = await axios.get(link);
    const $ = cheerio.load(html);

    const content = $(".md-contents").html() || ""; // lấy HTML bên trong md-content

    // const htmlRes = await axios.get(link);
    // const $ = cheerio.load(htmlRes.data);
    // const content = $(".markdown-body").html() || "";

    const post = {
      user: user._id,
      title,
      slug,
      desc: `Xem chi tiết tại: ${link}`,
      img,
      category: "general",
      content,
    };

    // ✅ In ra console khi gọi /crawl
    console.log("Lấy được 1 post:", post);

    // Nếu muốn lưu DB thì dùng Post.updateOne
    await Post.updateOne(
      { slug: post.slug },
      { $setOnInsert: post },
      { upsert: true }
    );
    console.log("Đã insert/skip:", post.title);

    mongoose.connection.close();
    console.log("Done crawling.");
  } catch (err) {
    console.error("Crawler error:", err.message);
  }
};

// import axios from "axios";
// import * as cheerio from "cheerio";
// import mongoose from "mongoose";
// import connectDB from "../lib/connectDB.js";
// import Post from "../models/post.model.js";
// import User from "../models/user.model.js";

// function slugify(text) {
//   return text
//     .toString()
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/[^\w\-]+/g, "")
//     .replace(/\-\-+/g, "-")
//     .replace(/^-+/, "")
//     .replace(/-+$/, "");
// }

// export const runCrawler = async () => {
//   try {
//     await connectDB();

//     let user = await User.findOne({ email: "crawler@viblo.vn" });
//     if (!user) {
//       user = await User.create({
//         clerkUserId: "crawler_001",
//         username: "viblo_crawler",
//         email: "crawler@viblo.vn",
//         img: "https://www.gravatar.com/avatar?d=identicon",
//       });
//       console.log("Created crawler user:", user.username);
//     }

//     // B1: Gọi đến trang Viblo newest
//     const url = "https://viblo.asia/newest";
//     // const { data } = await axios.get(url);
//     const { data } = await axios.get("https://viblo.asia/p/dinh-co-chuc-nang-trong-agile-cosmic-1j4lQejMJwl", {
//         headers: {
//             "User-Agent": "Mozilla/5.0",
//         },
//     });
//     const $ = cheerio.load(data);

//     // B2: Lấy link bài viết đầu tiên
//     const firstPost = $(".post-feed__item").first();
//     const title = firstPost.find(".post-feed__title a").text().trim();
//     const link =
//       "https://viblo.asia" +
//       firstPost.find(".post-feed__title a").attr("href");
//     const desc = firstPost.find(".post-feed__excerpt").text().trim();
//     const img = firstPost.find("img").attr("src") || "";
//     const slug = slugify(title);

//     // B3: Vào link chi tiết bài viết
//     const { data: detailHtml } = await axios.get(link);
//     const $$ = cheerio.load(detailHtml);

//     // Viblo content chính thường nằm trong class ".markdown-body"
//     const content = $$(".markdown-body").text().trim();

//     // B4: Tạo post object
//     const post = {
//       user: user._id,
//       title,
//       slug,
//       desc,
//       img,
//       category: "general",
//       content,
//     };

//     console.log("Lấy được chi tiết post:", post);

//     // B5: Lưu vào DB
//     await Post.updateOne(
//       { slug: post.slug },
//       { $setOnInsert: post },
//       { upsert: true }
//     );
//     console.log("Inserted/Skipped:", post.title);

//     mongoose.connection.close();
//     console.log("Done crawling.");
//   } catch (err) {
//     console.error("Crawler error:", err.message);
//   }
// };