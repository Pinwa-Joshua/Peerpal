import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { TutorAPI } from "../../services/api";

const PROFILE_STORAGE_PREFIX = "peerpal_profile_";
const TABS = [
    { key: "profile", label: "Profile", icon: "person" },
    { key: "subjects", label: "Subjects & Rates", icon: "menu_book" },
    { key: "security", label: "Security", icon: "lock" },
    { key: "notifications", label: "Notifications", icon: "notifications" },
];

const UNIVERSITIES = [
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
    "University of Lagos",
    "University of Ibadan",
    "Obafemi Awolowo University",
    "Ahmadu Bello University",
    "University of Nigeria, Nsukka",
];

const DEFAULT_PROFILE = {
    displayName: "",
    email: "",
    bio: "",
    university: "",
    teachingApproach: "",
    profilePhoto: "",
};

const DEFAULT_SUBJECTS = [
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
    { key: "marketing", label: "Platform Updates", desc: "Tips, feature announcements and newsletters", default: false },
];

const NAIRA_SYMBOL = "\u20A6";
const PASSWORD_PLACEHOLDER = "********";

const createSubjectItem = (subject, index) => {
    if (typeof subject === "string") {
        return { id: `${subject}-${index}`, name: subject, rate: 100 };
    }

    return {
        id: subject?.id ?? `${subject?.name || "subject"}-${index}`,
        name: subject?.name || "",
        rate: Number(subject?.rate ?? subject?.hourly_rate ?? 100),
    };
};

const mapUserToProfile = (user) => ({
    displayName: user?.full_name || user?.displayName || user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    university: user?.university || "",
    teachingApproach: user?.teaching_approach || user?.teachingApproach || "",
    profilePhoto: user?.profile_photo || user?.profilePhoto || user?.photo || "",
});

const mapUserToSubjects = (user) => {
    if (Array.isArray(user?.subjects) && user.subjects.length > 0) {
        return user.subjects.map(createSubjectItem);
    }

    return DEFAULT_SUBJECTS;
};

