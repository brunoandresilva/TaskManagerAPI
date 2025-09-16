const jwt = require("jsonwebtoken");
const config = require("../config");

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token em falta" });

  jwt.verify(token, config.jwt.secret, (err, payload) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = payload;
    next();
  });
}
module.exports = { authMiddleware };
