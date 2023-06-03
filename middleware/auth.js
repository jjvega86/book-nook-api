const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authenticateToken;
