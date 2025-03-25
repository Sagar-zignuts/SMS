const jwt = require("jsonwebtoken");
const redisClient = require("../config/RedisConfig");

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({success : false , message : "Token is not availabel"})
    }

    try {
        const decoder = jwt.verify(token , "sfnNOIEFIUASWIONIOCOIS8CbcnkjsgaNKSbc")
        req.user = decoder
        next()
    } catch (error) {
        return res
      .status(403)
      .json({ success: false, message: "Invalid token", error });
    }
}

const restrictedTo = (...roles)=>{
    return (req,res,next)=>{
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({success : false , message : "Access denied"})
        }
        next()
    }
}

module.exports = {authMiddleware , restrictedTo}