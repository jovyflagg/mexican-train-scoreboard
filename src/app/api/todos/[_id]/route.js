import { connectToDatabase } from "../../../../../utils/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "../../../../../models/user";
import Todo from "../../../../../models/todo";

export async function GET(request) {
  const session = await getServerSession();
  const user_email = session?.user?.email;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) ;
  const limit = parseInt(searchParams.get("limit")) ;
  const skip = (page - 1) * limit;

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: user_email }).select("_id");
    if (!user) {
      return NextResponse.json(
        { message: `User ${user_email} not found` },
        { status: 404 }
      );
    }

    const todos = await Todo.find({ userId: user._id })
      .select("_id title completed")
      .skip(skip)
      .limit(limit);

    const total = await Todo.countDocuments({ userId: user._id });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        message: "Todos fetched successfully",
        todos,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching Todos" },
      { status: 500 }
    );
  }
}
export async function PUT(request, { params }) {
  const session = await getServerSession();
  const user_email = session?.user?.email;

  const { _id } = params; // ✅ no await here
  const data = await request.json(); // ✅ get update data from body
  console.log("_id", _id)
  console.log("data", data)
  try {
    await connectToDatabase();

    const user = await User.findOne({ email: user_email }).select("todos");
    if (!user) {
      return NextResponse.json({ message: `User ${user_email} not found` }, { status: 404 });
    }

    // ✅ perform update
    const updated = await Todo.findByIdAndUpdate(_id, data, { new: true });
    if (!updated) {
      return NextResponse.json({ message: `Todo with id ${_id} not found` }, { status: 404 });
    }

    return NextResponse.json({ message: `Todo updated successfully`, updated }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error updating Todo" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession();
  const user_email = session?.user?.email;

  const { _id } = await params; // don't await this

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: user_email }).select("todos");
    if (!user) {
      return NextResponse.json({ message: `User ${user_email} not found` }, { status: 404 });
    }

    // Delete the Todo
    const deletedTodo = await Todo.findByIdAndDelete(_id);

    // Remove the ID from user's todos array
    user.todos = user.todos.filter(todoId => todoId.toString() !== _id);
    await user.save();

    return NextResponse.json({ message: `Todo deleted successfully`, deletedTodo }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error deleting Todo" }, { status: 500 });
  }
}
