import User from "../../../../models/user";
import { connectToDatabase } from "../../../../utils/database";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();
        console.log("name", name)
        console.log("email", email)
        console.log("password", password)
        const hashedPassword = await bcrypt.hash(password, 10);
        await connectToDatabase();
        await User.create({ name, email, password: hashedPassword, imageId: null })
        console.log(User)
        return NextResponse.json({ message: "User Registered" }, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "An Error Occured", error }, { status: 500 })

    }

}