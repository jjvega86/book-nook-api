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
      include: {
        user: true,
      },
    });

    const averageRating = await prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        bookId,
      },
    });

    const formattedAverageRating =
      averageRating._avg.rating !== null ? averageRating._avg.rating : null;

    const favoritedUser = await prisma.favorite.findFirst({
      where: {
        userId: user.userId,
      },
    });

    const customResponse = {
      reviews: bookReviews,
      averageRating: formattedAverageRating
        ? Number(formattedAverageRating.toFixed(2))
        : null,
      favorited: favoritedUser ? true : false,
    };

    console.log(customResponse);
    return res.json(customResponse);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

module.exports = router;
