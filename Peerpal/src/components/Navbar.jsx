import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/icon.png" alt="PeerPal" className="h-10 w-auto" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent group-hover:opacity-80 transition">PeerPal</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#how-it-works" className="text-gray-600 hover:text-primary font-medium transition">
                            How it Works
                        </a>
                        <a href="#why-peerpal" className="text-gray-600 hover:text-primary font-medium transition">
                            Why PeerPal
                        </a>
                        <a href="#testimonials" className="text-gray-600 hover:text-primary font-medium transition">
                            Testimonials
                        </a>
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Log in
                        </Link>
                        <Link
                            to="/get-started"
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full font-semibold transition shadow-lg shadow-primary/20"
                        >
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className="material-icons-round text-3xl">
                            {menuOpen ? "close" : "menu"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-6 pt-2 space-y-4">
                    <a href="#how-it-works" className="block text-gray-600 hover:text-primary font-medium py-2" onClick={() => setMenuOpen(false)}>
                        How it Works
                    </a>
                    <a href="#why-peerpal" className="block text-gray-600 hover:text-primary font-medium py-2" onClick={() => setMenuOpen(false)}>
                        Why PeerPal
                    </a>
                    <a href="#testimonials" className="block text-gray-600 hover:text-primary font-medium py-2" onClick={() => setMenuOpen(false)}>
                        Testimonials
                    </a>
                    <hr className="border-gray-100" />
                    <Link to="/login" className="block text-primary font-semibold py-2" onClick={() => setMenuOpen(false)}>
                        Log in
                    </Link>
                    <Link
                        to="/get-started"
                        className="block text-center bg-primary text-white py-3 rounded-full font-semibold shadow-lg shadow-primary/20"
                        onClick={() => setMenuOpen(false)}
                    >
                        Sign Up
                    </Link>
                </div>
            )}
        </nav>
    );
}
