const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db/db");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    include: {
      reviews: true,
      favorites: true,
    },
  });
  return res.send(users);
});

router.post("/register", async (req, res) => {
  try {
    console.log(req);
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET);

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
});

module.exports = router;
