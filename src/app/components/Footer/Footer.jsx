
import React from 'react'

const Footer = () => {
    return (
        <footer className="fixed bottom-0 w-full py-6 text-center text-sm bg-indigo-900">
            © {new Date().getFullYear()} YourCompany. All rights reserved.
        </footer>
    )
}

export default Footer