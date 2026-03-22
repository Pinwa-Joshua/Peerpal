import { Link } from "react-router-dom";

const roles = [
    {
        id: "student",
        icon: "school",
        title: "I'm a Student",
        description:
            "Find peer tutors who've aced the courses you're taking. Get personalised help and boost your grades.",
        color: "from-primary to-blue-700",
        iconBg: "bg-blue-50",
        iconColor: "text-primary",
    },
    {
        id: "tutor",
        icon: "auto_stories",
        title: "I'm a Tutor",
        description:
            "Share your knowledge, set your own schedule, and earn money by helping fellow students succeed.",
        color: "from-secondary to-blue-400",
        iconBg: "bg-sky-50",
        iconColor: "text-secondary",
    },
];

export default function RoleSelection() {
    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            {/* Minimal top bar */}
            <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
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
                <div className="max-w-3xl w-full text-center">
                    {/* Heading */}
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-primary text-sm font-semibold mb-6 border border-blue-100">
                        <span className="material-icons-round text-base">waving_hand</span>
                        Welcome to PeerPal
                    </span>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-gray-900 mb-4">
                        How will you use{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            PeerPal
                        </span>
                        ?
                    </h1>
                    <p className="text-lg text-gray-500 mb-12 max-w-xl mx-auto">
                        Choose your role to get started. You can always switch later.
                    </p>

                    {/* Role Cards */}
                    <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {roles.map((role) => (
                            <Link
                                key={role.id}
                                to={`/signup?role=${role.id}`}
                                className="group relative bg-white rounded-2xl border border-gray-100 p-8 text-left shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Icon */}
                                <div
                                    className={`w-16 h-16 rounded-2xl ${role.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                                >
                                    <span
                                        className={`material-icons-round text-3xl ${role.iconColor}`}
                                    >
                                        {role.icon}
                                    </span>
                                </div>

                                <h2 className="text-xl font-display font-bold text-gray-900 mb-2">
                                    {role.title}
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    {role.description}
                                </p>

                                {/* Arrow */}
                                <span className="inline-flex items-center text-primary font-semibold text-sm group-hover:gap-2 gap-1 transition-all">
                                    Get started
                                    <span className="material-icons-round text-lg group-hover:translate-x-1 transition-transform">
                                        arrow_forward
                                    </span>
                                </span>

                                {/* Hover gradient bar at top */}
                                <div
                                    className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${role.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                                />
                            </Link>
                        ))}
                    </div>

                    {/* Already have account */}
                    <p className="mt-10 text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-primary font-semibold hover:underline"
                        >
                            Log in
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
