import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String 
    },
    
    // image: { 
    //     type: String 
    // },
    // provider: { 
    //     type: String, 
    //     default: "credentials" 
    // },
}, {
    timestamps: true
});

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error as Error);
//   }
// });

// UserSchema.methods.comparePassword = async function (candidatePassword: string) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

const User = models.User || model('User', UserSchema);

export default User;