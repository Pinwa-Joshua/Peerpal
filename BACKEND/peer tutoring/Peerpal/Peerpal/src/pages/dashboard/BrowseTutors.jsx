import { useState } from "react";

/* ─── mock tutors ─── */
const TUTORS = [
    { id: 1, name: "Zanele D.", initials: "ZD", gradient: "from-yellow-400 to-orange-500", university: "University of Cape Town", subjects: ["Linear Algebra", "Calculus I", "Calculus II"], rating: 4.9, reviews: 42, rate: 120, format: "both", active: "2 hrs ago" },
    { id: 2, name: "Sipho N.", initials: "SN", gradient: "from-cyan-500 to-blue-600", university: "University of the Witwatersrand", subjects: ["Chemistry 101", "Organic Chemistry"], rating: 4.8, reviews: 35, rate: 100, format: "online", active: "Online now" },
    { id: 3, name: "Amara L.", initials: "AL", gradient: "from-violet-500 to-purple-600", university: "Stellenbosch University", subjects: ["Statistics 101", "Economics 101"], rating: 4.7, reviews: 28, rate: 90, format: "in-person", active: "1 hr ago" },
    { id: 4, name: "Thabo M.", initials: "TM", gradient: "from-blue-500 to-indigo-600", university: "University of Pretoria", subjects: ["Calculus II", "Physics I", "Physics II"], rating: 4.9, reviews: 56, rate: 150, format: "both", active: "Online now" },
    { id: 5, name: "Naledi K.", initials: "NK", gradient: "from-pink-500 to-rose-600", university: "University of KwaZulu-Natal", subjects: ["Biology 101", "Anatomy & Physiology"], rating: 4.6, reviews: 19, rate: 80, format: "in-person", active: "3 hrs ago" },
    { id: 6, name: "James P.", initials: "JP", gradient: "from-emerald-500 to-teal-600", university: "Rhodes University", subjects: ["Data Structures & Algorithms", "Intro to Programming"], rating: 4.8, reviews: 31, rate: 130, format: "online", active: "Online now" },
    { id: 7, name: "Fatima R.", initials: "FR", gradient: "from-amber-500 to-red-500", university: "University of Johannesburg", subjects: ["Financial Accounting", "Management Accounting"], rating: 4.5, reviews: 24, rate: 110, format: "both", active: "5 hrs ago" },
    { id: 8, name: "Lebo S.", initials: "LS", gradient: "from-lime-500 to-green-600", university: "Nelson Mandela University", subjects: ["Psychology 101", "Sociology 101"], rating: 4.7, reviews: 17, rate: 85, format: "online", active: "30 min ago" },
    { id: 9, name: "Daniel V.", initials: "DV", gradient: "from-sky-500 to-indigo-500", university: "North-West University", subjects: ["Web Development", "Database Systems"], rating: 4.9, reviews: 48, rate: 140, format: "both", active: "Online now" },
    { id: 10, name: "Precious M.", initials: "PM", gradient: "from-fuchsia-500 to-pink-600", university: "University of the Free State", subjects: ["Academic English", "Business Law"], rating: 4.4, reviews: 12, rate: 75, format: "in-person", active: "1 day ago" },
];

const SUBJECTS = [
    "All Subjects",
    "Calculus I", "Calculus II", "Linear Algebra", "Statistics 101",
    "Physics I", "Physics II", "Chemistry 101", "Organic Chemistry",
    "Biology 101", "Intro to Programming", "Data Structures & Algorithms",
    "Web Development", "Database Systems", "Financial Accounting",
    "Economics 101", "Psychology 101",
];

const FORMATS = ["All", "Online", "In-Person", "Both"];
const SORT_OPTIONS = ["Relevance", "Price: Low → High", "Price: High → Low", "Rating"];

