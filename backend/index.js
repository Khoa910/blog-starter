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

app.listen(3000, () => {
    connectDB(); // Connect to MongoDB before starting the server
    console.log('Server is running on port 3000');
    setInterval(async () => {
      try {
        console.log("🔄 Đang crawl lại...");
        await runCrawler();
      } catch (err) {
        console.error("Crawler error:", err.message);
      }
    }, 12 * 60 * 60 * 1000); // 12h = 43200000 ms
});
