import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const QUESTIONS = [
    {
        id: "teaching_style",
        prompt: "When you teach a new topic, where do you naturally begin?",
        helper: "This helps us understand how you structure first contact with a student.",
        options: [
            { value: "concept_first", label: "I explain the core concept before anything else" },
            { value: "example_first", label: "I start with an example, then unpack the theory" },
            { value: "diagnostic_first", label: "I first check what the student already knows" },
            { value: "problem_first", label: "I put a problem in front of them and teach through it" },
        ],
    },
    {
        id: "student_confusion",
        prompt: "If a student still looks confused after an explanation, what do you usually do next?",
        helper: "We want to capture how adaptable your tutoring style is in the moment.",
        options: [
            { value: "rephrase", label: "Rephrase the idea in simpler language" },
            { value: "new_example", label: "Use a different example or analogy" },
            { value: "step_back", label: "Step back and fill in missing foundational knowledge" },
            { value: "student_attempt", label: "Ask the student to attempt it so I can spot the gap" },
        ],
    },
    {
        id: "session_flow",
        prompt: "What kind of lesson flow feels most natural to you?",
        helper: "This tells us how you tend to create momentum in a session.",
        options: [
            { value: "high_structure", label: "A very structured plan with milestones and recap points" },
            { value: "flexible_guided", label: "A flexible session shaped by the student's questions" },
            { value: "practice_loop", label: "Short explanations followed by repeated practice" },
            { value: "discussion_based", label: "Conversation-led teaching where understanding builds through dialogue" },
        ],
    },
    {
        id: "feedback_mode",
        prompt: "How do you most often give feedback during tutoring?",
        helper: "This helps us pair you with students who respond well to your correction style.",
        options: [
            { value: "live_corrections", label: "I correct in real time while they are working" },
            { value: "after_attempt", label: "I let them finish first, then review the attempt together" },
            { value: "guided_questions", label: "I use guiding questions so they can self-correct" },
            { value: "encouraging_direct", label: "I mix clear correction with reassurance and motivation" },
        ],
    },
    {
        id: "teaching_energy",
        prompt: "What best describes the kind of tutor you are at your best?",
        helper: "We use this signal to describe your style more accurately inside the product later.",
        options: [
            { value: "calm_patient", label: "Calm, patient, and steady" },
            { value: "high_energy", label: "High-energy and momentum-driven" },
            { value: "analytical", label: "Analytical and very precise" },
            { value: "supportive_coach", label: "Supportive like a coach, pushing confidence as well as skill" },
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
                            index < current ? "bg-tutor" : "bg-gray-200"
                        }`}
                    />
                ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <span>Tutor style quiz</span>
                <span>
                    Question {Math.min(current + 1, total)} of {total}
                </span>
            </div>
        </div>
    );
}

export default function TutorLearningQuiz() {
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
        navigate("/onboarding/tutor");
    };

    return (
        <div className="min-h-screen bg-bg-light flex flex-col">
            <nav className="flex items-center justify-between px-6 sm:px-10 h-20 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/icon.png" alt="PeerPal" className="h-9 w-auto" />
                    <span className="text-lg font-bold bg-gradient-to-r from-tutor to-teal-500 bg-clip-text text-transparent">
                        PeerPal
                    </span>
                </Link>
                <span className="hidden sm:block text-sm font-medium text-gray-400">
                    Tutor Teaching Profile
                </span>
            </nav>

            <div className="flex-1 flex flex-col justify-center px-6 py-8 sm:px-10">
                <QuizProgress current={currentIndex} total={QUESTIONS.length} />

                <div className="w-full max-w-3xl mx-auto mt-8">
                    <div className="rounded-[2rem] border border-white/70 bg-white shadow-soft overflow-hidden">
                        <div className="px-6 py-8 sm:px-8 sm:py-10 min-h-[24rem] flex items-center">
                            {isComplete ? (
                                <div className="w-full text-center">
                                    <div className="mx-auto w-20 h-20 rounded-full bg-teal-50 text-tutor flex items-center justify-center">
                                        <span className="material-icons-round text-4xl">auto_awesome</span>
                                    </div>
                                    <h2 className="mt-6 text-2xl font-display font-bold text-gray-900">
                                        Tutor style profile captured
                                    </h2>
                                    <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                                        Your responses give us a clearer picture of how you guide students, adapt during lessons, and deliver feedback.
                                    </p>
                                    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-semibold text-tutor">
                                        <span className="material-icons-round text-base">check_circle</span>
                                        {completionText}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleFinish}
                                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-tutor px-8 py-3 font-semibold text-white shadow-lg shadow-tutor/20 transition-all hover:-translate-y-0.5 hover:bg-teal-700"
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
                                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-tutor">
                                                Question {currentIndex + 1}
                                            </p>
                                            <h2 className="mt-3 text-2xl sm:text-3xl font-display font-bold text-gray-900 max-w-2xl">
                                                {currentQuestion.prompt}
                                            </h2>
                                            <p className="mt-3 text-gray-500 max-w-xl">
                                                {currentQuestion.helper}
                                            </p>
                                        </div>
                                        <div className="hidden sm:flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-tutor">
                                            <span className="material-icons-round text-3xl">school</span>
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
                                                            ? "border-tutor bg-teal-50 shadow-sm"
                                                            : "border-gray-200 bg-white hover:border-tutor/40 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <span className="text-base font-semibold text-gray-800">
                                                            {option.label}
                                                        </span>
                                                        <span
                                                            className={`material-icons-round text-xl transition ${
                                                                active
                                                                    ? "text-tutor"
                                                                    : "text-gray-300 group-hover:text-tutor/60"
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
                                            className="inline-flex items-center gap-2 rounded-full bg-tutor px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-tutor/20 transition-all hover:-translate-y-0.5 hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:hover:translate-y-0"
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
