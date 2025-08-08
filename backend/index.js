import express from 'express';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import commentRoute from './routes/comment.route.js';
import connectDB from './lib/connectDB.js'; // Assuming you have a db.js file for MongoDB connection

const app = express();

// app.get("/test", (req, res) => {
//   res.status(200).send('it works');
// });

app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/comments", commentRoute);

app.listen(3000, () => {
    connectDB(); // Connect to MongoDB before starting the server
  console.log('Server is running on port 3000');
});