import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ───────────────────────────── constants ───────────────────────────── */

const STEPS = [
  { label: "Profile", icon: "person" },
  { label: "University", icon: "school" },
  { label: "Subjects", icon: "auto_stories" },
  { label: "Qualifications", icon: "workspace_premium" },
  { label: "Rates", icon: "payments" },
  { label: "Done", icon: "celebration" },
];

const UNIVERSITIES = [
  "University of Cape Town",
  "University of the Witwatersrand",
  "Stellenbosch University",
  "University of Pretoria",
  "University of KwaZulu-Natal",
  "University of Johannesburg",
  "Rhodes University",
  "Nelson Mandela University",
  "University of the Free State",
  "North-West University",
  "Tshwane University of Technology",
  "Cape Peninsula University of Technology",
  "Durban University of Technology",
  "University of the Western Cape",
  "Vaal University of Technology",
];

const SAMPLE_COURSES = [
  "Calculus I", "Calculus II", "Linear Algebra", "Statistics 101",
  "Physics I", "Physics II", "Chemistry 101", "Organic Chemistry",
  "Biology 101", "Anatomy & Physiology",
  "Introduction to Programming", "Data Structures & Algorithms",
  "Computer Networks", "Database Systems", "Web Development",
  "Financial Accounting", "Management Accounting", "Economics 101",
  "Microeconomics", "Macroeconomics",
  "Academic English", "Business Law", "Psychology 101",
  "Sociology 101", "Political Science", "Philosophy 101",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_SLOTS = ["Morning (8–12)", "Afternoon (12–5)", "Evening (5–8)"];

/* ──────────────────────── progress bar + stepper ───────────────────── */

function ProgressStepper({ current, total }) {
  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      <div className="flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < current ? "bg-tutor" : "bg-gray-200"
              }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 font-medium mt-2 text-right">
        Step {current} of {total}
      </p>
    </div>
  );
}

/* ──────────────────────────── step shells ──────────────────────────── */

