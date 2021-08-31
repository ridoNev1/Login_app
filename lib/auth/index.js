const jwt = require("jsonwebtoken");
import cookie from "cookie";

const auth = {
  authenticate: (req) => {
    const token = cookie.parse(req?.headers?.cookie || "").token ?? null;
    if (!token) {
      throw new Error("Token undetected. Please insert token!");
    } else {
      return;
    }
  },
  authorize: (req) => {
    const jwtKey = process.env.JWT_KEY;
    const token = cookie.parse(req?.headers?.cookie || "").token ?? null;
    jwt.verify(token, jwtKey, (err) => {
      if (err && err.name === "TokenExpiredError") {
        throw new Error("Token Expired! Please log in again");
      } else if (err && err.name === "JsonWebTokenError") {
        throw new Error("Authorization Failed!");
      } else {
        return;
      }
    });
  },
};

module.exports = auth;
