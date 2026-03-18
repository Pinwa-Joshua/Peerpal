const steps = [
    {
        icon: "search",
        title: "Search",
        description: "Browse tutors by course code, subject, or university.",
    },
    {
        icon: "handshake",
        title: "Match",
        description: "Connect with a peer who aced the exact class you're taking.",
    },
    {
        icon: "menu_book",
        title: "Learn",
        description: "Meet online or on campus for a productive study session.",
    },
    {
        icon: "star_rate",
        title: "Review",
        description: "Rate your session and track your academic progress.",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                        How PeerPal Works
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Get started in minutes. Our streamlined process connects you with
                        the perfect study partner.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-4 gap-8 relative">
                    {/* Connector line (desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-0" />

                    {steps.map((step, i) => (
                        <div
                            key={step.title}
                            className="relative flex flex-col items-center text-center z-10"
                        >
                            <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100 shadow-sm transition hover:scale-105">
                                <span className="material-icons-round text-4xl text-primary">
                                    {step.icon}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
                                {i + 1}. {step.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
