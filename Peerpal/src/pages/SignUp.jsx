import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AuthAPI } from "../services/api";
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
                navigate("/onboarding/tutor");
            } else {
                navigate("/onboarding/student");
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
                <nav className="flex items-center justify-between px-6 sm:px-10 h-20">
                    <Link to="/" className="flex items-center gap-2 group lg:invisible">
                        <img src="/icon.png" alt="PeerPal" className="h-9 w-auto" />
                        <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            PeerPal
                        </span>
                    </Link>
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to={`/login?role=${role}`}
                            className="text-primary font-semibold hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
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

                        {/* Third-party sign-up */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm">
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>

                            <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition shadow-sm">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                </svg>
                                Apple
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400 font-medium uppercase">
                                or sign up with email
                            </span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

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
