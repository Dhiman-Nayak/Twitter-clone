import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.db.js";
const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({extended:true,limit:"16Kb"}));
app.use(express.static("public"));
app.use(cookieParser())
app.use("/api/auth",authRoutes);
const PORT = process.env.PORT || 3000;



app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
    connectMongoDB();
})
