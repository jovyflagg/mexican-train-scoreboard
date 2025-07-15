"use client"
import React, { useContext, useEffect, useState } from 'react'
import { FaChartBar, FaUsers, FaCog } from "react-icons/fa";
import SkeletonDashboard from '../Skeleton/SkeletonDashboard';
import Link from 'next/link';
import { UsersContext } from '../../../../context/UserContext';

const Dashboard = () => {
    const { user } = useContext(UsersContext)
    console.log("Dashboard", user)

    if (!user) return <SkeletonDashboard />;
    return (
        <section className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-20 px-6" id="dashboard">
            <div className="max-w-7xl mx-auto space-y-12">
                <h2 className="text-3xl font-bold text-gray-800">Welcome {user?.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href={'/games'}>
                        <div className="bg-white rounded-xl shadow p-6 space-y-3">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <FaChartBar className="text-2xl" />
                                <h3 className="text-lg font-semibold">Games</h3>
                            </div>
                            <p className="text-sm text-gray-600">Add your games Here</p>
                        </div>
                    </Link>
                    <div className="bg-white rounded-xl shadow p-6 space-y-3">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <FaChartBar className="text-2xl" />
                            <h3 className="text-lg font-semibold">Analytics</h3>
                        </div>
                        <p className="text-sm text-gray-600">Track app performance and user metrics in real-time.</p>
                    </div>
                    <Link href={'/profile'}>
                        <div className="bg-white rounded-xl shadow p-6 space-y-3">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <FaUsers className="text-2xl" />
                                <h3 className="text-lg font-semibold">Profile Management</h3>
                            </div>
                            <p className="text-sm text-gray-600">Manage user roles, permissions, and access controls.</p>
                        </div>
                    </Link>
                    <div className="bg-white rounded-xl shadow p-6 space-y-3">
                        <div className="flex items-center gap-3 text-indigo-600">
                            <FaCog className="text-2xl" />
                            <h3 className="text-lg font-semibold">Settings</h3>
                        </div>
                        <p className="text-sm text-gray-600">Configure application preferences and system options.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Dashboard