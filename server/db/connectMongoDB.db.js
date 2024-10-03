import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_URL}/Twitter-db`)
        console.log(`Mongodb connected ... Db Host ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log(`MongoDB connection Error:${error.message}`);
        process.exit(1);
    }
}

export default connectMongoDB;