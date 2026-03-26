import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { TutorAPI } from "../../services/api";

/* ─── constants ─── */
const TABS = [
    { key: "profile", label: "Profile", icon: "person" },
    { key: "subjects", label: "Subjects & Rates", icon: "menu_book" },
    { key: "security", label: "Security", icon: "lock" },
    { key: "notifications", label: "Notifications", icon: "notifications" },
];

const SA_UNIVERSITIES = [
    "University of Cape Town",
    "University of the Witwatersrand",
    "Stellenbosch University",
    "University of Pretoria",
    "University of KwaZulu-Natal",
    "University of Johannesburg",
    "Rhodes University",
    "University of the Free State",
    "North-West University",
    "Nelson Mandela University",
];

const INITIAL_PROFILE = {
    displayName: "Thabo Mokoena",
    email: "thabo@wits.ac.za",
    bio: "Passionate about making complex concepts simple. Currently completing my Honours in Applied Mathematics.",
    university: "University of the Witwatersrand",
    teachingApproach: "I use real-world examples and work through problems step by step, encouraging students to think critically.",
    profilePhoto: null,
};

const INITIAL_SUBJECTS = [
    { id: 1, name: "Calculus II", rate: 120 },
    { id: 2, name: "Data Structures", rate: 150 },
    { id: 3, name: "Statistics 101", rate: 130 },
];

const NOTIFICATION_SETTINGS = [
    { key: "newRequests", label: "New Session Requests", desc: "When a student requests a session", default: true },
    { key: "messages", label: "Messages", desc: "When you receive a new message", default: true },
    { key: "reviews", label: "Reviews", desc: "When a student leaves a review", default: true },
    { key: "payouts", label: "Payouts", desc: "When a payout is processed", default: true },
    { key: "reminders", label: "Session Reminders", desc: "30 minutes before a session", default: true },
    { key: "marketing", label: "Platform Updates", desc: "Tips, feature announcements & newsletters", default: false },
];

