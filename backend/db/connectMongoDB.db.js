import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectMongoDB = async () => {
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
        console.log(`Mongodb connected ... Db Host ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log(`MongoDB connection Error:${error.message}`);
        process.exit(1);
    }
}

export default connectMongoDB;