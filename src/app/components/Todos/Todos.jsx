"use client";

import { useContext, useState } from "react";
import { TodoContext } from "../../../../context/TodoContext";
import Link from "next/link";

export default function Todo() {
    const {
        todos,
        createTodo,
        updateTodo,
        deleteTodo,
        page,
        totalPages,
        nextPage,
        prevPage,
        search,
        setSearch,
        loading, // <-- Ensure this comes from context
    } = useContext(TodoContext);

    const [input, setInput] = useState({
        title: "",
        completed: false,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editTodo, setEditTodo] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");

    const addTodo = async () => {
        if (!input.title.trim()) return;
        await createTodo({
            title: input.title.trim(),
            completed: input.completed,
            notes: ""
        });
        setInput({ title: "", completed: false });
    };

    const removeTodo = async (_id) => {
        await deleteTodo(_id);
    };

    const openEditModal = (todo) => {
        setEditTodo(todo);
        setEditedTitle(todo.title);
        setIsEditing(true);
    };

    const saveEdit = async () => {
        if (!editedTitle.trim()) return;
        const updatedTitle = editedTitle.trim();
        const _id = editTodo._id;
        await updateTodo(_id, { title: updatedTitle });
        setIsEditing(false);
    };

    const handleUpdate = async (_id, data) => {
        await updateTodo(_id, data);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-blue-100 to-blue-200 p-6 text-black relative">
            <header className="text-3xl font-bold text-center text-gray-800 mb-6">
                📝 Full-Page Todo App
            </header>

            <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)]">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
                    <input
                        type="text"
                        className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="What do you need to do?"
                        value={input.title}
                        onChange={(e) => setInput({ ...input, title: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    />
                    <button
                        onClick={addTodo}
                        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
                    >
                        Add Task
                    </button>
                </div>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search todos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Scrollable Todo List */}

                <ul className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                    {todos.map((todo) => (
                        <li
                            key={todo._id}
                            className={`flex items-center justify-between p-4 rounded-md shadow-sm border ${todo.completed ? "bg-green-100 border-green-300" : "bg-white border-gray-200"
                                }`}
                        >

                            <span
                                className={`flex-1 ${todo.completed ? "line-through text-gray-500" : "text-gray-800"
                                    }`}
                            >
                                <Link
                                    href={`tododetails/${todo._id}`}>
                                    {todo.title}
                                </Link>
                            </span>

                            {/* Toggle button */}
                            <button
                                onClick={() => handleUpdate(todo._id, { completed: !todo.completed })}
                                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${todo.completed ? "bg-green-500" : "bg-gray-300"
                                    }`}
                            >
                                <div
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${todo.completed ? "translate-x-6" : ""
                                        }`}
                                />
                            </button>

                            <div className="flex items-center gap-2 ml-4">
                                <button
                                    onClick={() => openEditModal(todo)}
                                    className="text-blue-500 hover:text-blue-700 font-semibold"
                                >
                                    ✎
                                </button>
                                <button
                                    onClick={() => removeTodo(todo._id)}
                                    className="text-red-500 hover:text-red-700 font-semibold"
                                >
                                    ✕
                                </button>
                            </div>
                        </li>
                    ))}

                </ul>




            </div>

            {/* Pagination Controls */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50">
                <div className="flex justify-center gap-4 p-4">
                    <button
                        onClick={prevPage}
                        disabled={page === 1}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="self-center text-gray-700">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={nextPage}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0  bg-gray-600/50  z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEdit}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
