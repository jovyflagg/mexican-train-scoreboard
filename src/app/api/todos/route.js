import { connectToDatabase } from "../../../../utils/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import User from "../../../../models/user";
import Todo from "../../../../models/todo";

export async function POST(request) {
  const session = await getServerSession();
  const user_email = session?.user?.email; // Ensure you get the logged-in user's email

  try {
    // Parse the incoming JSON request for todo details
    const data = await request.json();

    await connectToDatabase(); // Connect to the DB

    // Find the user by their email
    const user = await User.findOne({ email: user_email }).select("_id todos");

    // If no user return user name found
    if (!user) {
      return NextResponse.json({ message: `User ${user_email} not found` }, { status: 404 });
    }

    // Create the new todo document
    const newTodo = new Todo({
      ...data,
      userId: user._id
    });

    // Save the new todo document
    const parse = await newTodo.save();

    const todo = {
      _id: parse._id,
      title: parse.title,
      completed: parse.completed
    }
    
    // Push todo._id into user's todos array
    user.todos.push(newTodo._id);

    // Save updated user document
    await user.save();

    // Return a success response
    return NextResponse.json({ message: `Todo created successfully`, todo }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error creating Todo" }, { status: 500 });
  }
}


export async function GET(request) {
  const session = await getServerSession();
  const user_email = session?.user?.email;
  
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 5;
  const limit = parseInt(searchParams.get("limit")) || 1;
  const skip = (page - 1) * limit;
  const search = searchParams.get("search") || "";

  try {
    await connectToDatabase();

    const user = await User.findOne({ email: user_email }).select("_id");
    if (!user) {
      return NextResponse.json(
        { message: `User ${user_email} not found` },
        { status: 404 }
      );
    }

    const query = { userId: user._id };
    if (search.trim()) {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    const todos = await Todo.find(query)
      .select("_id title completed")
      .skip(skip)
      .limit(limit);

    const total = await Todo.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        message: "Todos fetched successfully",
        todos,
        pagination: { page, limit, total, totalPages },
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
