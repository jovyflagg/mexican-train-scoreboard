"use client"
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UsersContext } from "../../../../context/UserContext";

const LoginForm = () => {
    const router = useRouter();
    const { user } = useContext(UsersContext)

    const [login, setLogin] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLogin((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const GoogleLogin = () => {
        signIn("google", { callbackUrl: "/dashboard" });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = login;
        try {
            const response = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (response.error) {
                setError(response.error);
                return;
            }

            router.replace("/dashboard");
        } catch (error) {
            console.error(error);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
                    Login to Your Games Account
                </h2>
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={login.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        />

                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={login.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                        />

                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <button
                        className="w-full flex items-center justify-center border border-gray-300 bg-white py-2 px-4 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={GoogleLogin}
                    >
                        <svg
                            className="h-5 w-5 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                        >
                            <path
                                fill="#EA4335"
                                d="M24 9.5c3.4 0 6.4 1.2 8.7 3.4l6.5-6.5C34.7 2.2 29.7 0 24 0 14.7 0 7 5.9 3.6 14.3l7.7 6c2.1-5.7 7.6-10 13.7-10z"
                            />
                            <path
                                fill="#34A853"
                                d="M46.4 24.3c0-1.5-.2-3-.5-4.3H24v8.1h12.8c-1.1 3.7-3.7 6.8-7.4 8.8l6 7.2c7.1-6.5 11-16 11-26.1z"
                            />
                            <path
                                fill="#4A90E2"
                                d="M10.4 25.6C9.4 22.8 8.7 20 8.7 17c0-3 1-5.8 2.7-8l-7.8-6C1.3 7.8 0 12.7 0 17c0 4.7 1.2 9.1 3.4 13l7.7-6.4z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M24 48c6.3 0 12-2 16.6-5.5l-6-7.2c-2.6 1.8-5.9 2.9-9.6 2.9-6 0-11.2-3.9-13-9.3l-7.7 6c3.2 8.2 10.6 13.1 19.7 13.1z"
                            />
                        </svg>
                        Sign in with Google
                    </button>
                    <p className="mt-4 text-sm text-gray-600">
                        Need to register for an account?{" "}
                        <Link href="/createaccount" className="text-indigo-600 hover:underline">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
