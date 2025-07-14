import mongoose, { Schema } from "mongoose";

const FolderSchema = new Schema({
  name: { 
    type: String, 
    required: true 
},
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
  images: [
    { 
        type: Schema.Types.ObjectId, 
        ref: "Image" 
    }
],
  createdAt: { 
    type: Date, 
    default: Date.now 
},
});

const Folder = mongoose.models.Folder || mongoose.model("Folder", FolderSchema);

export default Folder;