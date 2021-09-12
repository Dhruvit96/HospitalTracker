const jwt = require("jsonwebtoken");
const BaseController = require("../controllers/BaseController");
const Forbidden = require("../errors/Forbidden");
const Unauthorized = require("../errors/Unauthorized");
const baseController = new BaseController();

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return baseController.sendErrorResponse(
      req,
      res,
      new Unauthorized("Token not found")
    );
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return baseController.sendErrorResponse(
        req,
        res,
        new Forbidden("Invalide token")
      );
    req.user = user;
    next();
  });
};
