const reviews = [
    {
        stars: 5,
        text: "I was failing Chem 101 until I found a tutor on PeerPal who had taken the exact same class with the same professor. Absolute lifesaver!",
        initials: "TN",
        name: "Thabo N.",
        detail: "2nd Year, Biology",
        bgColor: "bg-blue-200 text-blue-700",
    },
    {
        stars: 5,
        text: "Becoming a tutor has been a great way to earn extra cash on my own schedule. The platform makes payments and booking super easy.",
        initials: "LM",
        name: "Lerato M.",
        detail: "Final Year, Engineering",
        bgColor: "bg-green-200 text-green-700",
    },
    {
        stars: 4.5,
        text: "The search filters are amazing. I needed help specifically with Python for Data Science and found a perfect match in minutes.",
        initials: "KD",
        name: "Kabelo D.",
        detail: "3rd Year, Computer Science",
        bgColor: "bg-purple-200 text-purple-700",
    },
];

function Stars({ count }) {
    const full = Math.floor(count);
    const hasHalf = count % 1 !== 0;

    return (
        <div className="flex text-accent mb-4">
            {Array.from({ length: full }).map((_, i) => (
                <span key={i} className="material-icons-round">star</span>
            ))}
            {hasHalf && <span className="material-icons-round">star_half</span>}
        </div>
    );
}

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-20 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-display font-bold text-center text-gray-900 mb-12">
                    Student Success Stories
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((r) => (
                        <div
                            key={r.name}
                            className="bg-bg-light p-8 rounded-2xl hover:shadow-lg transition duration-300 border border-transparent hover:border-gray-200"
                        >
                            <Stars count={r.stars} />
                            <p className="text-gray-600 mb-6 italic leading-relaxed">
                                "{r.text}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${r.bgColor}`}
                                >
                                    {r.initials}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                                    <p className="text-xs text-gray-500">{r.detail}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
