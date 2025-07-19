"use client";

import React, { useContext, useEffect, useState } from "react";
import { TodoContext } from "../../../../context/TodoContext";
import Link from "next/link";

const TodoDetails = ({ _id }) => {
    const { loading, getTodoDetails, updateTodo } = useContext(TodoContext);
    const [todo, setTodo] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        title: "",
        notes: "",
        completed: false,
    });

    useEffect(() => {
        const fetchDetails = async () => {
            const data = await getTodoDetails(_id);
            setTodo(data);

            setForm({
                _id: data._id || "",
                title: data.title || "",
                notes: data.notes || "",
                completed: data.completed || false,
            });
        };
        fetchDetails();
    }, [_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleToggleCompleted = () => {
        setForm((prev) => ({
            ...prev,
            completed: !prev.completed,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const updated = await updateTodo(_id, form);
        setTodo(updated);
        setEditMode(false);
    };

    if (loading || !todo) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl bg-gradient-to-b from-blue-100 to-blue-200">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-blue-200 p-6 text-black">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <header className="text-3xl font-bold text-gray-800">📋 Todo Details</header>
                </div>

                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-1">Title</label>
                        {editMode ? (
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <div className="text-lg text-gray-800 bg-gray-100 p-3 rounded-md border border-gray-200">
                                {todo?.title}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-1">Notes</label>
                        {editMode ? (
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                rows={4}
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : (
                            <textarea
                                name="notes"
                                value={form.notes}
                                disabled
                                rows={4}
                                className="w-full p-3 border rounded-md bg-gray-100 border-gray-200"
                            />
                        )}
                    </div>
                    

                    {/* Completed */}
                    <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-1">Completed</label>

                        {editMode ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleToggleCompleted}
                                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${form.completed ? "bg-green-500" : "bg-gray-300"}`}
                                >
                                    <div
                                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${form.completed ? "translate-x-6" : ""}`}
                                    />
                                </button>
                                <span className="text-gray-800">Mark as completed</span>
                            </div>
                        ) : (
                            <div
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${todo?.completed
                                    ? "bg-green-100 text-green-700 border border-green-300"
                                    : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                    }`}
                            >
                                {todo?.completed ? "Yes" : "No"}
                            </div>
                        )}

                        <br />
                        <br />
                        <div className="flex gap-3">
                            <Link
                                href="/todos"
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition text-sm"
                            >
                                ← Back
                            </Link>
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm w-20 text-center"
                            >
                                {editMode ? "Cancel" : "Edit"}
                            </button>
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="text-sm text-gray-500 space-y-1">
                        <p>Created: {new Date(todo?.createdAt).toLocaleString()}</p>
                        <p>Last Updated: {new Date(todo?.updatedAt).toLocaleString()}</p>
                    </div>

                    {/* Save Button */}
                    {editMode && (
                        <div className="pt-4">
                            <button
                                onClick={handleSave}
                                className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodoDetails;
