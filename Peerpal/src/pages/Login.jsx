import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const role = searchParams.get("role") === "tutor" ? "tutor" : "student";
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

            // Route based on mock role
            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else if (user.role === "tutor") {
                navigate("/tutor/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            // Enhanced error mapping to provide friendlier messages
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
            {/* Left – Login Form (no overflow) */}
            <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-hidden">
                {/* Top bar */}
                <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20 flex-shrink-0">
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/icon.png" alt="PeerPal" className="h-9 w-auto" />
                        <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            PeerPal
                        </span>
                    </Link>
                    <Link
                        to="/admin/login"
                        className="text-sm font-medium text-gray-500 hover:text-purple-700 transition-colors flex items-center gap-1.5"
                    >
                        <span className="material-icons-round text-lg">admin_panel_settings</span>
                        Admin Login
                    </Link>
                </nav>

                {/* Form */}
                <main className="flex-1 flex items-center justify-center px-6 sm:px-10">
                    <div className="w-full max-w-md">
                        <style>
                            {`
                            @keyframes slideFadeIn {
                                from { opacity: 0; transform: translateY(10px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                            .animate-slide-fade {
                                animation: slideFadeIn 0.3s ease-out forwards;
                            }
                            `}
                        </style>

                        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 mb-2">
                            Log in to PeerPal
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Enter your credentials to access your account.
                        </p>

                        {/* Role Toggle Tabs */}
                        <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                            <button
                                type="button"
                                onClick={() => setSearchParams({ role: "student" })}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === "student" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <span className="material-icons-round text-base">school</span>
                                Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setSearchParams({ role: "tutor" })}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${role === "tutor" ? "bg-white text-secondary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <span className="material-icons-round text-base">auto_stories</span>
                                Tutor
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* Email & Password */}
                        <form key={role} className="space-y-5 animate-slide-fade" onSubmit={handleLogin}>
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
                                        placeholder="example@gmail.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs text-primary font-semibold hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                        lock
                                    </span>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
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
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/30"
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
                                className="w-full bg-primary hover:bg-blue-800 text-white font-semibold py-3.5 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {isLoading ? "Logging in..." : "Log In"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            Don't have an account?{" "}
                            <Link
                                to="/get-started"
                                className="text-primary font-semibold hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </main>
            </div>

            {/* Right – Image Panel (hidden on mobile) */}
            <div className="hidden lg:block lg:w-1/2 relative h-screen overflow-y-auto scrollbar-hide">
                {/* Background image */}
                <img
                    src="/images/login.jpg"
                    alt="Students learning together"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-primary/70" />

                {/* Logo in top-left */}
                <div className="absolute top-8 left-8 flex items-center gap-2.5 z-10">
                    <img src="/icon.png" alt="PeerPal" className="h-10 w-auto brightness-0 invert" />
                    <span className="text-xl font-display font-bold text-white">PeerPal</span>
                </div>

                {/* Bottom tagline */}
                <div className="absolute bottom-10 left-8 right-8 z-10">
                    <h2 className="text-3xl font-display font-bold text-white mb-3 leading-tight">
                        Smarter Learning<br />Through Peers
                    </h2>
                    <p className="text-white/80 text-base leading-relaxed max-w-sm">
                        Connect with top-performing students at your university for personalized tutoring.
                    </p>
                </div>
            </div>
        </div>
    );
}
