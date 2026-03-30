import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UsersAPI } from "../../services/api";

const TABS = ["Profile", "Preferences", "Security", "Notifications"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PROFILE_STORAGE_PREFIX = "peerpal_profile_";
const PASSWORD_PLACEHOLDER = "********";

const YEAR_OPTIONS = [
    "1st Year",
    "2nd Year",
    "3rd Year",
    "4th Year",
    "5th Year",
    "6th Year",
    "Postgraduate",
];

const mapUserToProfile = (user) => ({
    photo: user?.photo || "",
    displayName: user?.full_name || user?.displayName || user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    university: user?.university || "",
    campus: user?.campus || "",
    year: user?.year || YEAR_OPTIONS[0],
    faculty: user?.faculty || "",
});

const mapUserToPrefs = (user) => ({
    format: user?.preferred_format || "both",
    days: Array.isArray(user?.preferred_days) && user.preferred_days.length > 0 ? user.preferred_days : ["Mon", "Wed", "Fri"],
    budgetMin: user?.budget_min || "50",
    budgetMax: user?.budget_max || "200",
});

export default function Settings() {
    const { user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState("Profile");
    const fileRef = useRef(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const [profile, setProfile] = useState({
        photo: "",
        displayName: "",
        email: "",
        bio: "",
        university: "",
        campus: "",
        year: YEAR_OPTIONS[0],
        faculty: "",
    });

    useEffect(() => {
        if (!user) return;
        setProfile(mapUserToProfile(user));
        setPrefs(mapUserToPrefs(user));
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user?.id) return;

        setIsSaving(true);
        setSaved(false);
        setError("");

        try {
            await UsersAPI.updateProfile({
                full_name: profile.displayName.trim(),
                photo: profile.photo,
                bio: profile.bio.trim(),
                university: profile.university.trim(),
                campus: profile.campus.trim(),
                year: profile.year,
                faculty: profile.faculty.trim(),
            });

            await refreshUser();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (saveError) {
            console.error("Failed to update profile", saveError);
            setError(saveError.message || "Error updating profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const [prefs, setPrefs] = useState({
        format: "both",
        days: ["Mon", "Wed", "Fri"],
        budgetMin: "50",
        budgetMax: "200",
    });

    const [passwords, setPasswords] = useState({
        current: "",
        newPw: "",
        confirm: "",
    });
    const [showPasswords, setShowPasswords] = useState(false);

    const [notifs, setNotifs] = useState({
        sessionReminders: true,
        newMessages: true,
        tutorMatches: true,
        promotions: false,
        emailDigest: true,
        pushNotifs: true,
    });

    const handlePhoto = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setProfile((p) => ({ ...p, photo: reader.result }));
        reader.readAsDataURL(file);
    };

    const toggleDay = (day) => {
        setPrefs((p) => ({
            ...p,
            days: p.days.includes(day)
                ? p.days.filter((d) => d !== day)
                : [...p.days, day],
        }));
    };

    const handleSavePreferences = async () => {
        if (!user?.id) return;

        setIsSaving(true);
        setSaved(false);
        setError("");

        try {
            await UsersAPI.updateProfile({
                preferred_format: prefs.format,
                preferred_days: prefs.days,
                budget_min: prefs.budgetMin,
                budget_max: prefs.budgetMax,
            });
            await refreshUser();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (saveError) {
            console.error("Failed to update preferences", saveError);
            setError(saveError.message || "Error updating preferences.");
        } finally {
            setIsSaving(false);
        }
    };

    const formats = [
        { id: "online", icon: "videocam", label: "Online" },
        { id: "in-person", icon: "location_on", label: "In-Person" },
        { id: "both", icon: "swap_horiz", label: "Both" },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                    Settings
                </h1>
                <p className="text-gray-500 mt-1">
                    Manage your account preferences and profile.
                </p>
            </div>

            {saved && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 rounded-xl p-3 text-sm font-medium">
                    <span className="material-icons-round text-lg">check_circle</span>
                    Profile updated successfully.
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-xl p-3 text-sm font-medium">
                    <span className="material-icons-round text-lg">error</span>
                    {error}
                </div>
            )}

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap border-2 transition-all ${
                            activeTab === tab
                                ? "border-primary bg-primary text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "Profile" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-5">
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="relative w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 hover:border-primary transition overflow-hidden group flex-shrink-0"
                        >
                            {profile.photo ? (
                                <img
                                    src={profile.photo}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="material-icons-round text-3xl text-gray-400 group-hover:text-primary transition">
                                    add_a_photo
                                </span>
                            )}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <span className="material-icons-round text-white text-lg">
                                    edit
                                </span>
                            </div>
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhoto}
                        />
                        <div>
                            <p className="font-semibold text-gray-900">
                                Profile Photo
                            </p>
                            <p className="text-xs text-gray-400">
                                JPG, PNG or GIF. Max 5MB.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Display Name
                            </label>
                            <input
                                value={profile.displayName}
                                onChange={(e) =>
                                    setProfile((p) => ({
                                        ...p,
                                        displayName: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                University
                            </label>
                            <input
                                value={profile.university}
                                onChange={(e) =>
                                    setProfile((p) => ({
                                        ...p,
                                        university: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Campus
                            </label>
                            <input
                                value={profile.campus}
                                onChange={(e) =>
                                    setProfile((p) => ({
                                        ...p,
                                        campus: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Year of Study
                            </label>
                            <select
                                value={profile.year}
                                onChange={(e) =>
                                    setProfile((p) => ({
                                        ...p,
                                        year: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition appearance-none"
                            >
                                {YEAR_OPTIONS.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Faculty
                            </label>
                            <input
                                value={profile.faculty}
                                onChange={(e) =>
                                    setProfile((p) => ({
                                        ...p,
                                        faculty: e.target.value,
                                    }))
                                }
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Bio
                        </label>
                        <textarea
                            rows={3}
                            maxLength={150}
                            value={profile.bio}
                            onChange={(e) =>
                                setProfile((p) => ({
                                    ...p,
                                    bio: e.target.value,
                                }))
                            }
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                        />
                        <p className="text-xs text-gray-400 text-right mt-1">
                            {profile.bio.length}/150
                        </p>
                    </div>

                    <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-primary hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>

                    {user?.role !== "tutor" && (
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                            <p className="text-sm font-semibold text-emerald-800">
                                Ready to tutor other students too?
                            </p>
                            <p className="mt-1 text-sm text-emerald-700">
                                Start tutor onboarding from your student account and unlock tutor access when you finish.
                            </p>
                            <Link
                                to="/onboarding/tutor/quiz"
                                className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                <span className="material-icons-round text-lg">school</span>
                                Become a Tutor
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "Preferences" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 sm:p-8 space-y-7">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Session Format
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {formats.map((f) => {
                                const active = prefs.format === f.id;
                                return (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() =>
                                            setPrefs((p) => ({
                                                ...p,
                                                format: f.id,
                                            }))
                                        }
                                        className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${
                                            active
                                                ? "border-primary bg-blue-50"
                                                : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                    >
                                        <span
                                            className={`material-icons-round text-2xl ${
                                                active ? "text-primary" : "text-gray-400"
                                            }`}
                                        >
                                            {f.icon}
                                        </span>
                                        <span
                                            className={`text-sm font-semibold ${
                                                active ? "text-primary" : "text-gray-600"
                                            }`}
                                        >
                                            {f.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Preferred Days
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {DAYS.map((day) => {
                                const active = prefs.days.includes(day);
                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                                            active
                                                ? "border-primary bg-primary text-white"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                        }`}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Budget per Hour (R)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                                    R
                                </span>
                                <input
                                    type="number"
                                    value={prefs.budgetMin}
                                    onChange={(e) =>
                                        setPrefs((p) => ({
                                            ...p,
                                            budgetMin: e.target.value,
                                        }))
                                    }
                                    placeholder="Min"
                                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                                    R
                                </span>
                                <input
                                    type="number"
                                    value={prefs.budgetMax}
                                    onChange={(e) =>
                                        setPrefs((p) => ({
                                            ...p,
                                            budgetMax: e.target.value,
                                        }))
                                    }
                                    placeholder="Max"
                                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSavePreferences}
                        disabled={isSaving}
                        className="bg-primary hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save Preferences"}
                    </button>
                </div>
            )}

            {activeTab === "Security" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 sm:p-8 space-y-5">
                    <h3 className="font-display font-bold text-gray-900">
                        Change Password
                    </h3>
                    {["Current Password", "New Password", "Confirm New Password"].map((label, i) => {
                        const key = ["current", "newPw", "confirm"][i];
                        return (
                            <div key={label}>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    {label}
                                </label>
                                <div className="relative">
                                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                                        lock
                                    </span>
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        value={passwords[key]}
                                        onChange={(e) =>
                                            setPasswords((p) => ({
                                                ...p,
                                                [key]: e.target.value,
                                            }))
                                        }
                                        placeholder={PASSWORD_PLACEHOLDER}
                                        className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                                    />
                                    {i === 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(!showPasswords)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                        >
                                            <span className="material-icons-round text-xl">
                                                {showPasswords ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <button className="bg-primary hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                        Update Password
                    </button>
                </div>
            )}

            {activeTab === "Notifications" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 sm:p-8 space-y-1">
                    {[
                        { key: "sessionReminders", label: "Session Reminders", desc: "Get notified before your sessions start" },
                        { key: "newMessages", label: "New Messages", desc: "Notifications for new chat messages" },
                        { key: "tutorMatches", label: "Tutor Recommendations", desc: "Get notified about new tutor matches" },
                        { key: "promotions", label: "Promotions & Tips", desc: "Occasional deals and study tips" },
                        { key: "emailDigest", label: "Weekly Email Digest", desc: "Summary of your weekly activity" },
                        { key: "pushNotifs", label: "Push Notifications", desc: "Browser and mobile push alerts" },
                    ].map((item) => (
                        <div
                            key={item.key}
                            className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0"
                        >
                            <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                    {item.label}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {item.desc}
                                </p>
                            </div>
                            <button
                                onClick={() =>
                                    setNotifs((n) => ({
                                        ...n,
                                        [item.key]: !n[item.key],
                                    }))
                                }
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                                    notifs[item.key] ? "bg-primary" : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                                        notifs[item.key] ? "translate-x-[22px]" : "translate-x-0.5"
                                    }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
