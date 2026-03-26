const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/pages/dashboard/DashboardHome.jsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
    /const STATS = \[[^]*?\];/, 
    '// STATS removed'
);
content = content.replace(
    /const UPCOMING_SESSIONS = \[[^]*?\];/, 
    '// UPCOMING_SESSIONS removed'
);
content = content.replace(
    /const RECOMMENDED_TUTORS = \[[^]*?\];/, 
    '// RECOMMENDED_TUTORS removed'
);

content = content.replace(
    import { useFeedback } from "../../context/FeedbackContext";,
    import { useFeedback } from "../../context/FeedbackContext";\nimport { useEffect } from "react";\nimport { TutorAPI, SessionsAPI } from "../../services/api";
);

content = content.replace(
    /export default function DashboardHome\(\) \{\n    const feedback = useFeedback\(\);/,
    export default function DashboardHome() {
    const feedback = useFeedback();
    const [stats, setStats] = useState([
        { icon: "event_available", label: "Total Sessions", value: "0", color: "bg-blue-50 text-primary" },
        { icon: "menu_book", label: "Subjects Built", value: "0", color: "bg-green-50 text-green-600" },
        { icon: "schedule", label: "Hours Learned", value: "0", color: "bg-purple-50 text-purple-600" },
    ]);
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [recommendedTutors, setRecommendedTutors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch sessions
                const sessions = await MatchesAPI.getSessions();
                
                // Process for stats
                const totalSessions = sessions.length;
                const hours = sessions.reduce((acc, curr) => acc + (curr.duration || 1), 0);
                
                // Format upcoming sessions
                const upcoming = sessions.filter(s => s.status === 'upcoming' || s.status === 'accepted').slice(0, 3).map(s => ({
                    id: s.id,
                    tutor: s.tutor_name || \Tutor \\,
                    initials: (s.tutor_name || "T U").split(" ").map(n => n[0]).join(""),
                    gradient: "from-blue-500 to-indigo-600",
                    subject: s.subject || "General Session",
                    date: new Date(s.date).toLocaleString(),
                    format: s.session_type || "online",
                }));
                
                setUpcomingSessions(upcoming);
                
                setStats([
                    { icon: "event_available", label: "Total Sessions", value: totalSessions.toString(), color: "bg-blue-50 text-primary" },
                    { icon: "menu_book", label: "Subjects Built", value: "1", color: "bg-green-50 text-green-600" },
                    { icon: "schedule", label: "Hours Learned", value: hours.toString(), color: "bg-purple-50 text-purple-600" },
                ]);

                // Fetch Tutors - Temporary solution since TutorAPI isn't fully verified
                // const tutors = await TutorAPI.getTutors();
                setRecommendedTutors([]);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);
);

content = content.replace(/\{STATS\.map\(/g, '{stats.map(');
content = content.replace(/\{UPCOMING_SESSIONS\.map\(/g, '{upcomingSessions.map(');
content = content.replace(/feedback\.tutorProfiles\?.length[^]*?\)[^]*?\)[^]*?: RECOMMENDED_TUTORS;/g, 'recommendedTutors;');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done modifying DashboardHome.jsx');
