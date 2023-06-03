const express = require("express");
const prisma = require("../db/db");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { user, body } = req;
    const newReview = await prisma.review.create({
      data: {
        userId: user.userId,
        bookId: body.bookId,
        text: body.text,
        rating: body.rating,
      },
    });
    return res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
