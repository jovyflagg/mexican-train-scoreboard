import User from "../../../../models/user";
import { connectToDatabase } from "../../../../utils/database";
import { NextResponse } from "next/server";

// betterpassword
export async function POST(request) {
    try {
        await connectToDatabase();
        const { _id } = await request.json();

        const user = await User.findOne({ _id }).select("name");
       
        return NextResponse.json({ user });
    } catch (error) {

        return NextResponse.json({ error });
    }

}