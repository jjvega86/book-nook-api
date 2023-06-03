const express = require("express");
const prisma = require("../db/db");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { user } = req;
    const userFavorites = await prisma.favorite.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        user: true,
      },
    });
    return res.json(userFavorites);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { user, body } = req;
    const newFavorite = await prisma.favorite.create({
      data: {
        bookId: body.bookId,
        title: body.title,
        thumbnail_url: body.thumbnail_url,
        userId: user.userId,
      },
    });

    return res.status(201).json(newFavorite);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

module.exports = router;
