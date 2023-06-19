const express = require("express");
const cors = require("cors");

const auth = require("./routes/auth");
const reviews = require("./routes/reviews");
const favorites = require("./routes/favorites");
const books = require("./routes/books");

const prisma = require("./db/db");
const app = express();

// Define routes and middleware
// TODO: Add logging middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/reviews", reviews);
app.use("/api/favorites", favorites);
app.use("/api/books", books);

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
