import mongoose, { Schema } from "mongoose";

const ImageSchema = new Schema({
  name: { 
    type: String, 
    required: true 
},
  url: { 
    type: String, 
    required: true 
},
  publicId: { 
    type: String, 
    required: true 
}, 
  folderId: { 
    type: Schema.Types.ObjectId, 
    ref: "Folder", 
    required: true 
},
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
  size: { type: Number },
  width: { type: Number },
  height: { type: Number },
  format: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

const Image = mongoose.models.Image || mongoose.model("Image", ImageSchema);

export default Image;