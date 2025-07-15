"use client";
import React, { useContext, useState } from "react";
import Image from "next/image";
import { UsersContext } from "../../../../context/UserContext";
import SkeletonProfile from "../Skeleton/SkeletonProfile";

const Profile = () => {
  const { user, updateImage, setUser } = useContext(UsersContext);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newName, setNewName] = useState({ name: user?.name || "" });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  if (!user) return <SkeletonProfile />;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Revoke previous preview to prevent memory leaks
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setNewName((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    await updateImage(user._id, { image: selectedFile });

    setIsUploading(false);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleSave = async () => {
    setIsUploading(true);

    await updateImage(user._id, { ...newName });
    setUser((prev) => ({ ...prev, ...newName }));

    setIsUploading(false);
    setIsEditModalOpen(false);
  };

  return (
    <section
      id="profile"
      className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-20 px-6"
    >
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3">
        {/* Left: Profile Image + Name */}
        <div className="bg-indigo-700 text-white p-8 flex flex-col items-center justify-center gap-4 md:col-span-1">
          <div className="relative w-32 h-32">
            <Image
              src={
                previewUrl
                  ? previewUrl
                  : user?.imagefileUrl || "/profile-placeholder.jpg"
              }
              alt="Profile Picture"
              fill
              className="rounded-full object-cover border-4 border-white"
            />
          </div>

          <label className="mt-2 text-sm text-indigo-100">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="cursor-pointer underline">Choose New Image</span>
          </label>

          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="mt-2 bg-white text-indigo-700 px-4 py-1 rounded hover:bg-indigo-100 font-semibold text-sm transition disabled:opacity-50"
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-indigo-700"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l5-5-5-5v4a12 12 0 00-12 12h4z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Image"
              )}
            </button>
          )}
        </div>

        {/* Right: Details */}
        <div className="p-8 md:col-span-2 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Profile Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 text-sm mb-1">
                Full Name
              </label>
              <p className="text-gray-900">{user?.name}</p>
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>

            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Full Name</label>
              <input
                type="text"
                name="name"
                value={newName.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />

              <label className="block text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Profile;
