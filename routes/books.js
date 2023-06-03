const express = require("express");
const prisma = require("../db/db");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

router.get("/:bookId", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const { bookId } = req.params;
    const bookReviews = await prisma.review.findMany({
      where: {
        bookId,
      },
    });

    const averageRating = await prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    });

    const favoritedUser = await prisma.favorite.findFirst({
      where: {
        userId: user.userId,
      },
    });

    const customResponse = {
      reviews: bookReviews,
      averageRating: Number(averageRating._avg.rating.toFixed(2)),
      favorited: favoritedUser ? true : false,
    };

    return res.json(customResponse);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

module.exports = router;
