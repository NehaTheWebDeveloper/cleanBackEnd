const jwt = require("jsonwebtoken");
const config = require("../../../../Database/config");



module.exports=apiAuth = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["authorization"];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is required for authentication",
    });
  }
  
  try {
    const decoded = jwt.verify(token, config.secret_jwt);
    req.user = decoded;
    next(); // Call next() to proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

