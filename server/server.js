import express from "express";
import path from "path"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
const app=express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials:true
}));

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRECT,
})
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

import connectMongoDB from "./db/connectMongoDB.db.js";

const __dirname= path.resolve()
app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({extended:true,limit:"16Kb"}));
app.use(express.static("public"));
app.use(cookieParser())
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV==="production") {
    app.use(express.static(path.join(__dirname,"/client/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","dist","index.html"))
    })
}

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
    connectMongoDB();
})
