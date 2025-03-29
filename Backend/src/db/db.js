import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`MongoDB connection successfully host:${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB connection failed");
        process.exit(1)      
    }
}

export default connectDB