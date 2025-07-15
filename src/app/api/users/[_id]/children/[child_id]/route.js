import User from "../../../../../../models/user";
import Children from "../../../../../../models/children";
import { connectToDatabase } from "../../../../../../utils/database";  // Import the connectToDatabase function
import { NextResponse } from "next/server";
import { Readable } from "stream";

export async function POST(request, { params }) {
    try {
        await connectToDatabase();  // Use connectToDatabase to establish the connection
        const { email } = await request.json()
        const { _id, child_id } = params; // User Parent ID and Child from the request parameters

        // Find the user (parent)
        const user = await User.findById(_id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }


        // Find the child by ID
        const child = await Children.findById(child_id);
        if (!child) {
            return NextResponse.json({ error: "Child not found" }, { status: 404 });
        }


        // Find the parent by email
        const parent = await User.findOne({ email });
        if (!parent) {
            return NextResponse.json({ error: "Parent not found" }, { status: 404 });
        }



        // Add parent ID to child's parents array
        if (!child.parents.includes(parent._id)) {
            child.parents.push(parent._id);
        }


        // Add child ID to parent's children array
        if (!parent.children.includes(child._id)) {
            parent.children.push(child._id);
        }


        // **Save changes**
        await child.save();
        await parent.save();

        return NextResponse.json({ message: "Parent added successfully", status: 201 });

    } catch (error) {
        console.error(error.message)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request, { params }) {

    try {
        await connectToDatabase();  // Use connectToDatabase to establish the connection

        const { _id } = params; // Use params directly to extract _id
        const user = await User.findOne({ _id });
        const children = user.children;

        return NextResponse.json({ message: "All Children", children, status: 200 });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const { _id, child_id } = params; // No need to await params

    try {
        await connectToDatabase(); // Ensure DB connection
        const user = await User.findOne({ _id });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find the child by id
        const child = await Children.findById(child_id);

        if (!child) {
            return NextResponse.json({ error: "Child not found" }, { status: 404 });
        }

        // Check if the user is the custodial parent
        if (user._id.toString() === child.custodial.toString()) {
            // Delete the child from the database
            await Children.deleteOne({ _id: child_id });

            // ✅ Remove child_id from user.children array properly

            user.children = user.children.filter(child => child._id.toString() !== child_id.toString());


            // ✅ Save the updated user document
            await user.save();

            return NextResponse.json({
                message: `Child with id ${child_id} deleted by custodial ${user._id}`,
                status: 200
            });
        } else {
            return NextResponse.json({
                message: `User cannot delete this child`,
                status: 403 // 403 (Forbidden) is the correct status code
            });
        }

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}



export async function PUT(req, { params }) {
    try {
        const { _id, child_id } = params; // ✅ Extract child ID

        const formData = await req.formData();
        const name = formData.get("name");
        const birthday = formData.get("birthday");
        const image = formData.get("image"); // Optional

        // ✅ Connect to the database
        const { bucket } = await connectToDatabase();

        // ✅ Find the user in the database
        const user = await User.findById(_id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        // ✅ Find the child in the database
        const child = await Children.findById(child_id);
        if (!child) {
            return NextResponse.json({ error: "Child not found" }, { status: 404 });
        }

        // ✅ Update name and birthday if provided
        if (name) child.name = name;
        if (birthday) child.birthday = birthday;

        let profilePictureUrl = null;

        // ✅ Handle Image Update (if provided)
        if (image) {
            // ✅ Delete previous image from GridFS (if exists)
            if (child.profilePictureId) {
                await bucket.delete(child.profilePictureId).catch((err) => {
                    console.error("Failed to delete old image:", err);
                });
            }

            // ✅ Convert image to buffer
            const buffer = Buffer.from(await image.arrayBuffer());

            const stream = new Readable();
            stream.push(buffer);
            stream.push(null);

            // ✅ Upload new image to GridFS
            const uploadStream = bucket.openUploadStream(image.name, {
                contentType: image.type,
            });

            stream.pipe(uploadStream);

            // ✅ Wait for new image upload to complete
            const newFileId = await new Promise((resolve, reject) => {
                uploadStream.on("finish", () => resolve(uploadStream.id));
                uploadStream.on("error", reject);
            });

            // ✅ Update child's profile picture ID
            child.profilePictureId = newFileId;
            profilePictureUrl = `/api/files/${newFileId.toString()}`;
        }

        // ✅ Save updated child details
        await child.save();

        return NextResponse.json({
            message: "Child updated successfully",
            child: {
                _id: child._id,
                name: child.name,
                birthday: child.birthday,
                profilePictureUrl,
            },
        });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

