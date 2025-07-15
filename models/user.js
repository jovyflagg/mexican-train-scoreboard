import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    name: {
      type: String,
      required: [false, "Name is required"],
    },
    imageId: { type: Schema.Types.ObjectId, ref: "uploads.files" }, // Profile picture
    
    password: {
      type: String,
    }
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
