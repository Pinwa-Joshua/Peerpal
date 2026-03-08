const features = [
    {
        icon: "psychology",
        label: "Intelligent Matching",
        description:
            "Our algorithm considers your course syllabus, learning style, and schedule to find your ideal tutor.",
        colorClasses: "bg-indigo-50 text-indigo-600",
    },
    {
        icon: "lock",
        label: "Secure Payments",
        description:
            "Transactions are held in escrow until the session is complete. Satisfaction guaranteed.",
        colorClasses: "bg-green-50 text-green-600",
    },
    {
        icon: "schedule",
        label: "Flexible Scheduling",
        description:
            "Book sessions that fit your busy university life — late night or early morning.",
        colorClasses: "bg-pink-50 text-pink-600",
    },
];

const bullets = [
    "Specific course knowledge, not generic help",
    "Affordable rates set by fellow students",
    "Shared campus experience and community",
];

export default function WhyPeerPal() {
    return (
        <section id="why-peerpal" className="py-20 bg-bg-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Feature cards */}
                    <div className="order-2 md:order-1">
                        <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 relative">
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full blur-2xl" />

                            <div className="space-y-6">
                                {features.map((f, i) => (
                                    <div key={f.label}>
                                        <div className="flex gap-4 items-start">
                                            <div
                                                className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${f.colorClasses}`}
                                            >
                                                <span className="material-icons-round">{f.icon}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 font-display">
                                                    {f.label}
                                                </h4>
                                                <p className="text-gray-600 text-sm mt-1">
                                                    {f.description}
                                                </p>
                                            </div>
                                        </div>
                                        {i < features.length - 1 && (
                                            <hr className="border-gray-100 mt-6" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Copy */}
                    <div className="order-1 md:order-2">
                        <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-6">
                            Why Students Choose PeerPal
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            PeerPal isn't just a tutoring service — it's a community. We
                            bridge the gap between struggling in silence and collaborative
                            success.
                        </p>

                        <ul className="space-y-4 mb-8">
                            {bullets.map((b) => (
                                <li key={b} className="flex items-center text-gray-700">
                                    <span className="material-icons-round text-secondary mr-3">
                                        check
                                    </span>
                                    {b}
                                </li>
                            ))}
                        </ul>

                        <a
                            href="#"
                            className="text-primary font-semibold hover:underline inline-flex items-center group"
                        >
                            Learn more about our mission
                            <span className="material-icons-round ml-1 group-hover:translate-x-1 transition-transform text-lg">
                                arrow_forward
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
