import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthAPI } from "../services/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [resetLink, setResetLink] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsSubmitting(true);

        try {
            const response = await AuthAPI.forgotPassword(email);
            setResetLink(response?.reset_link || "");
            setSuccessMessage(response?.message || "Reset request processed successfully.");
            setSubmitted(true);
        } catch (submitError) {
            console.error("Failed to request password reset", submitError);
            const message = submitError.message || "Unable to process reset request.";
            if (message.includes("404")) {
                setError("Password reset route is not available yet. Restart the backend server on port 5000 and try again.");
            } else if (message === "Failed to fetch") {
                setError("Cannot reach the server. Make sure the backend is running on port 5000.");
            } else {
                setError(message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
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

            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8 sm:p-10">
                        {!submitted ? (
                            <>
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 mx-auto">
                                    <span className="material-icons-round text-3xl text-primary">
                                        lock_reset
                                    </span>
                                </div>

                                <h1 className="text-2xl font-display font-extrabold text-gray-900 text-center mb-2">
                                    Forgot your password?
                                </h1>
                                <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed">
                                    Enter the email linked to your account and we&apos;ll generate a reset link for you.
                                </p>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                        {error}
                                    </div>
                                )}

                                <form className="space-y-5" onSubmit={handleSubmit}>
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
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@university.ac.za"
                                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary hover:bg-blue-800 text-white font-semibold py-3.5 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                                    >
                                        {isSubmitting ? "Generating link..." : "Send Reset Link"}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 mx-auto">
                                    <span className="material-icons-round text-3xl text-green-500">
                                        mark_email_read
                                    </span>
                                </div>

                                <h2 className="text-2xl font-display font-extrabold text-gray-900 mb-2">
                                    Reset link ready
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    {successMessage || "Your password reset request has been processed. Use the link below to create a new password."}
                                </p>

                                {resetLink && (
                                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-left mb-6">
                                        <p className="text-xs font-semibold text-blue-700 uppercase mb-2">
                                            Reset Link
                                        </p>
                                        <a
                                            href={resetLink}
                                            className="text-sm text-primary break-all underline"
                                        >
                                            {resetLink}
                                        </a>
                                    </div>
                                )}

                                <button
                                    onClick={() => {
                                        setSubmitted(false);
                                        setResetLink("");
                                        setSuccessMessage("");
                                    }}
                                    className="text-primary font-semibold text-sm hover:underline inline-flex items-center gap-1"
                                >
                                    <span className="material-icons-round text-lg">refresh</span>
                                    Request another link
                                </button>
                            </div>
                        )}

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
