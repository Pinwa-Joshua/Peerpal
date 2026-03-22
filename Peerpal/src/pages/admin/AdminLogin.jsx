import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
    const navigate = useNavigate();
    const role = "admin";
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const email = e.target.email.value;
            const password = e.target.password.value;

            if (!email || !password) {
                throw new Error("Please enter both email and password.");
            }

            const user = await login(email, password, role);

            // Successfully authenticated as an admin
            if (user?.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                throw new Error("Unauthorized access. Admin privileges required.");
            }
        } catch (err) {
            let errorMessage = err.message;
            if (errorMessage === "Failed to fetch") {
                errorMessage = "Cannot connect to server. Please check your internet connection or try again later.";
            } else if (errorMessage.toLowerCase().includes("invalid credentials") || errorMessage.includes("401")) {
                errorMessage = "Incorrect email or password. Please try again.";
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen h-screen bg-bg-light flex overflow-hidden">
            {/* Login Form */}
            <div className="w-full flex flex-col h-screen overflow-hidden text-left bg-white">
                {/* Top bar */}
                <nav className="flex items-center px-4 sm:px-6 lg:px-8 h-20 flex-shrink-0 border-b border-gray-100">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/icon.png" alt="PeerPal" className="h-9 w-auto" />
                        <span className="text-lg font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                            PeerPal
                        </span>
                    </Link>
                </nav>

                {/* Form */}
                <main className="flex-1 flex items-center justify-center px-6 sm:px-10 overflow-y-auto">
                    <div className="w-full max-w-md">
                        {/* Role badge */}
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-6 border border-purple-100 capitalize">
                            <span className="material-icons-round text-sm">
                                security
                            </span>
                            Admin Portal
                        </span>

                        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 mb-2">
                            Admin Login
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Enter your administrator credentials to access the dashboard.
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleLogin}>
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-semibold text-gray-700 mb-1.5"
                                >
                                    Admin Email
                                </label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                        admin_panel_settings
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="admin@peerpal.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700/30 focus:border-purple-700 transition"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                        lock
                                    </span>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700/30 focus:border-purple-700 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <span className="material-icons-round text-xl">
                                            {showPassword ? "visibility_off" : "visibility"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center gap-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-purple-700 focus:ring-purple-700/30"
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm text-gray-600"
                                >
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3.5 rounded-full shadow-lg shadow-purple-700/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {isLoading ? "Authenticating..." : "Access Dashboard"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            <Link to="/" className="text-purple-700 font-semibold hover:underline">
                                ← Back to main site
                            </Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}