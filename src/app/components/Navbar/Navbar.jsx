'use client'

import { useContext, useState } from "react";
import Link from "next/link";
import { UsersContext } from "../../../../context/UserContext";

const Navbar = () => {
  const { user, signOutUser } = useContext(UsersContext); // 👈 make sure this matches context
  const [menuOpen, setMenuOpen] = useState(false);


  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const logout = async () => {
    closeMenu();
    await signOutUser(); // 👈 this must exist from context
  };

  return (
    <header className="bg-indigo-700 text-white shadow relative z-50">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={'/'}>
        <div className="text-xl font-bold">
          YourBrand
          </div>
        </Link>
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          {user ? (
            <>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><button onClick={logout}>Sign out</button></li>
            </>
          ) : (
            <>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/createaccount">Create Account</Link></li>
            </>
          )}
        </ul>
        
        <button onClick={toggleMenu} className="md:hidden p-2 rounded hover:bg-indigo-800 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
           {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-indigo-800 z-40 transform transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 space-y-6 text-sm font-medium">
          <button onClick={closeMenu} className="absolute top-4 right-4 text-white focus:outline-none">
            ✕
          </button>
          {user ? (
            <>
              <Link href="/login" onClick={closeMenu} className="block text-white hover:text-gray-300">Login</Link>
              <Link href="/createaccount" onClick={closeMenu} className="block text-white hover:text-gray-300">Create Account</Link>
            </>
          ) : (
            <>
              <Link href="/" onClick={closeMenu} className="block text-white hover:text-gray-300">Home</Link>
              <Link href="/dashboard" onClick={closeMenu} className="block text-white hover:text-gray-300">Dashboard</Link>
              <button onClick={logout} className="block text-white hover:text-gray-300">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
