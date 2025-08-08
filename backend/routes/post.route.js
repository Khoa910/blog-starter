import express from 'express';

const router = express.Router();

router.get("/anothertest", (req, res) => {
  res.status(200).send('User route works'); // Example route for user-related operations
});

export default router;