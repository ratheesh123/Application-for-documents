import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    

    return (
        <header className="bg-blue-600 text-white body-font shadow-md">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row justify-between items-center">
                <Link to="/" className="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-blue-700 rounded-full" viewBox="0 0 24 24">
                        <path d="M12 2l9 4.5v6c0 5-4 9-9 9s-9-4-9-9v-6L12 2z"></path>
                    </svg>
                    <span className="ml-3 text-xl">LegalEase</span>
                </Link>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    {user ? (
                        <div className="flex items-center">
                            <span className="mr-5">Welcome, {user.name}!</span>
                            <button onClick={logout} className="inline-flex items-center bg-blue-500 hover:bg-blue-700 border-0 py-1 px-3 focus:outline-none rounded text-base mt-4 md:mt-0 transition-colors duration-200">
                                Logout
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                                    <path d="M16 17l-4 4m0 0l-4-4m4 4V3m-4 4l-4 4h18"></path>
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <Link to="/login" className="mr-5 hover:text-blue-300">Login</Link>
                            <Link to="/register" className="hover:text-blue-300">Register</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
