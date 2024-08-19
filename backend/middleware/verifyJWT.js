import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJWT =async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // console.log(token);
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorised" });
    }

    const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodeToken);
    
    const user = await User.findById(decodeToken?.id).select(
      "-password "
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid access token" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in verifyjwt middleware :", error.message);
    return res.status(500).json({ error: "Internal sever error" });
  }
};

export default verifyJWT;
