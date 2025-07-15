import User from "../../../../../models/user";
import { connectToDatabase } from "../../../../../utils/database";
import { NextResponse } from "next/server";

// GET handler for fetching a user by ID
export async function GET(request, { params }) {
  const { _id } = params; 



  try {
    // Connect to the database
    await connectToDatabase()

    // Find the user by _id and select only the email field
    const recipient = await User.findOne({ _id }).select("email");

    if (!recipient) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return the recipient's email
    return NextResponse.json({ recipient });
  } catch (error) {
   
    return NextResponse.json({ message: "Error fetching user" }, { status: 500 });
  }
}
