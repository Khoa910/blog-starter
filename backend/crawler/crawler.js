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

    let user = await User.findOne({ email: "khoa9102003@gmail.com" });
    if (!user) {
      // user = await User.create({
      //   clerkUserId: "user_31ajz2E8zcOiKjX45wLLdYkFZU7",
      //   username: "admin123",
      //   email: "khoa9102003@gmail.com",
      //   img: "https://images.clerk.dev/oauth_google/img_31ajzCBNSKaBtIx26XdHU3IhdeL",
      // });
      console.log("User not found, please create user first");
    }

    const url = "https://api.viblo.asia/posts/newest?page=1&per_page=10";
    const { data } = await axios.get(url);

    const posts = data.data.slice(0, 20);
    console.log(`API trả về ${posts.length} bài`);

    for (const p of posts) {
      const title = p.title || "";
      const link = "https://viblo.asia/p/" + p.slug;
      const img = p.cover_image || "";
      const slug = slugify(title);

      // Crawl HTML to take content detail
      const { data: html } = await axios.get(link);
      const $ = cheerio.load(html);
      const content = $(".md-contents").html() || "";

      const categories = [
        "general",
        "web-design",
        "development",
        "databases",
        "search-engines",
        "marketing",
      ];

      function getRandomCategory() {
        return categories[Math.floor(Math.random() * categories.length)];
      }

      const post = {
        user: user._id,
        title,
        slug,
        desc: `Xem chi tiết tại: ${link}`,
        img,
        category: getRandomCategory(),
        content,
      };

      // Insert into DB, skip if slug already exists
      await Post.updateOne(
        { slug: post.slug },
        { $setOnInsert: post },
        { upsert: true }
      );

      console.log("Đã insert:", post.title);
    }
    console.log("Done crawling.");
  } catch (err) {
    console.error("Crawler error:", err.message);
  }
};