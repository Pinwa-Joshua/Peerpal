import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const QUESTIONS = [
    {
        id: "study_rhythm",
        prompt: "When you start learning something new, what usually helps you settle in fastest?",
        helper: "This helps us understand the pace and structure that feels natural to you.",
        options: [
            { value: "guided_examples", label: "Seeing worked examples before trying it myself" },
            { value: "big_picture", label: "Getting the big picture first, then diving deeper" },
            { value: "hands_on", label: "Trying it out immediately and learning as I go" },
            { value: "discussion", label: "Talking it through with someone before I begin" },
        ],
    },
    {
        id: "challenge_response",
        prompt: "If a topic starts feeling difficult, what do you naturally do next?",
        helper: "Your answer guides how we support you when lessons become demanding.",
        options: [
            { value: "break_it_down", label: "Break it into smaller steps and tackle one piece at a time" },
            { value: "repeat_review", label: "Review the material again until it clicks" },
            { value: "ask_for_help", label: "Ask questions early so I do not get stuck for long" },
            { value: "switch_methods", label: "Try a different explanation, example, or learning format" },
        ],
    },
    {
        id: "session_energy",
        prompt: "What kind of tutoring session usually keeps you most engaged?",
        helper: "We use this to recommend teaching styles that fit your energy.",
        options: [
            { value: "interactive", label: "Interactive sessions with lots of back-and-forth" },
            { value: "structured", label: "Structured sessions with a clear plan and checkpoints" },
            { value: "practice_heavy", label: "Practice-heavy sessions with questions to solve" },
            { value: "calm_explanatory", label: "Calm explanation-focused sessions where I can absorb first" },
        ],
    },
    {
        id: "feedback_style",
        prompt: "How do you prefer to receive feedback while learning?",
        helper: "Knowing this helps us match you with tutors who correct in the right way.",
        options: [
            { value: "instant", label: "Immediately, as soon as I make a mistake" },
            { value: "after_attempt", label: "After I finish a full attempt on my own" },
            { value: "encouraging", label: "With encouragement first, then correction" },
            { value: "direct", label: "Very direct and specific, so I know exactly what to fix" },
        ],
    },
    {
        id: "consistency_pattern",
        prompt: "Which study rhythm sounds most like you on a typical week?",
        helper: "This gives us a more realistic picture of how you build momentum.",
        options: [
            { value: "steady", label: "I prefer short, steady study blocks spread across the week" },
            { value: "deadline_push", label: "I often focus best when a deadline is close" },
            { value: "deep_dive", label: "I like long deep-dive sessions when I have uninterrupted time" },
            { value: "mixed", label: "It changes a lot depending on the subject and workload" },
        ],
    },
];

function QuizProgress({ current, total }) {
    return (
        <div className="w-full max-w-3xl mx-auto px-6">
            <div className="flex gap-2">
                {Array.from({ length: total }).map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            index < current ? "bg-primary" : "bg-gray-200"
                        }`}
                    />
                ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <span>Learning style quiz</span>
                <span>
                    Question {Math.min(current + 1, total)} of {total}
                </span>
            </div>
        </div>
    );
}

export default function StudentLearningQuiz() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const currentQuestion = QUESTIONS[currentIndex];
    const selectedValues = answers[currentQuestion.id] || [];

    const completionText = useMemo(() => {
        const answeredCount = Object.keys(answers).length;
        return `${answeredCount} structured response${answeredCount === 1 ? "" : "s"} captured`;
    }, [answers]);

    const changeQuestion = (nextIndex) => {
        setIsTransitioning(true);

        window.setTimeout(() => {
            setCurrentIndex(nextIndex);
            setIsTransitioning(false);
        }, 220);
    };

    const handleAnswer = (value) => {
        if (isTransitioning || isComplete) return;

        const currentValues = answers[currentQuestion.id] || [];
        const nextValues = currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value];

        setAnswers({
            ...answers,
            [currentQuestion.id]: nextValues,
        });
    };

    const handleBack = () => {
        if (isTransitioning || currentIndex === 0) return;
        changeQuestion(currentIndex - 1);
    };

    const handleNext = () => {
        if (isTransitioning || selectedValues.length === 0) return;

        const nextIndex = currentIndex + 1;
        if (nextIndex >= QUESTIONS.length) {
            setIsComplete(true);
            return;
        }

        changeQuestion(nextIndex);
    };

    const handleFinish = () => {
        navigate("/onboarding/student");
    };

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            <nav className="flex items-center justify-between px-6 sm:px-10 h-20 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/icon.png" alt="PeerPal" className="h-9 w-auto" />
                    <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        PeerPal
                    </span>
                </Link>
                <span className="hidden sm:block text-sm font-medium text-gray-400">
                    Student Learning Profile
                </span>
            </nav>

            <div className="flex-1 flex flex-col justify-center px-6 py-8 sm:px-10">
                <QuizProgress current={currentIndex} total={QUESTIONS.length} />

                <div className="w-full max-w-3xl mx-auto mt-8">
                    <div className="rounded-[2rem] border border-white/70 bg-white shadow-soft overflow-hidden">
                        

                        <div className="px-6 py-8 sm:px-8 sm:py-10 min-h-[24rem] flex items-center">
                            {isComplete ? (
                                <div className="w-full text-center">
                                    <div className="mx-auto w-20 h-20 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                                        <span className="material-icons-round text-4xl">insights</span>
                                    </div>
                                    <h2 className="mt-6 text-2xl font-display font-bold text-gray-900">
                                        Learning profile captured
                                    </h2>
                                    <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                                        We now have structured answers we can use to shape tutor matching, session style, and future recommendations.
                                    </p>
                                    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-primary">
                                        <span className="material-icons-round text-base">check_circle</span>
                                        {completionText}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleFinish}
                                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-blue-800"
                                    >
                                        Continue to Dashboard
                                        <span className="material-icons-round text-lg">arrow_forward</span>
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className={`w-full transition-all duration-300 ${
                                        isTransitioning
                                            ? "opacity-0 translate-y-3"
                                            : "opacity-100 translate-y-0"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                                                Question {currentIndex + 1}
                                            </p>
                                            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-bold text-gray-900 max-w-2xl">
                                                {currentQuestion.prompt}
                                            </h2>
                                            <p className="mt-3 text-gray-500 max-w-xl">
                                                {currentQuestion.helper}
                                            </p>
                                        </div>
                                        <div className="hidden sm:flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-primary">
                                            <span className="material-icons-round text-3xl">psychology</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 grid gap-3">
                                        {currentQuestion.options.map((option) => {
                                            const active = selectedValues.includes(option.value);

                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => handleAnswer(option.value)}
                                                    className={`group rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                                                        active
                                                            ? "border-primary bg-blue-50 shadow-sm"
                                                            : "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="text-base font-semibold text-gray-800">
                                                            {option.label}
                                                        </span>
                                                        <span
                                                            className={`material-icons-round text-xl transition ${
                                                                active
                                                                    ? "text-primary"
                                                                    : "text-gray-300 group-hover:text-primary/60"
                                                            }`}
                                                        >
                                                            {active ? "check_circle" : "add_circle"}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <p className="mt-5 text-sm text-gray-400">
                                        Choose as many answers as fit, then continue.
                                    </p>

                                    <div className="mt-8 flex items-center justify-between gap-4">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            disabled={currentIndex === 0 || isTransitioning}
                                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <span className="material-icons-round text-lg">arrow_back</span>
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={selectedValues.length === 0 || isTransitioning}
                                            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:hover:translate-y-0"
                                        >
                                            {currentIndex === QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question"}
                                            <span className="material-icons-round text-lg">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
