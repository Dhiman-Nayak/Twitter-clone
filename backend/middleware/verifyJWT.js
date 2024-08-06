import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

const verifyJWT=async(req,res,next)=>{
    try {
        const token = req.cookies?.jwt || req.header("Authorization")?.replace("Bearer","")
        if(!token){
            throw new ApiError(400,"Unauthorised request")
        }
    
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)    
    
        const user =await User.findById(decodeToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(400,"Invalid Access token")
        }
        req.user=user;
        next()
    } catch (error) {
        return res.status(401).json("You are not logged in")
    }

}

export default verifyJWT;