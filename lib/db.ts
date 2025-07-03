import mongoose from "mongoose";


const connectViaMongoose = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI!)
}

export default connectViaMongoose;