export default function TutorSettings() {
    const { user, refreshUser } = useAuth();
    const fileRef = useRef(null);

    const [tab, setTab] = useState("profile");
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
    const [newSubject, setNewSubject] = useState("");
    const [newRate, setNewRate] = useState(100);
    const [notifications, setNotifications] = useState(
        Object.fromEntries(NOTIFICATION_SETTINGS.map((n) => [n.key, n.default]))
    );
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!user) return;

        setProfile(mapUserToProfile(user));
        setSubjects(mapUserToSubjects(user));
    }, [user]);

    const handlePhotoUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setProfile((prev) => ({
                ...prev,
                profilePhoto: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    const save = async () => {
        if (!user?.id) return;

        setIsSaving(true);
        setError("");
        setSaved(false);

        const cleanedSubjects = subjects
            .map((subject) => ({
                name: subject.name.trim(),
                rate: Number(subject.rate) || 0,
            }))
            .filter((subject) => subject.name);

        const payload = {
            full_name: profile.displayName.trim(),
            bio: profile.bio.trim(),
            university: profile.university.trim(),
            teaching_approach: profile.teachingApproach.trim(),
            profile_photo: profile.profilePhoto || null,
            subjects: cleanedSubjects.map((subject) => subject.name),
            subject_rates: cleanedSubjects,
            hourly_rate: cleanedSubjects[0]?.rate || 0,
        };

        try {
            await TutorAPI.updateTutorProfile(payload);
            localStorage.setItem(
                `${PROFILE_STORAGE_PREFIX}${user.id}`,
                JSON.stringify({
                    university: profile.university,
                    bio: profile.bio,
                    teachingApproach: profile.teachingApproach,
                    profilePhoto: profile.profilePhoto,
                    subjects: subjects,
                })
            );
            await refreshUser();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (saveError) {
            console.error("Failed to update profile", saveError);
            setError(saveError.message || "Error updating tutor profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const addSubject = () => {
        const trimmedSubject = newSubject.trim();
        if (!trimmedSubject) return;

        setSubjects((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: trimmedSubject,
                rate: Number(newRate) || 100,
            },
        ]);
        setNewSubject("");
        setNewRate(100);
    };

    const profileInitial =
        profile.displayName.trim().charAt(0).toUpperCase() ||
        user?.full_name?.charAt(0).toUpperCase() ||
        "T";

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900">
                        Settings
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your tutor profile, subjects and preferences.
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
                    Changes saved successfully.
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 rounded-xl p-3 text-sm font-medium">
                    <span className="material-icons-round text-lg">error</span>
                    {error}
                </div>
            )}

            <div className="flex gap-1 overflow-x-auto scrollbar-hide bg-gray-100 rounded-2xl p-1">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                            tab === t.key
                                ? "bg-white text-tutor shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <span className="material-icons-round text-lg">{t.icon}</span>
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6">
                {tab === "profile" && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-5">
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-tutor to-tutor-light flex items-center justify-center text-white text-3xl font-bold flex-shrink-0"
                            >
                                {profile.profilePhoto ? (
                                    <img
                                        src={profile.profilePhoto}
                                        alt="Tutor profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    profileInitial
                                )}
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoUpload}
                            />
                            <div>
                                <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    className="bg-tutor hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
                                >
                                    Upload Photo
                                </button>
                                <p className="text-xs text-gray-400 mt-1">
                                    JPG or PNG. Max 2 MB.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={profile.displayName}
                                    onChange={(e) =>
                                        setProfile((prev) => ({
                                            ...prev,
                                            displayName: e.target.value,
                                        }))
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
                            <input
                                type="text"
                                list="tutor-universities"
                                value={profile.university}
                                onChange={(e) =>
                                    setProfile((prev) => ({
                                        ...prev,
                                        university: e.target.value,
                                    }))
                                }
                                placeholder="Type or choose your university"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                            />
                            <datalist id="tutor-universities">
                                {UNIVERSITIES.map((university) => (
                                    <option key={university} value={university}>
                                        {university}
                                    </option>
                                ))}
                            </datalist>
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
                                    setProfile((prev) => ({
                                        ...prev,
                                        bio: e.target.value,
                                    }))
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
                                    setProfile((prev) => ({
                                        ...prev,
                                        teachingApproach: e.target.value,
                                    }))
                                }
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition resize-none"
                            />
                            <p className="text-xs text-gray-400 text-right">
                                {profile.teachingApproach.length}/300
                            </p>
                        </div>
                    </div>
                )}

                {tab === "subjects" && (
                    <div className="space-y-6">
                        <p className="text-sm text-gray-500">
                            Manage the subjects you teach and set individual rates.
                        </p>

                        <div className="space-y-3">
                            {subjects.map((subject) => (
                                <div
                                    key={subject.id}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                                        <span className="material-icons-round text-tutor text-lg">
                                            menu_book
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <input
                                            type="text"
                                            value={subject.name}
                                            onChange={(e) =>
                                                setSubjects((prev) =>
                                                    prev.map((item) =>
                                                        item.id === subject.id
                                                            ? { ...item, name: e.target.value }
                                                            : item
                                                    )
                                                )
                                            }
                                            className="w-full text-sm font-semibold text-gray-900 bg-transparent outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm text-gray-400 font-medium">{NAIRA_SYMBOL}</span>
                                        <input
                                            type="number"
                                            min={50}
                                            step={50}
                                            value={subject.rate}
                                            onChange={(e) =>
                                                setSubjects((prev) =>
                                                    prev.map((item) =>
                                                        item.id === subject.id
                                                            ? { ...item, rate: Number(e.target.value) }
                                                            : item
                                                    )
                                                )
                                            }
                                            className="w-24 border-2 border-gray-200 rounded-lg px-2 py-1.5 text-sm font-semibold text-center focus:border-tutor outline-none transition"
                                        />
                                        <span className="text-xs text-gray-400">/hr</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSubjects((prev) =>
                                                prev.filter((item) => item.id !== subject.id)
                                            )
                                        }
                                        className="text-gray-300 hover:text-red-500 transition"
                                    >
                                        <span className="material-icons-round text-lg">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>

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
                                    <span className="text-sm text-gray-400 font-medium">{NAIRA_SYMBOL}</span>
                                    <input
                                        type="number"
                                        min={50}
                                        step={50}
                                        value={newRate}
                                        onChange={(e) => setNewRate(Number(e.target.value))}
                                        className="w-24 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-center focus:border-tutor outline-none transition"
                                    />
                                    <span className="text-xs text-gray-400">/hr</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={addSubject}
                                    className="bg-tutor hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl transition whitespace-nowrap"
                                >
                                    + Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {tab === "security" && (
                    <div className="space-y-6 max-w-md">
                        <p className="text-sm text-gray-500">
                            Password updates are not connected yet, but your profile details now save correctly from this page.
                        </p>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                placeholder={PASSWORD_PLACEHOLDER}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder={PASSWORD_PLACEHOLDER}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                placeholder={PASSWORD_PLACEHOLDER}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-tutor focus:ring-2 focus:ring-tutor/20 outline-none transition"
                            />
                        </div>
                        <button
                            type="button"
                            className="bg-tutor hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl transition"
                        >
                            Update Password
                        </button>
                    </div>
                )}

                {tab === "notifications" && (
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500 mb-5">
                            Choose which notifications you would like to receive.
                        </p>
                        {NOTIFICATION_SETTINGS.map((notification) => (
                            <div
                                key={notification.key}
                                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {notification.label}
                                    </p>
                                    <p className="text-xs text-gray-400">{notification.desc}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setNotifications((prev) => ({
                                            ...prev,
                                            [notification.key]: !prev[notification.key],
                                        }))
                                    }
                                    className={`relative w-11 h-6 rounded-full transition-colors ${
                                        notifications[notification.key] ? "bg-tutor" : "bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`block w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                                            notifications[notification.key]
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
