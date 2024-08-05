import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB..db.js";
const app=express();

app.use("/api/auth",authRoutes);

const PORT = process.env.PORT || 8000;



app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
    connectMongoDB();
})