export default function BrowseTutors() {
    const [search, setSearch] = useState("");
    const [subject, setSubject] = useState("All Subjects");
    const [format, setFormat] = useState("All");
    const [sort, setSort] = useState("Relevance");

    let filtered = TUTORS.filter((t) => {
        const matchSearch =
            search === "" ||
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
            t.university.toLowerCase().includes(search.toLowerCase());
        const matchSubject =
            subject === "All Subjects" || t.subjects.includes(subject);
        const matchFormat =
            format === "All" || t.format === format.toLowerCase() || t.format === "both";
        return matchSearch && matchSubject && matchFormat;
    });

    if (sort === "Price: Low → High") filtered.sort((a, b) => a.rate - b.rate);
    else if (sort === "Price: High → Low") filtered.sort((a, b) => b.rate - a.rate);
    else if (sort === "Rating") filtered.sort((a, b) => b.rating - a.rating);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                    Browse Tutors
                </h1>
                <p className="text-gray-500 mt-1">
                    Find the perfect peer tutor for your courses.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Search */}
                    <div className="relative sm:col-span-2 lg:col-span-1">
                        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                            search
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Name, subject, university…"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
                    </div>
                    {/* Subject */}
                    <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition appearance-none"
                    >
                        {SUBJECTS.map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                    {/* Format */}
                    <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition appearance-none"
                    >
                        {FORMATS.map((f) => (
                            <option key={f}>{f}</option>
                        ))}
                    </select>
                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition appearance-none"
                    >
                        {SORT_OPTIONS.map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-400 font-medium">
                {filtered.length} tutor{filtered.length !== 1 ? "s" : ""} found
            </p>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((tutor) => (
                        <div
                            key={tutor.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-soft p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
                        >
                            {/* Hover accent bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-t-2xl opacity-0 group-hover:opacity-100 transition" />

                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${tutor.gradient} flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg`}
                                >
                                    {tutor.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-display font-bold text-gray-900 truncate">
                                        {tutor.name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                        {tutor.university}
                                    </p>
                                    <p className="text-xs text-green-500 font-medium mt-0.5">
                                        {tutor.active}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-lg text-yellow-600 text-xs font-bold flex-shrink-0">
                                    <span className="material-icons-round text-sm">
                                        star
                                    </span>
                                    {tutor.rating}
                                    <span className="text-yellow-400 font-medium">
                                        ({tutor.reviews})
                                    </span>
                                </div>
                            </div>

                            {/* Subjects */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {tutor.subjects.slice(0, 3).map((sub) => (
                                    <span
                                        key={sub}
                                        className="px-2.5 py-0.5 rounded-full bg-blue-50 text-primary text-xs font-semibold border border-blue-100"
                                    >
                                        {sub}
                                    </span>
                                ))}
                                {tutor.subjects.length > 3 && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">
                                        +{tutor.subjects.length - 3}
                                    </span>
                                )}
                            </div>

                            {/* Format + Rate */}
                            <div className="flex items-center justify-between mb-4 text-sm">
                                <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${tutor.format === "online"
                                            ? "bg-green-50 text-green-600"
                                            : tutor.format === "in-person"
                                                ? "bg-orange-50 text-orange-600"
                                                : "bg-blue-50 text-primary"
                                        }`}
                                >
                                    <span className="material-icons-round text-xs">
                                        {tutor.format === "online"
                                            ? "videocam"
                                            : tutor.format === "in-person"
                                                ? "location_on"
                                                : "swap_horiz"}
                                    </span>
                                    {tutor.format}
                                </span>
                                <span className="text-gray-900 font-bold">
                                    R{tutor.rate}
                                    <span className="text-gray-400 font-medium">
                                        /hr
                                    </span>
                                </span>
                            </div>

                            <button className="w-full bg-primary hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-xl shadow-sm transition">
                                Book Session
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-12 text-center">
                    <span className="material-icons-round text-5xl text-gray-300 mb-3 block">
                        search_off
                    </span>
                    <p className="text-gray-500 font-semibold mb-1">
                        No tutors found
                    </p>
                    <p className="text-gray-400 text-sm">
                        Try adjusting your search or filters.
                    </p>
                </div>
            )}
        </div>
    );
}
