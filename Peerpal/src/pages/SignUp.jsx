import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AuthAPI } from "../services/api.js";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
    const [searchParams] = useSearchParams();
    const role = searchParams.get("role") || "tutee"; // Match backend role enum if possible
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const firstName = e.target.first.value.trim();
        const lastName = e.target.last.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        try {
            // Register
            await AuthAPI.register({
                full_name: `${firstName} ${lastName}`,
                email,
                password,
                role: role // 'tutor' or 'tutee'
            });

            // Auto-login after registration
            await login(email, password);

            if (role === "tutor") {
                navigate("/onboarding/tutor/quiz");
            } else {
                navigate("/onboarding/student/quiz");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen h-screen bg-bg-light flex overflow-hidden">
            {/* Left – Image Panel (hidden on mobile) */}
            <div className="hidden lg:block lg:w-1/2 relative h-screen overflow-hidden">
                {/* Background image */}
                <img
                    src="/images/login.jpg"
                    alt="Students learning together"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-primary/70" />

                {/* Logo in top-left */}
                <div className="absolute top-8 left-8 flex items-center gap-2.5 z-10">
                    <img src="/icon.png" alt="PeerPal" className="h-10 w-auto brightness-0 invert" />
                    <span className="text-xl font-display font-bold text-white">PeerPal</span>
                </div>

                {/* Bottom tagline */}
                <div className="absolute bottom-10 left-8 right-8 z-10">
                    <h2 className="text-3xl font-display font-bold text-white mb-3 leading-tight">
                        Join the Community
                    </h2>
                    <p className="text-white/80 text-base leading-relaxed max-w-sm">
                        {role === "tutor"
                            ? "Share your expertise, earn on your schedule, and help fellow students succeed."
                            : "Find peer tutors at your university, ace your courses, and learn smarter together."}
                    </p>
                </div>
            </div>

            {/* Right – Sign Up Form (scrollable, hidden scrollbar) */}
            <div className="flex-1 flex flex-col h-screen overflow-y-auto scrollbar-hide">
                {/* Top bar */}
                <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
                    <Link to="/" className="flex items-center gap-2 group lg:invisible">
                        <img src="/icon.png" alt="PeerPal" className="h-9 w-auto" />
                        <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            PeerPal
                        </span>
                    </Link>
                </nav>

                {/* Form */}
                <main className="flex-1 flex items-center justify-center px-6 sm:px-10 pb-12">
                    <div className="w-full max-w-md">
                        {/* Role badge */}
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-semibold mb-6 border border-blue-100 capitalize">
                            <span className="material-icons-round text-sm">
                                {role === "tutor" ? "auto_stories" : "school"}
                            </span>
                            {role} Account
                        </span>

                        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 mb-2">
                            Create your account
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Start your learning journey with PeerPal today.
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Name row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="first" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        First name
                                    </label>
                                    <input
                                        id="first"
                                        type="text"
                                        placeholder="John"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="last" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Last name
                                    </label>
                                    <input
                                        id="last"
                                        type="text"
                                        placeholder="Doe"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    University email
                                </label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">mail</span>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="example@gmail.com"
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-gppray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">lock</span>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 characters"
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

                            {/* Terms */}
                            <div className="flex items-start gap-2 pt-1">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="h-4 w-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary/30"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-500 leading-snug">
                                    I agree to PeerPal's{" "}
                                    <a href="#" className="text-primary hover:underline font-medium">
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-primary hover:underline font-medium">
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-blue-800 text-white font-semibold py-3.5 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link
                                to={`/login?role=${role}`}
                                className="text-primary font-semibold hover:underline"
                            >
                                Log in instead
                            </Link>
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
