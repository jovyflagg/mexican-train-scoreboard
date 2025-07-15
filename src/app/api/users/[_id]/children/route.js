import User from "../../../../../models/user";
import Children from "../../../../../models/children";
import { connectToDatabase } from "../../../../../utils/database";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import { getServerSession } from "next-auth";

export async function POST(req, { params }) {
    try {
        const { _id } = params;  

        const formData = await req.formData();
        const image = formData.get("image");
        const name = formData.get("name");
        const birthday = formData.get("birthday");

        // ✅ Connect to the database
        const { bucket } = await connectToDatabase();

        let fileId = null; // ✅ Initialize fileId to null (skip if no image)

        if (image) {
            // ✅ Convert image to buffer
            const buffer = Buffer.from(await image.arrayBuffer());

            const stream = new Readable();
            stream.push(buffer);
            stream.push(null);

            // ✅ Upload image to GridFS
            const uploadStream = bucket.openUploadStream(image.name, {
                contentType: image.type,
            });

            stream.pipe(uploadStream);

            // ✅ Wait for image upload to complete
            fileId = await new Promise((resolve, reject) => {
                uploadStream.on("finish", () => resolve(uploadStream.id));
                uploadStream.on("error", reject);
            });
        }

        // ✅ Link child to the user
        const user = await User.findById({ _id });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ✅ Create the child entry in the database
        const child = await Children.create({
            name,
            birthday,
            profilePictureId: fileId, // ✅ This remains null if no image is uploaded
            custodial: user._id
        });

        user.children.push(child._id);
        await user.save();

        // ✅ Generate profile picture URL if available
        let profilePictureUrl = null;
        if (fileId) {
            const file = await bucket.find({ _id: fileId }).toArray();
            if (file.length > 0) {
                profilePictureUrl = `/api/files/${file[0]._id.toString()}`;  
            }
        }

        // ✅ Return the created child
        return NextResponse.json({
            _id: child._id,
            name: child.name,
            birthday: child.birthday,
            profilePictureUrl,
        });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {
    const session = await getServerSession();
    const user_email = session?.user?.email;

    try {
        const { db, bucket } = await connectToDatabase();  
        const { _id } = params;
        const data = await User.findOne({ email: user_email });

        if (!data) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { name, email, image, children } = data;
        const user = {
            _id,
            name,
            email,
            image,
            children
        };

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
