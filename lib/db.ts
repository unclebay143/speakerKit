import mongoose from "mongoose";
import User from "@/models/User";
import Folder from "@/models/Folders";
import Image from "@/models/Images"; 


const connectViaMongoose = async () => {
  

    if (mongoose.connection.readyState === 1) {
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI!)
}

export default connectViaMongoose;