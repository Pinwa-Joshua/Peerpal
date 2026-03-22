import { useState } from "react";

/* ─── constants ─── */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_BLOCKS = [
    { label: "Morning", sub: "08:00 – 12:00", icon: "wb_sunny" },
    { label: "Afternoon", sub: "12:00 – 17:00", icon: "wb_twilight" },
    { label: "Evening", sub: "17:00 – 21:00", icon: "nights_stay" },
];
const FORMAT_OPTIONS = [
    { value: "online", label: "Online", icon: "videocam" },
    { value: "in-person", label: "In-Person", icon: "location_on" },
    { value: "both", label: "Both", icon: "sync_alt" },
];

const INITIAL_SCHEDULE = {
    Mon: ["Morning", "Afternoon"],
    Tue: ["Morning"],
    Wed: ["Morning", "Afternoon", "Evening"],
    Thu: [],
    Fri: ["Afternoon"],
    Sat: [],
    Sun: [],
};

const BLOCKED_DATES = [
    { id: 1, label: "Exam Week", start: "24 Mar", end: "28 Mar" },
    { id: 2, label: "Easter Break", start: "18 Apr", end: "21 Apr" },
];

export default function Availability() {
    const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
    const [format, setFormat] = useState("both");
    const [rate, setRate] = useState(120);
    const [blockedDates, setBlockedDates] = useState(BLOCKED_DATES);
    const [saved, setSaved] = useState(false);

    const toggle = (day, block) => {
        setSchedule((prev) => {
            const current = prev[day];
            return {
                ...prev,
                [day]: current.includes(block)
                    ? current.filter((b) => b !== block)
                    : [...current, block],
            };
        });
        setSaved(false);
    };

    const totalSlots = Object.values(schedule).reduce(
        (sum, arr) => sum + arr.length,
        0
    );

    const save = () => setSaved(true);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                        Availability
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Set when students can book sessions with you.
                    </p>
                </div>
                <button
                    onClick={save}
                    className="bg-tutor hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2"
                >
                    <span className="material-icons-round text-lg">save</span>
                    Save Changes
                </button>
            </div>

            {saved && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl p-3 text-sm font-medium">
                    <span className="material-icons-round text-lg">check_circle</span>
                    Changes saved successfully!
                </div>
            )}

            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 text-center">
                    <p className="text-3xl font-display font-extrabold text-tutor">
                        {totalSlots}
                    </p>
                    <p className="text-xs text-gray-400 font-semibold uppercase mt-1">
                        Available Slots / Week
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 text-center">
                    <p className="text-3xl font-display font-extrabold text-tutor">
                        ₦{rate}
                    </p>
                    <p className="text-xs text-gray-400 font-semibold uppercase mt-1">
                        Hourly Rate
                    </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-4 text-center col-span-2 sm:col-span-1">
                    <p className="text-3xl font-display font-extrabold text-tutor capitalize">
                        {format}
                    </p>
                    <p className="text-xs text-gray-400 font-semibold uppercase mt-1">
                        Session Format
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly schedule */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                    <h3 className="font-display font-bold text-gray-900 mb-5">
                        Weekly Schedule
                    </h3>

                    {/* Desktop / tablet grid */}
                    <div className="hidden sm:block">
                        <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-2 text-center text-xs font-semibold text-gray-400 uppercase mb-2">
                            <span />
                            {DAYS.map((d) => (
                                <span key={d}>{d}</span>
                            ))}
                        </div>
                        {TIME_BLOCKS.map((tb) => (
                            <div
                                key={tb.label}
                                className="grid grid-cols-[100px_repeat(7,1fr)] gap-2 mb-2"
                            >
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <span className="material-icons-round text-base">
                                        {tb.icon}
                                    </span>
                                    {tb.label}
                                </div>
                                {DAYS.map((day) => {
                                    const active = schedule[day].includes(tb.label);
                                    return (
                                        <button
                                            key={day}
                                            onClick={() => toggle(day, tb.label)}
                                            className={`rounded-xl py-3 text-xs font-semibold border-2 transition-all ${active
                                                    ? "border-tutor bg-tutor text-white"
                                                    : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                                                }`}
                                        >
                                            {active ? "✓" : "—"}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    {/* Mobile stacked */}
                    <div className="sm:hidden space-y-4">
                        {DAYS.map((day) => (
                            <div key={day}>
                                <p className="text-sm font-bold text-gray-700 mb-2">{day}</p>
                                <div className="flex gap-2">
                                    {TIME_BLOCKS.map((tb) => {
                                        const active = schedule[day].includes(tb.label);
                                        return (
                                            <button
                                                key={tb.label}
                                                onClick={() => toggle(day, tb.label)}
                                                className={`flex-1 rounded-xl py-2 text-xs font-semibold border-2 transition-all ${active
                                                        ? "border-tutor bg-tutor text-white"
                                                        : "border-gray-200 bg-white text-gray-400"
                                                    }`}
                                            >
                                                {tb.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar – preferences */}
                <div className="space-y-6">
                    {/* Session format */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                        <h3 className="font-display font-bold text-gray-900 mb-4">
                            Session Format
                        </h3>
                        <div className="space-y-2">
                            {FORMAT_OPTIONS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => {
                                        setFormat(f.value);
                                        setSaved(false);
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${format === f.value
                                            ? "border-tutor bg-teal-50"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <span
                                        className={`material-icons-round ${format === f.value
                                                ? "text-tutor"
                                                : "text-gray-400"
                                            }`}
                                    >
                                        {f.icon}
                                    </span>
                                    <span
                                        className={`text-sm font-semibold ${format === f.value
                                                ? "text-tutor"
                                                : "text-gray-600"
                                            }`}
                                    >
                                        {f.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hourly rate */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                        <h3 className="font-display font-bold text-gray-900 mb-4">
                            Hourly Rate
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-400">R</span>
                            <input
                                type="number"
                                min={50}
                                max={500}
                                step={10}
                                value={rate}
                                onChange={(e) => {
                                    setRate(Number(e.target.value));
                                    setSaved(false);
                                }}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-lg font-display font-bold text-gray-900 focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Min ₦50 – Max ₦500</p>
                    </div>

                    {/* Blocked dates */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-display font-bold text-gray-900">
                                Blocked Dates
                            </h3>
                            <button className="text-sm text-tutor font-semibold hover:underline">
                                + Add
                            </button>
                        </div>
                        {blockedDates.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">
                                No blocked dates.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {blockedDates.map((bd) => (
                                    <div
                                        key={bd.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-100"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {bd.label}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {bd.start} – {bd.end}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setBlockedDates((prev) =>
                                                    prev.filter((d) => d.id !== bd.id)
                                                );
                                                setSaved(false);
                                            }}
                                            className="text-red-400 hover:text-red-600 transition"
                                        >
                                            <span className="material-icons-round text-lg">
                                                close
                                            </span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