export default function TutorSettings() {
    const { user, refreshUser } = useAuth();
    const [tab, setTab] = useState("profile");
    const [profile, setProfile] = useState(INITIAL_PROFILE);
    const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
    const [newSubject, setNewSubject] = useState("");
    const [newRate, setNewRate] = useState(100);
    const [notifications, setNotifications] = useState(
        Object.fromEntries(NOTIFICATION_SETTINGS.map((n) => [n.key, n.default]))
    );
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setProfile({
                displayName: user.displayName || user.name || "Thabo Mokoena",
                email: user.email || "thabo@wits.ac.za",
                bio: user.bio || "Passionate about making complex concepts simple.",
                university: user.university || "University of the Witwatersrand",
                teachingApproach: user.teachingApproach || "I use real-world examples.",
                profilePhoto: user.profilePhoto || null,
            });
        }
    }, [user]);

    const save = async () => {
        setIsSaving(true);
        try {
            await TutorAPI.updateTutorProfile(profile);
            await refreshUser();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Error updating tutor profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const addSubject = () => {
        if (!newSubject.trim()) return;
        setSubjects((prev) => [
            ...prev,
            { id: Date.now(), name: newSubject.trim(), rate: newRate },
        ]);
        setNewSubject("");
        setNewRate(100);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                        Settings
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your profile, subjects and preferences.
                    </p>
                </div>
                <button
                    onClick={save}
                    disabled={isSaving}
                    className="bg-tutor hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
                >
                    <span className="material-icons-round text-lg">save</span>
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {saved && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl p-3 text-sm font-medium">
                    <span className="material-icons-round text-lg">check_circle</span>
                    Changes saved successfully!
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto scrollbar-hide bg-gray-100 rounded-2xl p-1">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${tab === t.key
                            ? "bg-white text-tutor shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <span className="material-icons-round text-lg">{t.icon}</span>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                {/* ─── PROFILE ─── */}
                {tab === "profile" && (
                    <div className="space-y-6">
                        {/* Photo */}
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-tutor to-tutor-light flex items-center justify-center text-white text-3xl font-bold">
                                T
                            </div>
                            <div>
                                <button className="bg-tutor hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
                                    Upload Photo
                                </button>
                                <p className="text-xs text-gray-400 mt-1">
                                    JPG or PNG. Max 2 MB.
                                </p>
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.displayName}
                                    onChange={(e) =>
                                        setProfile({ ...profile, displayName: e.target.value })
                                    }
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                University
                            </label>
                            <select
                                value={profile.university}
                                onChange={(e) =>
                                    setProfile({ ...profile, university: e.target.value })
                                }
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                            >
                                {SA_UNIVERSITIES.map((u) => (
                                    <option key={u}>{u}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Bio
                            </label>
                            <textarea
                                rows={3}
                                maxLength={200}
                                value={profile.bio}
                                onChange={(e) =>
                                    setProfile({ ...profile, bio: e.target.value })
                                }
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition resize-none"
                            />
                            <p className="text-xs text-gray-400 text-right">
                                {profile.bio.length}/200
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Teaching Approach
                            </label>
                            <textarea
                                rows={3}
                                maxLength={300}
                                value={profile.teachingApproach}
                                onChange={(e) =>
                                    setProfile({ ...profile, teachingApproach: e.target.value })
                                }
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition resize-none"
                            />
                            <p className="text-xs text-gray-400 text-right">
                                {profile.teachingApproach.length}/300
                            </p>
                        </div>
                    </div>
                )}

                {/* ─── SUBJECTS & RATES ─── */}
                {tab === "subjects" && (
                    <div className="space-y-6">
                        <p className="text-sm text-gray-500">
                            Manage the subjects you teach and set individual rates.
                        </p>

                        {/* Current subjects */}
                        <div className="space-y-3">
                            {subjects.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                                        <span className="material-icons-round text-tutor text-lg">
                                            menu_book
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {s.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm text-gray-400 font-medium">R</span>
                                        <input
                                            type="number"
                                            min={50}
                                            max={500}
                                            step={10}
                                            value={s.rate}
                                            onChange={(e) =>
                                                setSubjects((prev) =>
                                                    prev.map((x) =>
                                                        x.id === s.id
                                                            ? { ...x, rate: Number(e.target.value) }
                                                            : x
                                                    )
                                                )
                                            }
                                            className="w-20 border-2 border-gray-200 rounded-lg px-2 py-1.5 text-sm font-semibold text-center focus:border-tutor outline-none transition"
                                        />
                                        <span className="text-xs text-gray-400">/hr</span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setSubjects((prev) =>
                                                prev.filter((x) => x.id !== s.id)
                                            )
                                        }
                                        className="text-gray-300 hover:text-red-500 transition"
                                    >
                                        <span className="material-icons-round text-lg">
                                            close
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add new */}
                        <div className="border-t border-gray-100 pt-5">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                Add Subject
                            </h4>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    placeholder="e.g. Linear Algebra"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                                />
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400 font-medium">R</span>
                                    <input
                                        type="number"
                                        min={50}
                                        max={500}
                                        step={10}
                                        value={newRate}
                                        onChange={(e) => setNewRate(Number(e.target.value))}
                                        className="w-24 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-center focus:border-tutor outline-none transition"
                                    />
                                    <span className="text-xs text-gray-400">/hr</span>
                                </div>
                                <button
                                    onClick={addSubject}
                                    className="bg-tutor hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl transition whitespace-nowrap"
                                >
                                    + Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── SECURITY ─── */}
                {tab === "security" && (
                    <div className="space-y-6 max-w-md">
                        <p className="text-sm text-gray-500">
                            Update your password to keep your account secure.
                        </p>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                            />
                        </div>
                        <button className="bg-tutor hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl transition">
                            Update Password
                        </button>
                    </div>
                )}

                {/* ─── NOTIFICATIONS ─── */}
                {tab === "notifications" && (
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500 mb-5">
                            Choose which notifications you&apos;d like to receive.
                        </p>
                        {NOTIFICATION_SETTINGS.map((n) => (
                            <div
                                key={n.key}
                                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {n.label}
                                    </p>
                                    <p className="text-xs text-gray-400">{n.desc}</p>
                                </div>
                                <button
                                    onClick={() =>
                                        setNotifications((prev) => ({
                                            ...prev,
                                            [n.key]: !prev[n.key],
                                        }))
                                    }
                                    className={`relative w-11 h-6 rounded-full transition-colors ${notifications[n.key]
                                        ? "bg-tutor"
                                        : "bg-gray-200"
                                        }`}
                                >
                                    <span
                                        className={`block w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${notifications[n.key]
                                            ? "translate-x-5.5"
                                            : "translate-x-0.5"
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
