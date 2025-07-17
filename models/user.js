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
    },
    imageId: {
      type: Schema.Types.ObjectId,
      ref: "uploads.files", // GridFS
    },
    password: {
      type: String,
      required: [true, "Password is required"], // Assuming credential-based login
    },
    todos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Todo",
      },
    ],
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
