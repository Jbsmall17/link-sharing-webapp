require("dotenv").config()
const jwt = require("jsonwebtoken")

async function authorizationFunc(req, res, next) {
      const secret = process.env.JWT_SECRET;
      const bearerToken = req.headers.authorization;
      try {
        if (!bearerToken) {
          return res.status(401).json({
            message: "Unauthorized: No token provided",
          });
        }
        
        const token = bearerToken.split(" ")[1];  
        const { email, id } = jwt.verify(token, secret);
        req.userId = id;
        req.userEmail = email;
        next();
      } catch (error) {
        if (error.name === "JsonWebTokenError") {
          return res.status(401).json({
            message: "Unauthorized: Invalid token",
          });
        }
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({
            message: "Unauthorized: Token has expired",
          });
        }
  
        console.log(error.message);
        return res.status(500).json({
          message: "Unauthorized: server error",
        });
      }
    };


module.exports = {authorizationFunc}