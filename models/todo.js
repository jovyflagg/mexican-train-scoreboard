import { Schema, model, models } from 'mongoose';

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    notes: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 🧠 Index for better query performance by user/completion status
TodoSchema.index({ userId: 1, completed: 1 });

const Todo = models.Todo || model("Todo", TodoSchema);
export default Todo;
