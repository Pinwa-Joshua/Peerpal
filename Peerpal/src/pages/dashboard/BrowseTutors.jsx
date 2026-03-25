import { useDeferredValue, useState } from "react";
import { useFeedback } from "../../context/FeedbackContext";
import { StarsDisplay } from "../../components/feedback/FeedbackWidgets";

const SUBJECT_OPTIONS = [
  "All",
  "Math",
  "Physics",
  "Programming",
  "Chemistry",
  "Economics",
  "Business",
  "Mathematics",
  "Further Mathematics",
  "English Language",
  "Literature in English",
  "Biology",
  "Agricultural Science",
  "Commerce",
  "Accounting",
  "Government",
  "Civic Education",
  "Geography",
  "History",
  "Social Studies",
  "Christian Religious Studies (CRS)",
  "Islamic Religious Studies (IRS)",
];

const MODE_OPTIONS = ["Online", "Physical", "Both"];
const RATING_OPTIONS = ["Any rating", "4.0+", "4.5+"];
const SORT_OPTIONS = ["Best Match", "Highest Rated", "Most Popular", "Lowest Price", "Newest"];

function getMinRating(option) {
  if (option === "4.0+") return 4;
  if (option === "4.5+") return 4.5;
  return 0;
}

export default function BrowseTutors() {
  const feedback = useFeedback();
  const courseCatalog = feedback?.courseCatalog || [];
  const tutorProfiles = feedback?.tutorProfiles || [];
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All");
  const [meetingMode, setMeetingMode] = useState("Both");
  const [ratingFilter, setRatingFilter] = useState("Any rating");
  const [sort, setSort] = useState("Best Match");

  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const suggestions =
    deferredQuery.length < 2
      ? []
      : Array.from(
          new Set(
            [
              ...courseCatalog.flatMap((course) => [
                course.title,
                course.subject,
                course.category,
                ...(course.tags || []),
                tutorProfiles.find((tutor) => tutor.id === course.tutorId)?.name || "",
              ]),
            ]
              .filter(Boolean)
              .filter((item) => item.toLowerCase().includes(deferredQuery))
          )
        ).slice(0, 7);

  let results = courseCatalog
    .map((course) => {
      const tutor = tutorProfiles.find((entry) => entry.id === course.tutorId);
      if (!tutor) return null;

      const tags = course.tags || [];
      const availability = course.availability || [];
      const searchable = `${course.title} ${course.subject} ${course.category} ${course.description} ${tags.join(" ")} ${tutor.name} ${tutor.bio}`.toLowerCase();

      let relevance = 25 + tutor.rating * 8 + tutor.reviews * 0.8 + course.popularity * 0.35;

      if (deferredQuery) {
        if (course.title.toLowerCase().includes(deferredQuery)) relevance += 90;
        if (`${course.subject} ${course.category}`.toLowerCase().includes(deferredQuery)) relevance += 55;
        if (tutor.name.toLowerCase().includes(deferredQuery)) relevance += 45;
        if (tags.some((tag) => tag.toLowerCase().includes(deferredQuery))) relevance += 28;
        if (course.description.toLowerCase().includes(deferredQuery)) relevance += 16;
        if (tutor.bio.toLowerCase().includes(deferredQuery)) relevance += 12;
      }

      return {
        ...course,
        tags,
        availability,
        tutor,
        relevance,
        searchable,
      };
    })
    .filter(Boolean)
    .filter((course) => {
      const matchesQuery = !deferredQuery || course.searchable.includes(deferredQuery);
      const matchesSubject = subject === "All" || course.subject === subject || course.category === subject;
      const modeLabel = course.tutor.format === "in-person" ? "Physical" : course.tutor.format === "both" ? "Both" : "Online";
      const matchesMeetingMode = modeLabel === meetingMode;

      const matchesRating = course.tutor.rating >= getMinRating(ratingFilter);

      return (
        matchesQuery &&
        matchesSubject &&
        matchesMeetingMode &&
        matchesRating
      );
    });

  if (sort === "Best Match") results = results.slice().sort((a, b) => b.relevance - a.relevance);
  if (sort === "Highest Rated") results = results.slice().sort((a, b) => b.tutor.rating - a.tutor.rating);
  if (sort === "Most Popular") results = results.slice().sort((a, b) => b.popularity - a.popularity);
  if (sort === "Lowest Price") results = results.slice().sort((a, b) => a.price - b.price);
  if (sort === "Newest") results = results.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const topResult = results[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(135deg,#f8fbff_0%,#ffffff_46%,#f7fbff_100%)] px-6 py-8 sm:px-8">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Smart Course Search
            </p>
            <h1 className="mt-3 text-3xl font-display font-extrabold text-slate-900 sm:text-4xl">
              Discover courses and tutors that match exactly what you need next.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Search by course title, subject, or tutor name. Results are ranked using keyword match,
              tutor quality, review count, popularity, and experience level.
            </p>

            <div className="relative mt-6">
              <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search courses, subjects, tags, or tutor names"
                className="w-full rounded-[1.75rem] border border-slate-200 bg-white/90 py-4 pl-14 pr-5 text-base text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {suggestions.length > 0 && (
                <div className="absolute inset-x-0 top-[calc(100%+0.75rem)] z-20 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left text-sm text-slate-700 transition last:border-b-0 hover:bg-slate-50"
                    >
                      <span>{suggestion}</span>
                      <span className="material-icons-round text-base text-slate-300">north_west</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Math", "Programming", "Physics", "David Mensah", "Hypothesis testing"].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setQuery(chip)}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-blue-100"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900">Dynamic Filters</h2>
            <p className="mt-1 text-sm text-slate-500">Narrow results by subject, meeting mode, and minimum tutor rating.</p>
          </div>

          <FilterSelect label="Subject / Category" value={subject} onChange={setSubject} options={SUBJECT_OPTIONS} />
          <FilterSelect label="Mode Of Meeting" value={meetingMode} onChange={setMeetingMode} options={MODE_OPTIONS} />

          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Quality Filters</p>
            <div className="mt-4 space-y-4">
              <FilterSelect label="Minimum Tutor Rating" value={ratingFilter} onChange={setRatingFilter} options={RATING_OPTIONS} />
            </div>
          </div>
        </aside>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-soft lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {results.length} course{results.length === 1 ? "" : "s"} found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Ranked for relevance, tutor quality, and learning fit.
              </p>
            </div>
            <div className="w-full lg:w-64">
              <FilterSelect label="Sort By" value={sort} onChange={setSort} options={SORT_OPTIONS} />
            </div>
          </div>

          {topResult && (
            <div className="rounded-[2rem] border border-emerald-100 bg-[linear-gradient(135deg,#f0fdf4_0%,#ffffff_45%,#ecfeff_100%)] p-5 shadow-soft">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Top Match</p>
                  <h2 className="mt-2 text-2xl font-display font-bold text-slate-900">{topResult.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {topResult.subject} • {topResult.category} • with {topResult.tutor.name}
                  </p>
                </div>
                <div className="rounded-3xl bg-white/80 px-5 py-4 text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Relevance Score</p>
                  <p className="mt-1 text-3xl font-black text-slate-900">{Math.round(topResult.relevance)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {results.map((course) => (
              <article
                key={course.id}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-col gap-5 xl:flex-row">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-primary">
                        {course.subject}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {course.skillLevel}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {course.price === 0 ? "Free" : `N${course.price}`}
                      </span>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {course.popularity}% popular
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-display font-bold text-slate-900">{course.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{course.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Tutor</p>
                        <div className="mt-3 flex items-center gap-3">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${course.tutor.gradient} text-sm font-bold text-white shadow-md`}
                          >
                            {course.tutor.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{course.tutor.name}</p>
                            <p className="text-sm text-slate-500">{course.tutorExperienceLevel} experience</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div>
                            <StarsDisplay value={course.tutor.rating} size="text-sm" />
                            <p className="mt-1 text-xs text-slate-400">{course.tutor.reviews} reviews</p>
                          </div>
                          <p className="text-sm font-semibold text-slate-700">
                            {course.tutor.visibilityScore} visibility
                          </p>
                        </div>
                      </div>

                      <div className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Availability</p>
                        <div className="mt-3 space-y-2">
                          {course.availability.map((slot) => (
                            <div
                              key={slot.label}
                              className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2 text-sm text-slate-600"
                            >
                              <span>{slot.label}</span>
                              <span className="font-semibold text-slate-900">{slot.slot}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col justify-between rounded-[1.75rem] bg-[linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)] p-5 xl:w-[260px]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Why it ranks</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        <li>Strong keyword match across title, tags, and tutor profile</li>
                        <li>{course.tutor.rating}/5 tutor rating with {course.tutor.reviews} reviews</li>
                        <li>{course.popularity}% popularity signal from demand</li>
                        <li>{course.tutorExperienceLevel} tutor experience level</li>
                      </ul>
                    </div>

                    <div className="mt-5 space-y-3">
                      <button className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">
                        View Course
                      </button>
                      <button className="w-full rounded-2xl border-2 border-primary px-5 py-3 text-sm font-semibold text-primary transition hover:bg-blue-50">
                        View Tutor
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!results.length && (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-soft">
              <span className="material-icons-round mb-3 block text-5xl text-slate-300">manage_search</span>
              <p className="text-lg font-semibold text-slate-700">No matching courses found</p>
              <p className="mt-2 text-sm text-slate-500">
                Try broadening your keywords or relaxing one of the quality filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
