import express from 'express';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';
import likeRouter from './routes/like.route.js';
import webhookRouter from './routes/webhook.route.js';
import connectDB from './lib/connectDB.js'; // Assuming you have a db.js file for MongoDB connection
import { clerkMiddleware } from "@clerk/express";
import cors from 'cors';
import { runCrawler } from "./crawler/crawler.js";

const app = express();
app.use(cors(process.env.CLIENT_URL));
app.use(clerkMiddleware()); // Middleware to handle Clerk authentication
app.use("/webhooks", webhookRouter);
app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.get("/auth-state", (req, res) => {
    const authState = req.auth();
    res.json(authState);
});

app.get("/protect", (req, res) => {
    const {userId} = req.auth();
    if(!userId){
      return res.status(401).json("not authenticated");
    }
    res.status(200).json("content")
});

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/likes", likeRouter);

app.use((error, req, res, next) => {
  res.status(error.status || 500);

  res.json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

// app.get("/crawl", async (req, res) => {
//   try {
//     await runCrawler(); // chạy crawler
//     res.send("Crawler finished!");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Crawler error!");
//   }
// });

app.get("/crawl", async (req, res) => {
  try {
    const posts = await runCrawler(); // chạy crawler
    console.log(posts); // in ra terminal localhost

    res.json(posts); // trả về JSON cho client cũng được
  } catch (err) {
    console.error("Crawler error:", err.message);
    res.status(500).send("Crawler error!");
  }
});

app.listen(3000, () => {
    connectDB(); // Connect to MongoDB before starting the server
  console.log('Server is running on port 3000');
});



// Export crawler modules để có thể sử dụng từ bên ngoài
// export { crawlVibloPosts, runCrawler } from './crawler/index.js';
// export * from './crawler/crawler-config.js';