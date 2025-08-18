import express from 'express';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';
import webhookRouter from './routes/webhook.route.js';
import connectDB from './lib/connectDB.js'; // Assuming you have a db.js file for MongoDB connection
import { clerkMiddleware } from "@clerk/express";
import cors from 'cors';

const app = express();
// app.use(cors(process.env.CLIENT_URL));
// app.use(clerkMiddleware()); // Middleware to handle Clerk authentication
// app.use("/webhooks", webhookRouter);
// app.use(express.json());

// CORS
app.use(cors({ origin: process.env.CLIENT_URL }));

// Clerk middleware cho authentication
app.use(clerkMiddleware());

// Chỉ bỏ qua express.json cho route webhook Clerk
app.use((req, res, next) => {
  if (req.originalUrl === "/webhooks/clerk") {
    next(); // giữ raw body cho webhook
  } else {
    express.json()(req, res, next);
  }
});

app.use("/webhooks", webhookRouter);

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
});