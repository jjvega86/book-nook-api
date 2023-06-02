const express = require("express");
const cors = require("cors");

const prisma = require("./db/db");
const app = express();

// Define routes and middleware
app.use(cors());

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    include: {
      reviews: true,
      favorites: true,
    },
  });
  return res.send(users);
});

// Close the database connection when the app shuts down
app.on("close", async () => {
  console.log("Prisma disconnected");
  await prisma.$disconnect();
});

// Start the server
const port = 5500;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Gracefully handle closing of server (using CTRL + C plus other quit signals)
process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed!");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server closed!");
    process.exit(0);
  });
});