function StepShell({ icon, heading, subheading, children }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center mb-8 shadow-soft border border-teal-100">
        <span className="material-icons-round text-5xl text-tutor">
          {icon}
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-900 text-center mb-2">
        {heading}
      </h1>
      <p className="text-gray-500 text-center max-w-md mb-10">
        {subheading}
      </p>

      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

/* ─────────────────────────── step 1: profile ──────────────────────── */

function StepProfile({ data, onChange }) {
  const fileRef = useRef(null);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ ...data, photo: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <StepShell
      icon="person"
      heading="Let's set up your tutor profile"
      subheading="Add a photo and introduce yourself to students."
    >
      <div className="space-y-6">
        {/* Photo upload */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 hover:border-tutor transition overflow-hidden group"
          >
            {data.photo ? (
              <img
                src={data.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-icons-round text-4xl text-gray-400 group-hover:text-tutor transition">
                add_a_photo
              </span>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full">
              <span className="material-icons-round text-white text-xl">
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
          <span className="text-xs text-gray-400">
            Click to upload a photo
          </span>
        </div>

        {/* Display name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Display name
          </label>
          <input
            type="text"
            value={data.displayName}
            onChange={(e) =>
              onChange({ ...data, displayName: e.target.value })
            }
            placeholder="e.g. Thabo M."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Short bio
          </label>
          <textarea
            rows={3}
            maxLength={200}
            value={data.bio}
            onChange={(e) =>
              onChange({ ...data, bio: e.target.value })
            }
            placeholder="Tell students about your experience and teaching style…"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition resize-none"
          />
          <p className="text-xs text-gray-400 text-right mt-1">
            {data.bio.length}/200
          </p>
        </div>
      </div>
    </StepShell>
  );
}

/* ────────────────────────── step 2: university ────────────────────── */

function StepUniversity({ data, onChange }) {
  const [query, setQuery] = useState("");
  const filtered = UNIVERSITIES.filter((u) =>
    u.toLowerCase().includes(query.toLowerCase())
  );
  const showDropdown = query.length > 0 && !UNIVERSITIES.includes(data.university);

  return (
    <StepShell
      icon="school"
      heading="Where do you study?"
      subheading="Students at your institution will find you more easily."
    >
      <div className="space-y-5">
        {/* University */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            University
          </label>
          <div className="relative">
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              account_balance
            </span>
            <input
              type="text"
              value={data.university}
              onChange={(e) => {
                onChange({ ...data, university: e.target.value });
                setQuery(e.target.value);
              }}
              placeholder="Search your university…"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition"
            />
          </div>
          {showDropdown && filtered.length > 0 && (
            <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto scrollbar-hide">
              {filtered.map((uni) => (
                <li key={uni}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({ ...data, university: uni });
                      setQuery(uni);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-teal-50 text-sm text-gray-700 transition"
                  >
                    {uni}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Campus */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Campus
          </label>
          <input
            type="text"
            value={data.campus}
            onChange={(e) =>
              onChange({ ...data, campus: e.target.value })
            }
            placeholder="e.g. Main Campus, Howard College"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition"
          />
        </div>

        {/* Year & Faculty */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Year of study
            </label>
            <select
              value={data.year}
              onChange={(e) =>
                onChange({ ...data, year: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition appearance-none"
            >
              <option value="">Select…</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
              <option>Honours</option>
              <option>Masters</option>
              <option>PhD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Faculty
            </label>
            <input
              type="text"
              value={data.faculty}
              onChange={(e) =>
                onChange({ ...data, faculty: e.target.value })
              }
              placeholder="e.g. Science"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition"
            />
          </div>
        </div>
      </div>
    </StepShell>
  );
}

/* ────────────────────── step 3: subjects you teach ────────────────── */

function StepSubjects({ data, onChange }) {
  const [search, setSearch] = useState("");
  const selected = data.subjects;

  const results = SAMPLE_COURSES.filter(
    (c) =>
      c.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(c)
  );

  const add = (course) => {
    onChange({ ...data, subjects: [...selected, course] });
    setSearch("");
  };

  const remove = (course) => {
    onChange({
      ...data,
      subjects: selected.filter((s) => s !== course),
    });
  };

  return (
    <StepShell
      icon="auto_stories"
      heading="What can you teach?"
      subheading="Select all the courses and subjects you can tutor."
    >
      <div className="space-y-5">
        {/* Search */}
        <div className="relative">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for a course…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition"
          />
          {search && results.length > 0 && (
            <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto scrollbar-hide">
              {results.slice(0, 8).map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    onClick={() => add(c)}
                    className="w-full text-left px-4 py-2.5 hover:bg-teal-50 text-sm text-gray-700 transition flex items-center gap-2"
                  >
                    <span className="material-icons-round text-sm text-gray-400">
                      add
                    </span>
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((course) => (
              <span
                key={course}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 text-tutor text-sm font-semibold border border-teal-100"
              >
                {course}
                <button
                  type="button"
                  onClick={() => remove(course)}
                  className="hover:text-red-500 transition"
                >
                  <span className="material-icons-round text-sm">
                    close
                  </span>
                </button>
              </span>
            ))}
          </div>
        )}

        {selected.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-4 border-2 border-dashed border-gray-200 rounded-xl">
            No subjects selected yet. Search above to add some.
          </p>
        )}

        {/* Teaching approach */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Your teaching approach
          </label>
          <textarea
            rows={2}
            maxLength={150}
            value={data.teachingApproach}
            onChange={(e) =>
              onChange({ ...data, teachingApproach: e.target.value })
            }
            placeholder="e.g. I use real-world examples and work through problems step-by-step…"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition resize-none"
          />
          <p className="text-xs text-gray-400 text-right mt-1">
            {data.teachingApproach.length}/150
          </p>
        </div>
      </div>
    </StepShell>
  );
}

/* ──────────────────── step 4: qualifications ──────────────────────── */

function StepQualifications({ data, onChange }) {
  return (
    <StepShell
      icon="workspace_premium"
      heading="Your qualifications"
      subheading="Help students trust your expertise."
    >
      <div className="space-y-5">
        {/* Academic level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Highest academic level
          </label>
          <select
            value={data.academicLevel}
            onChange={(e) =>
              onChange({ ...data, academicLevel: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition appearance-none"
          >
            <option value="">Select…</option>
            <option>Undergraduate (2nd year+)</option>
            <option>Honours</option>
            <option>Masters</option>
            <option>PhD</option>
          </select>
        </div>

        {/* Tutoring experience */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Years of tutoring experience
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["< 1", "1–2", "2–4", "4+"].map((opt) => {
              const active = data.experience === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    onChange({ ...data, experience: opt })
                  }
                  className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${active
                      ? "border-tutor bg-teal-50 text-tutor"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                >
                  {opt} {opt === "4+" ? "yrs" : opt === "< 1" ? "yr" : "yrs"}
                </button>
              );
            })}
          </div>
        </div>

        {/* GPA / Academic standing */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Average mark in subjects you tutor
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["70–74%", "75–79%", "80%+"].map((opt) => {
              const active = data.avgMark === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    onChange({ ...data, avgMark: opt })
                  }
                  className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${active
                      ? "border-tutor bg-teal-50 text-tutor"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Certifications / Achievements */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Certifications or achievements{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            maxLength={200}
            value={data.certifications}
            onChange={(e) =>
              onChange({ ...data, certifications: e.target.value })
            }
            placeholder="e.g. Dean's Merit List 2024, SI Leader for Calculus, Google Data Analytics Certificate…"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition resize-none"
          />
          <p className="text-xs text-gray-400 text-right mt-1">
            {data.certifications.length}/200
          </p>
        </div>
      </div>
    </StepShell>
  );
}

/* ───────────────── step 5: availability & rates ───────────────────── */

function StepRates({ data, onChange }) {
  const formats = [
    { id: "online", icon: "videocam", label: "Online" },
    { id: "in-person", icon: "location_on", label: "In-Person" },
    { id: "both", icon: "swap_horiz", label: "Both" },
  ];

  const toggleDay = (day) => {
    const days = data.days.includes(day)
      ? data.days.filter((d) => d !== day)
      : [...data.days, day];
    onChange({ ...data, days });
  };

  const toggleSlot = (slot) => {
    const slots = data.timeSlots.includes(slot)
      ? data.timeSlots.filter((s) => s !== slot)
      : [...data.timeSlots, slot];
    onChange({ ...data, timeSlots: slots });
  };

  return (
    <StepShell
      icon="payments"
      heading="Availability & rates"
      subheading="Set your schedule and pricing so students can book you."
    >
      <div className="space-y-7">
        {/* Session format */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Session format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {formats.map((f) => {
              const active = data.format === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() =>
                    onChange({ ...data, format: f.id })
                  }
                  className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all duration-200 ${active
                      ? "border-tutor bg-teal-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <span
                    className={`material-icons-round text-2xl ${active ? "text-tutor" : "text-gray-400"
                      }`}
                  >
                    {f.icon}
                  </span>
                  <span
                    className={`text-sm font-semibold ${active ? "text-tutor" : "text-gray-600"
                      }`}
                  >
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred days */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Available days
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const active = data.days.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${active
                      ? "border-tutor bg-tutor text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Available time slots
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => {
              const active = data.timeSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggleSlot(slot)}
                  className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${active
                      ? "border-tutor bg-teal-50 text-tutor"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hourly rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Hourly rate (R)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
              R
            </span>
            <input
              type="number"
              value={data.rate}
              onChange={(e) =>
                onChange({ ...data, rate: e.target.value })
              }
              placeholder="e.g. 120"
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tutor/30 focus:border-tutor transition"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Average tutor rate on PeerPal is ₦100–₦150/hr
          </p>
        </div>
      </div>
    </StepShell>
  );
}

/* ──────────────────────────── step 6: done ─────────────────────────── */

function StepDone({ data }) {
  return (
    <StepShell
      icon="celebration"
      heading="You're all set!"
      subheading="Your tutor profile is ready. Start accepting session requests."
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-6 space-y-5">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            {data.photo ? (
              <img
                src={data.photo}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-icons-round text-3xl text-gray-400">
                person
              </span>
            )}
          </div>
          <div>
            <p className="font-display font-bold text-gray-900 text-lg">
              {data.displayName || "Tutor"}
            </p>
            <p className="text-sm text-gray-500">{data.bio || "—"}</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 font-medium mb-0.5">University</p>
            <p className="text-gray-900 font-semibold">
              {data.university || "—"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 font-medium mb-0.5">Year</p>
            <p className="text-gray-900 font-semibold">
              {data.year || "—"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 font-medium mb-0.5">Experience</p>
            <p className="text-gray-900 font-semibold">
              {data.experience || "—"} of tutoring
            </p>
          </div>
          <div>
            <p className="text-gray-400 font-medium mb-0.5">Rate</p>
            <p className="text-gray-900 font-semibold">
              ₦{data.rate || "—"}/hr
            </p>
          </div>
          <div>
            <p className="text-gray-400 font-medium mb-0.5">Format</p>
            <p className="text-gray-900 font-semibold capitalize">
              {data.format || "—"}
            </p>
          </div>
          <div>
            <p className="text-gray-400 font-medium mb-0.5">Avg Mark</p>
            <p className="text-gray-900 font-semibold">
              {data.avgMark || "—"}
            </p>
          </div>
        </div>

        {/* Subjects */}
        {data.subjects.length > 0 && (
          <>
            <hr className="border-gray-100" />
            <div>
              <p className="text-gray-400 font-medium text-sm mb-2">
                Subjects ({data.subjects.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {data.subjects.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-tutor text-xs font-semibold border border-teal-100"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </StepShell>
  );
}

/* ═══════════════════════════ main component ════════════════════════ */

export default function TutorOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    /* step 1 */
    photo: "",
    displayName: "",
    bio: "",
    /* step 2 */
    university: "",
    campus: "",
    year: "",
    faculty: "",
    /* step 3 */
    subjects: [],
    teachingApproach: "",
    /* step 4 */
    academicLevel: "",
    experience: "",
    avgMark: "",
    certifications: "",
    /* step 5 */
    format: "",
    days: [],
    timeSlots: [],
    rate: "",
  });

  const canContinue = () => {
    switch (step) {
      case 1:
        return data.displayName.trim().length > 0;
      case 2:
        return (
          data.university.trim().length > 0 &&
          data.year.length > 0
        );
      case 3:
        return data.subjects.length > 0;
      case 4:
        return (
          data.academicLevel.length > 0 &&
          data.experience.length > 0
        );
      case 5:
        return (
          data.format.length > 0 &&
          data.days.length > 0 &&
          data.rate.length > 0
        );
      default:
        return true;
    }
  };

  const next = () => {
    if (step < 6) setStep(step + 1);
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  const finish = () => {
    // TODO: persist data then redirect to tutor dashboard
    navigate("/tutor/dashboard");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepProfile data={data} onChange={setData} />;
      case 2:
        return <StepUniversity data={data} onChange={setData} />;
      case 3:
        return <StepSubjects data={data} onChange={setData} />;
      case 4:
        return <StepQualifications data={data} onChange={setData} />;
      case 5:
        return <StepRates data={data} onChange={setData} />;
      case 6:
        return <StepDone data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen h-screen bg-bg-light flex flex-col overflow-hidden">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-6 sm:px-10 h-20 flex-shrink-0 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icon.png" alt="PeerPal" className="h-9 w-auto" />
          <span className="text-lg font-bold bg-gradient-to-r from-tutor to-teal-500 bg-clip-text text-transparent">
            PeerPal
          </span>
        </Link>
        <span className="text-sm text-gray-400 font-medium hidden sm:block">
          Tutor Onboarding
        </span>
      </nav>

      {/* Progress */}
      <div className="flex-shrink-0 pt-6">
        <ProgressStepper current={step} total={6} />
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {renderStep()}
      </div>

      {/* Bottom actions */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-white px-6 sm:px-10">
        <div className="max-w-md mx-auto flex items-center justify-between py-5">
          {step > 1 && step < 6 ? (
            <button
              onClick={back}
              className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 font-semibold transition"
            >
              <span className="material-icons-round text-lg">
                arrow_back
              </span>
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 6 ? (
            <button
              onClick={next}
              disabled={!canContinue()}
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold shadow-lg transition-all hover:-translate-y-0.5 ${canContinue()
                  ? "bg-tutor text-white shadow-tutor/20 hover:bg-teal-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none hover:translate-y-0"
                }`}
            >
              Continue
              <span className="material-icons-round text-lg">
                arrow_forward
              </span>
            </button>
          ) : (
            <button
              onClick={finish}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold bg-tutor text-white shadow-lg shadow-tutor/20 hover:bg-teal-700 transition-all hover:-translate-y-0.5 w-full justify-center"
            >
              Go to Dashboard
              <span className="material-icons-round text-lg">
                arrow_forward
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
