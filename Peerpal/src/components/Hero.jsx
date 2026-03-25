import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left – Copy */}
                    <div className="max-w-2xl text-center lg:text-left z-10">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-primary text-sm font-semibold mb-6 border border-blue-100">
                            <span className="material-icons-round text-base">school</span>
                            University-Level Peer Tutoring
                        </span>

                        <h1 className="text-4xl lg:text-6xl font-display font-extrabold tracking-tight text-gray-900 leading-tight mb-6">
                            Smarter Learning{" "}
                            <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Through Peers
                            </span>
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Connect with top-performing students at your university for
                            personalised tutoring. Master your courses, ace your exams, and
                            learn together.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                to="/get-started"
                                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-full text-white bg-primary hover:bg-blue-800 shadow-xl shadow-blue-900/20 transition-all hover:-translate-y-0.5"
                            >
                                Find a Tutor
                            </Link>
                            <Link
                                to="/get-started"
                                className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-primary text-base font-semibold rounded-full text-primary bg-transparent hover:bg-blue-50 transition-all hover:-translate-y-0.5"
                            >
                                Become a Tutor
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-medium">
                            <span className="flex items-center gap-1">
                                <span className="material-icons-round text-green-500 text-lg">check_circle</span>
                                Verified Tutors
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="material-icons-round text-green-500 text-lg">check_circle</span>
                                Secure Payments
                            </span>
                        </div>
                    </div>

                    {/* Right – Illustrative Card */}
                    <div className="relative hidden lg:block">
                        {/* Background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full blur-3xl -z-10" />

                        {/* Tutor card */}
                        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-md mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    AM
                                </div>
                                <div>
                                    <h3 className="font-display font-bold text-gray-900 text-lg">
                                        Amara M.
                                    </h3>
                                    <p className="text-secondary text-sm font-medium">
                                        Calculus &amp; Linear Algebra
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Helps students improve confidence, solve faster, and perform better in exams.
                                    </p>
                                </div>
                                <div className="ml-auto flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-lg text-yellow-600 text-sm font-bold">
                                    <span className="material-icons-round text-sm">star</span>
                                    4.9
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 leading-relaxed">
                                <p>
                                    A structured math support session designed to build speed, clarity, and exam confidence.
                                </p>
                            </div>

                            <div className="mt-6 flex justify-between items-center">
                                <span className="text-gray-500 font-medium text-sm">
                                    ₦150 / hr
                                </span>
                                <button className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition">
                                    Book Session
                                </button>
                            </div>
                        </div>

                        {/* Floating stat badge */}
                        <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: "3s" }}>
                            <div className="bg-green-100 p-2 rounded-full">
                                <span className="material-icons-round text-green-600">trending_up</span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    GPA Boost
                                </p>
                                <p className="text-gray-900 font-bold text-lg">+0.5 Avg</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
