import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            {/* Top bar */}
            <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-20">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/icon.png" alt="PeerPal" className="h-10 w-auto" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent group-hover:opacity-80 transition">
                            PeerPal
                        </span>
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 sm:p-10">
                        {!submitted ? (
                            <>
                                {/* Icon */}
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 mx-auto">
                                    <span className="material-icons-round text-3xl text-primary">
                                        lock_reset
                                    </span>
                                </div>

                                <h1 className="text-2xl font-display font-extrabold text-gray-900 text-center mb-2">
                                    Forgot your password?
                                </h1>
                                <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed">
                                    No worries! Enter the email address linked to your account and
                                    we'll send you a reset link.
                                </p>

                                <form
                                    className="space-y-5"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setSubmitted(true);
                                    }}
                                >
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-semibold text-gray-700 mb-1.5"
                                        >
                                            Email address
                                        </label>
                                        <div className="relative">
                                            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                                mail
                                            </span>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                placeholder="you@university.ac.za"
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-blue-800 text-white font-semibold py-3.5 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                                    >
                                        Send Reset Link
                                    </button>
                                </form>
                            </>
                        ) : (
                            /* Success state */
                            <div className="text-center py-4">
                                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 mx-auto">
                                    <span className="material-icons-round text-3xl text-green-500">
                                        mark_email_read
                                    </span>
                                </div>

                                <h2 className="text-2xl font-display font-extrabold text-gray-900 mb-2">
                                    Check your inbox
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                    We've sent a password reset link to your email. Click the link
                                    to create a new password.
                                </p>

                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-primary font-semibold text-sm hover:underline inline-flex items-center gap-1"
                                >
                                    <span className="material-icons-round text-lg">refresh</span>
                                    Didn't receive it? Resend
                                </button>
                            </div>
                        )}

                        {/* Back to login */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <Link
                                to="/login"
                                className="text-sm text-gray-500 hover:text-primary font-medium inline-flex items-center gap-1 transition"
                            >
                                <span className="material-icons-round text-lg">
                                    arrow_back
                                </span>
                                Back to Log in
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
