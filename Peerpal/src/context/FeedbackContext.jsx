import { createContext, useContext, useEffect, useState } from "react";

const FeedbackContext = createContext(null);

const STORAGE_KEY = "peerpal_feedback_state_v2";

const roundToOneDecimal = (value) => Math.round(value * 10) / 10;

const averageFromRatings = (ratings = {}) => {
  const values = Object.values(ratings).filter((value) => typeof value === "number");
  if (!values.length) return 0;
  return roundToOneDecimal(values.reduce((sum, value) => sum + value, 0) / values.length);
};

const summarizeRatings = (records, keys) => {
  return keys.reduce((acc, key) => {
    const values = records
      .map((record) => record.ratings?.[key])
      .filter((value) => typeof value === "number");
    acc[key] = values.length
      ? roundToOneDecimal(values.reduce((sum, value) => sum + value, 0) / values.length)
      : 0;
    return acc;
  }, {});
};

const studentDimensionKeys = [
  "clarity",
  "patience",
  "subjectKnowledge",
  "communication",
];

const tutorDimensionKeys = ["engagement", "preparedness", "participation"];

const initialState = {
  tutorDirectory: [
    {
      id: 201,
      name: "Tobi Adebayo",
      initials: "TA",
      gradient: "from-blue-500 to-indigo-600",
      university: "University of Lagos",
      subjects: ["Calculus II", "Physics I", "Linear Algebra"],
      rate: 140,
      format: "both",
      active: "Online now",
      bio: "Patient STEM tutor who breaks hard topics into small, memorable steps.",
    },
    {
      id: 202,
      name: "Mariam Okafor",
      initials: "MO",
      gradient: "from-pink-500 to-rose-600",
      university: "Obafemi Awolowo University",
      subjects: ["Organic Chemistry", "Chemistry 101", "Biology 101"],
      rate: 120,
      format: "online",
      active: "25 mins ago",
      bio: "Known for structured revision plans and exam-focused problem solving.",
    },
    {
      id: 203,
      name: "David Mensah",
      initials: "DM",
      gradient: "from-emerald-500 to-teal-600",
      university: "University of Ghana",
      subjects: ["Data Structures & Algorithms", "Intro to Programming"],
      rate: 160,
      format: "both",
      active: "1 hr ago",
      bio: "Practical coding mentor focused on confidence, debugging, and clean logic.",
    },
    {
      id: 204,
      name: "Zainab Bello",
      initials: "ZB",
      gradient: "from-yellow-400 to-orange-500",
      university: "Ahmadu Bello University",
      subjects: ["Statistics 101", "Economics 101"],
      rate: 110,
      format: "in-person",
      active: "3 hrs ago",
      bio: "Explains quantitative concepts with simple real-world examples.",
    },
    {
      id: 205,
      name: "Daniel Eze",
      initials: "DE",
      gradient: "from-violet-500 to-purple-600",
      university: "University of Nigeria, Nsukka",
      subjects: ["Financial Accounting", "Database Systems"],
      rate: 100,
      format: "online",
      active: "Yesterday",
      bio: "Methodical tutor who helps students prepare before every session.",
    },
  ],
  courseCatalog: [
    {
      id: "course-201-calc",
      tutorId: 201,
      title: "Calculus II Mastery Lab",
      subject: "Math",
      category: "Calculus II",
      description: "Build confidence with integration techniques, worked examples, and timed exam drills.",
      tags: ["integration", "exam prep", "calculus", "problem solving"],
      skillLevel: "Intermediate",
      priceType: "Paid",
      price: 140,
      popularity: 94,
      createdAt: "2026-03-18T10:00:00.000Z",
      tutorExperienceLevel: "Advanced",
      availability: [
        { day: "Today", slot: "Afternoon", label: "Today • 3:00 PM" },
        { day: "Thursday", slot: "Evening", label: "Thursday • 6:00 PM" },
      ],
    },
    {
      id: "course-201-physics",
      tutorId: 201,
      title: "Physics Foundations: Forces and Motion",
      subject: "Physics",
      category: "Physics I",
      description: "Learn free body diagrams, Newton's laws, and how to approach motion questions step by step.",
      tags: ["mechanics", "forces", "newton", "problem solving"],
      skillLevel: "Beginner",
      priceType: "Paid",
      price: 150,
      popularity: 88,
      createdAt: "2026-03-20T10:00:00.000Z",
      tutorExperienceLevel: "Advanced",
      availability: [
        { day: "Tomorrow", slot: "Morning", label: "Tomorrow • 9:30 AM" },
        { day: "Saturday", slot: "Afternoon", label: "Saturday • 1:00 PM" },
      ],
    },
    {
      id: "course-202-orgo",
      tutorId: 202,
      title: "Organic Chemistry Reaction Maps",
      subject: "Chemistry",
      category: "Organic Chemistry",
      description: "Understand mechanisms, reaction patterns, and memorisation shortcuts for common exam questions.",
      tags: ["organic chemistry", "mechanisms", "reactions", "revision"],
      skillLevel: "Advanced",
      priceType: "Paid",
      price: 120,
      popularity: 82,
      createdAt: "2026-03-14T12:00:00.000Z",
      tutorExperienceLevel: "Intermediate",
      availability: [
        { day: "Friday", slot: "Evening", label: "Friday • 5:30 PM" },
        { day: "Sunday", slot: "Morning", label: "Sunday • 10:00 AM" },
      ],
    },
    {
      id: "course-202-stoich",
      tutorId: 202,
      title: "Chemistry 101 Stoichiometry Bootcamp",
      subject: "Chemistry",
      category: "Chemistry 101",
      description: "Move from balancing equations to limiting reagents with guided practice and instant correction.",
      tags: ["stoichiometry", "moles", "equations", "chemistry basics"],
      skillLevel: "Beginner",
      priceType: "Free",
      price: 0,
      popularity: 76,
      createdAt: "2026-03-22T09:00:00.000Z",
      tutorExperienceLevel: "Intermediate",
      availability: [
        { day: "Today", slot: "Evening", label: "Today • 7:00 PM" },
        { day: "Saturday", slot: "Morning", label: "Saturday • 11:00 AM" },
      ],
    },
    {
      id: "course-203-dsa",
      tutorId: 203,
      title: "Data Structures Interview Builder",
      subject: "Programming",
      category: "Data Structures & Algorithms",
      description: "Sharpen arrays, trees, graphs, and complexity analysis with practical coding sessions.",
      tags: ["algorithms", "graphs", "trees", "coding interview"],
      skillLevel: "Advanced",
      priceType: "Paid",
      price: 160,
      popularity: 97,
      createdAt: "2026-03-23T08:30:00.000Z",
      tutorExperienceLevel: "Advanced",
      availability: [
        { day: "Tomorrow", slot: "Evening", label: "Tomorrow • 6:30 PM" },
        { day: "Sunday", slot: "Afternoon", label: "Sunday • 2:00 PM" },
      ],
    },
    {
      id: "course-203-js",
      tutorId: 203,
      title: "Programming Fundamentals with JavaScript",
      subject: "Programming",
      category: "Intro to Programming",
      description: "Learn variables, conditionals, loops, and debugging habits through bite-sized coding exercises.",
      tags: ["javascript", "beginner coding", "debugging", "logic"],
      skillLevel: "Beginner",
      priceType: "Paid",
      price: 130,
      popularity: 85,
      createdAt: "2026-03-16T13:15:00.000Z",
      tutorExperienceLevel: "Advanced",
      availability: [
        { day: "Thursday", slot: "Afternoon", label: "Thursday • 2:00 PM" },
        { day: "Saturday", slot: "Evening", label: "Saturday • 5:00 PM" },
      ],
    },
    {
      id: "course-204-stats",
      tutorId: 204,
      title: "Statistics Confidence Clinic",
      subject: "Math",
      category: "Statistics 101",
      description: "Master probability, distributions, and hypothesis testing with intuitive examples.",
      tags: ["statistics", "probability", "hypothesis testing", "data"],
      skillLevel: "Intermediate",
      priceType: "Paid",
      price: 110,
      popularity: 78,
      createdAt: "2026-03-19T15:00:00.000Z",
      tutorExperienceLevel: "Intermediate",
      availability: [
        { day: "Friday", slot: "Morning", label: "Friday • 9:00 AM" },
        { day: "Sunday", slot: "Evening", label: "Sunday • 6:00 PM" },
      ],
    },
    {
      id: "course-204-econ",
      tutorId: 204,
      title: "Economics 101 Graphs and Intuition",
      subject: "Economics",
      category: "Economics 101",
      description: "Understand supply, demand, elasticity, and market equilibrium through visual problem solving.",
      tags: ["economics", "graphs", "elasticity", "microeconomics"],
      skillLevel: "Beginner",
      priceType: "Free",
      price: 0,
      popularity: 71,
      createdAt: "2026-03-24T07:45:00.000Z",
      tutorExperienceLevel: "Intermediate",
      availability: [
        { day: "Today", slot: "Morning", label: "Today • 11:30 AM" },
        { day: "Saturday", slot: "Afternoon", label: "Saturday • 3:00 PM" },
      ],
    },
    {
      id: "course-205-accounting",
      tutorId: 205,
      title: "Accounting Essentials Sprint",
      subject: "Business",
      category: "Financial Accounting",
      description: "Work through journal entries, ledger posting, and trial balance corrections without confusion.",
      tags: ["accounting", "journal entries", "trial balance", "revision"],
      skillLevel: "Intermediate",
      priceType: "Paid",
      price: 100,
      popularity: 69,
      createdAt: "2026-03-17T16:00:00.000Z",
      tutorExperienceLevel: "Beginner",
      availability: [
        { day: "Thursday", slot: "Morning", label: "Thursday • 10:00 AM" },
        { day: "Monday", slot: "Evening", label: "Monday • 7:00 PM" },
      ],
    },
    {
      id: "course-205-db",
      tutorId: 205,
      title: "Database Systems Query Workshop",
      subject: "Programming",
      category: "Database Systems",
      description: "Practice SQL queries, joins, normalization, and schema reasoning with guided examples.",
      tags: ["sql", "database", "joins", "normalization"],
      skillLevel: "Advanced",
      priceType: "Paid",
      price: 115,
      popularity: 74,
      createdAt: "2026-03-21T11:30:00.000Z",
      tutorExperienceLevel: "Beginner",
      availability: [
        { day: "Tomorrow", slot: "Afternoon", label: "Tomorrow • 1:30 PM" },
        { day: "Sunday", slot: "Morning", label: "Sunday • 9:00 AM" },
      ],
    },
  ],
  students: [
    {
      id: 101,
      name: "Ada Nwosu",
      initials: "AN",
      university: "University of Lagos",
      year: "200 Level",
      bio: "Engineering student building stronger problem-solving habits.",
    },
    {
      id: 102,
      name: "Samuel Adeyemi",
      initials: "SA",
      university: "University of Ilorin",
      year: "100 Level",
      bio: "Curious first-year student working on consistency and confidence.",
    },
    {
      id: 103,
      name: "Chioma Okeke",
      initials: "CO",
      university: "Covenant University",
      year: "300 Level",
      bio: "Focused on polishing exam technique and speed.",
    },
    {
      id: 104,
      name: "Emeka Obi",
      initials: "EO",
      university: "University of Benin",
      year: "200 Level",
      bio: "Prefers concept-first explanations before drilling practice questions.",
    },
  ],
  studentSessions: [
    {
      id: 1,
      tutorId: 201,
      tutor: "Tobi Adebayo",
      initials: "TA",
      gradient: "from-blue-500 to-indigo-600",
      subject: "Calculus II",
      topic: "Integration by Parts and Partial Fractions",
      date: "Today",
      time: "3:00 PM - 4:00 PM",
      duration: "1 hour",
      format: "online",
      status: "confirmed",
      tab: "upcoming",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      university: "University of Lagos",
      rate: 140,
      paid: true,
      notes: "We will focus on pattern recognition and when to choose each technique.",
      tutorBio: "Patient STEM tutor who breaks hard topics into small, memorable steps.",
    },
    {
      id: 2,
      tutorId: 202,
      tutor: "Mariam Okafor",
      initials: "MO",
      gradient: "from-pink-500 to-rose-600",
      subject: "Chemistry 101",
      topic: "Stoichiometry Drill Session",
      date: "Tomorrow",
      time: "10:00 AM - 11:30 AM",
      duration: "1.5 hours",
      format: "in-person",
      status: "pending",
      tab: "upcoming",
      location: "Science Hub, Room C14",
      university: "Obafemi Awolowo University",
      rate: 120,
      paid: false,
      notes: "Bring your worksheet so we can review mistakes together.",
      tutorBio: "Known for structured revision plans and exam-focused problem solving.",
    },
    {
      id: 4,
      tutorId: 204,
      tutor: "Zainab Bello",
      initials: "ZB",
      gradient: "from-yellow-400 to-orange-500",
      subject: "Statistics 101",
      topic: "Hypothesis Testing and p-values",
      date: "Mon, 3 Mar",
      time: "11:00 AM - 12:00 PM",
      duration: "1 hour",
      format: "online",
      status: "completed",
      tab: "completed",
      university: "Ahmadu Bello University",
      rate: 110,
      paid: true,
      notes: "Covered Z-tests, t-tests, and interpreting statistical output.",
      tutorBio: "Explains quantitative concepts with simple real-world examples.",
    },
    {
      id: 5,
      tutorId: 203,
      tutor: "David Mensah",
      initials: "DM",
      gradient: "from-emerald-500 to-teal-600",
      subject: "Data Structures",
      topic: "Binary Trees and BFS/DFS",
      date: "Sat, 1 Mar",
      time: "9:00 AM - 10:30 AM",
      duration: "1.5 hours",
      format: "online",
      status: "completed",
      tab: "completed",
      university: "University of Ghana",
      rate: 160,
      paid: true,
      notes: "Hands-on coding session with implementation practice in JavaScript.",
      tutorBio: "Practical coding mentor focused on confidence, debugging, and clean logic.",
    },
    {
      id: 6,
      tutorId: 205,
      tutor: "Daniel Eze",
      initials: "DE",
      gradient: "from-violet-500 to-purple-600",
      subject: "Financial Accounting",
      topic: "Journal Entries and Trial Balance",
      date: "Thu, 27 Feb",
      time: "4:00 PM - 5:00 PM",
      duration: "1 hour",
      format: "in-person",
      status: "completed",
      tab: "completed",
      university: "University of Nigeria, Nsukka",
      rate: 100,
      paid: true,
      location: "Accounting Lab 2",
      notes: "Worked through a full bookkeeping cycle and exam tips.",
      tutorBio: "Methodical tutor who helps students prepare before every session.",
    },
    {
      id: 7,
      tutorId: 202,
      tutor: "Mariam Okafor",
      initials: "MO",
      gradient: "from-amber-500 to-red-500",
      subject: "Organic Chemistry",
      topic: "Reaction Mechanisms",
      date: "Tue, 25 Feb",
      time: "1:00 PM - 2:00 PM",
      duration: "1 hour",
      format: "in-person",
      status: "cancelled",
      tab: "cancelled",
      cancelReason: "Tutor had a schedule conflict.",
      university: "Obafemi Awolowo University",
      rate: 120,
      paid: false,
      location: "Chemistry Annex",
      notes: "Mechanism walkthrough was planned before the cancellation.",
      tutorBio: "Known for structured revision plans and exam-focused problem solving.",
    },
  ],
  tutorSessions: [
    {
      id: 11,
      studentId: 102,
      student: "Samuel Adeyemi",
      initials: "SA",
      gradient: "from-pink-500 to-rose-600",
      university: "University of Ilorin",
      year: "100 Level",
      subject: "Calculus II",
      topic: "Chain Rule Revision",
      date: "Today",
      time: "5:00 PM - 6:00 PM",
      duration: "1 hour",
      format: "online",
      status: "confirmed",
      tab: "upcoming",
      meetingLink: "https://meet.google.com/tutor-room-123",
      rate: 150,
      paid: true,
      notes: "Plan to move from worked examples to independent practice.",
      studentNote: "I keep mixing up chain rule and product rule questions.",
    },
    {
      id: 12,
      studentId: 103,
      student: "Chioma Okeke",
      initials: "CO",
      gradient: "from-blue-500 to-indigo-600",
      university: "Covenant University",
      year: "300 Level",
      subject: "Physics I",
      topic: "Newton's Laws and Free Body Diagrams",
      date: "Tomorrow",
      time: "1:00 PM - 2:30 PM",
      duration: "1.5 hours",
      format: "in-person",
      status: "confirmed",
      tab: "upcoming",
      location: "Engineering Block, Room 12",
      rate: 150,
      paid: false,
      notes: "Will start with misconceptions before problem-solving drills.",
      studentNote: "Please show how to choose the right direction for forces.",
    },
    {
      id: 14,
      studentId: 104,
      student: "Emeka Obi",
      initials: "EO",
      gradient: "from-cyan-500 to-blue-600",
      university: "University of Benin",
      year: "200 Level",
      subject: "Linear Algebra",
      topic: "Eigenvalues and Diagonalisation",
      date: "Mon, 3 Mar",
      time: "11:00 AM - 12:00 PM",
      duration: "1 hour",
      format: "online",
      status: "completed",
      tab: "completed",
      rate: 150,
      paid: true,
      notes: "Worked through diagonalisation conditions and exam traps.",
    },
    {
      id: 15,
      studentId: 101,
      student: "Ada Nwosu",
      initials: "AN",
      gradient: "from-emerald-500 to-teal-600",
      university: "University of Lagos",
      year: "200 Level",
      subject: "Calculus II",
      topic: "Integration by Parts",
      date: "Sat, 1 Mar",
      time: "9:00 AM - 10:30 AM",
      duration: "1.5 hours",
      format: "in-person",
      status: "completed",
      tab: "completed",
      location: "Library Annex",
      rate: 150,
      paid: true,
      notes: "Moved from guided examples to solo attempts with feedback.",
    },
    {
      id: 16,
      studentId: 102,
      student: "Samuel Adeyemi",
      initials: "SA",
      gradient: "from-yellow-400 to-orange-500",
      university: "University of Ilorin",
      year: "100 Level",
      subject: "Data Structures",
      topic: "Stacks, Queues and Complexity",
      date: "Thu, 27 Feb",
      time: "4:00 PM - 5:00 PM",
      duration: "1 hour",
      format: "online",
      status: "completed",
      tab: "completed",
      rate: 150,
      paid: true,
      notes: "Student improved when moved to visual examples and tracing.",
    },
    {
      id: 17,
      studentId: 103,
      student: "Chioma Okeke",
      initials: "CO",
      gradient: "from-amber-500 to-red-500",
      university: "Covenant University",
      year: "300 Level",
      subject: "Physics I",
      topic: "Momentum and Impulse",
      date: "Tue, 25 Feb",
      time: "1:00 PM - 2:00 PM",
      duration: "1 hour",
      format: "in-person",
      status: "cancelled",
      tab: "cancelled",
      cancelReason: "Student had a schedule conflict.",
      rate: 150,
      paid: false,
      location: "Engineering Block, Room 12",
      notes: "Session cancelled before topic review began.",
    },
  ],
  feedbackRecords: [
    {
      id: "fb-s-4",
      sessionId: 4,
      fromRole: "student",
      fromUserId: 101,
      toUserId: 204,
      sessionSubject: "Statistics 101",
      sessionTopic: "Hypothesis Testing and p-values",
      counterpartName: "Zainab Bello",
      anonymous: false,
      submittedAt: "2026-03-03T13:10:00.000Z",
      ratings: {
        clarity: 5,
        patience: 5,
        subjectKnowledge: 4,
        communication: 5,
      },
      overallRating: 4.8,
      comment: "Clear explanations and a calm pace. I finally understood when to use each test.",
      reflection: {
        improvedUnderstanding: "Yes, I can now interpret p-values confidently.",
        needsImprovement: "I still need more practice choosing between z-tests and t-tests.",
      },
      recommendation: "",
      sessionNotes: "",
      flag: null,
    },
    {
      id: "fb-t-4",
      sessionId: 4,
      fromRole: "tutor",
      fromUserId: 204,
      toUserId: 101,
      sessionSubject: "Statistics 101",
      sessionTopic: "Hypothesis Testing and p-values",
      counterpartName: "Ada Nwosu",
      anonymous: false,
      submittedAt: "2026-03-03T13:25:00.000Z",
      ratings: {
        engagement: 5,
        preparedness: 4,
        participation: 5,
      },
      overallRating: 4.7,
      comment: "Asked strong follow-up questions and improved throughout the hour.",
      reflection: null,
      recommendation: "Revise the assumptions behind each test and solve two timed interpretation questions.",
      sessionNotes: {
        topicsCovered: "Z-tests, t-tests, significance levels, interpreting software output.",
        strengths: "Good conceptual curiosity and willingness to attempt answers before help.",
        weaknesses: "Needs faster recognition of which statistical test fits the question.",
      },
      flag: null,
    },
    {
      id: "fb-s-5",
      sessionId: 5,
      fromRole: "student",
      fromUserId: 101,
      toUserId: 203,
      sessionSubject: "Data Structures",
      sessionTopic: "Binary Trees and BFS/DFS",
      counterpartName: "David Mensah",
      anonymous: true,
      submittedAt: "2026-03-01T10:50:00.000Z",
      ratings: {
        clarity: 4,
        patience: 5,
        subjectKnowledge: 5,
        communication: 4,
      },
      overallRating: 4.5,
      comment: "Really strong technical depth. The coding walkthrough helped a lot.",
      reflection: {
        improvedUnderstanding: "Yes, tree traversal finally clicked.",
        needsImprovement: "I still want to practice recursion without prompts.",
      },
      recommendation: "",
      sessionNotes: "",
      flag: {
        type: "missed-session",
        details: "Started about 15 minutes late without much notice.",
      },
    },
    {
      id: "fb-s-6",
      sessionId: 6,
      fromRole: "student",
      fromUserId: 101,
      toUserId: 205,
      sessionSubject: "Financial Accounting",
      sessionTopic: "Journal Entries and Trial Balance",
      counterpartName: "Daniel Eze",
      anonymous: false,
      submittedAt: "2026-02-27T17:12:00.000Z",
      ratings: {
        clarity: 5,
        patience: 4,
        subjectKnowledge: 4,
        communication: 4,
      },
      overallRating: 4.3,
      comment: "Helpful practice and solid correction of my bookkeeping mistakes.",
      reflection: {
        improvedUnderstanding: "Mostly yes, especially balancing entries.",
        needsImprovement: "I need more speed when spotting errors in the trial balance.",
      },
      recommendation: "",
      sessionNotes: "",
      flag: null,
    },
    {
      id: "fb-s-1001",
      sessionId: 1001,
      fromRole: "student",
      fromUserId: 102,
      toUserId: 201,
      sessionSubject: "Calculus II",
      sessionTopic: "Implicit differentiation",
      counterpartName: "Tobi Adebayo",
      anonymous: false,
      submittedAt: "2026-02-18T16:00:00.000Z",
      ratings: {
        clarity: 5,
        patience: 5,
        subjectKnowledge: 5,
        communication: 4,
      },
      overallRating: 4.8,
      comment: "Fantastic structure and examples.",
      reflection: {
        improvedUnderstanding: "Yes, much stronger now.",
        needsImprovement: "Need more timed practice.",
      },
      recommendation: "",
      sessionNotes: "",
      flag: null,
    },
    {
      id: "fb-s-1002",
      sessionId: 1002,
      fromRole: "student",
      fromUserId: 103,
      toUserId: 201,
      sessionSubject: "Physics I",
      sessionTopic: "Forces and motion",
      counterpartName: "Tobi Adebayo",
      anonymous: true,
      submittedAt: "2026-02-12T18:00:00.000Z",
      ratings: {
        clarity: 5,
        patience: 4,
        subjectKnowledge: 5,
        communication: 5,
      },
      overallRating: 4.8,
      comment: "Explains difficult ideas without making you feel lost.",
      reflection: {
        improvedUnderstanding: "Yes.",
        needsImprovement: "Need more free body diagram drills.",
      },
      recommendation: "",
      sessionNotes: "",
      flag: null,
    },
    {
      id: "fb-s-1003",
      sessionId: 1003,
      fromRole: "student",
      fromUserId: 104,
      toUserId: 202,
      sessionSubject: "Organic Chemistry",
      sessionTopic: "Reaction mechanisms",
      counterpartName: "Mariam Okafor",
      anonymous: false,
      submittedAt: "2026-02-15T14:30:00.000Z",
      ratings: {
        clarity: 4,
        patience: 5,
        subjectKnowledge: 4,
        communication: 5,
      },
      overallRating: 4.5,
      comment: "Very supportive and organised.",
      reflection: {
        improvedUnderstanding: "Yes.",
        needsImprovement: "Still mixing up nucleophiles and electrophiles.",
      },
      recommendation: "",
      sessionNotes: "",
      flag: null,
    },
    {
      id: "fb-s-1004",
      sessionId: 1004,
      fromRole: "student",
      fromUserId: 103,
      toUserId: 203,
      sessionSubject: "Data Structures",
      sessionTopic: "Graph traversal",
      counterpartName: "David Mensah",
      anonymous: false,
      submittedAt: "2026-02-10T12:10:00.000Z",
      ratings: {
        clarity: 5,
        patience: 4,
        subjectKnowledge: 5,
        communication: 4,
      },
      overallRating: 4.5,
      comment: "Great explanations but the session felt rushed near the end.",
      reflection: {
        improvedUnderstanding: "Yes.",
        needsImprovement: "Need more dry-run practice.",
      },
      recommendation: "",
      sessionNotes: "",
      flag: null,
    },
    {
      id: "fb-s-1005",
      sessionId: 1005,
      fromRole: "student",
      fromUserId: 102,
      toUserId: 204,
      sessionSubject: "Statistics 101",
      sessionTopic: "Probability distributions",
      counterpartName: "Zainab Bello",
      anonymous: true,
      submittedAt: "2026-02-09T09:00:00.000Z",
      ratings: {
        clarity: 4,
        patience: 4,
        subjectKnowledge: 4,
        communication: 4,
      },
      overallRating: 4,
      comment: "Good pacing and simple examples.",
      reflection: {
        improvedUnderstanding: "Somewhat.",
        needsImprovement: "Need more problem solving confidence.",
      },
      recommendation: "",
      sessionNotes: "",
      flag: null,
    },
    {
      id: "fb-t-15",
      sessionId: 15,
      fromRole: "tutor",
      fromUserId: 201,
      toUserId: 101,
      sessionSubject: "Calculus II",
      sessionTopic: "Integration by Parts",
      counterpartName: "Ada Nwosu",
      anonymous: false,
      submittedAt: "2026-03-01T11:00:00.000Z",
      ratings: {
        engagement: 5,
        preparedness: 5,
        participation: 4,
      },
      overallRating: 4.7,
      comment: "Came prepared with attempted solutions and stayed engaged.",
      reflection: null,
      recommendation: "Redo the two hardest examples without notes and check where you hesitate.",
      sessionNotes: {
        topicsCovered: "Choosing u and dv, repeated integration by parts, exam-style questions.",
        strengths: "Strong persistence and good correction after feedback.",
        weaknesses: "Still hesitates when the integrand could be solved by a simpler method.",
      },
      flag: null,
    },
    {
      id: "fb-s-15",
      sessionId: 15,
      fromRole: "student",
      fromUserId: 101,
      toUserId: 201,
      sessionSubject: "Calculus II",
      sessionTopic: "Integration by Parts",
      counterpartName: "Tobi Adebayo",
      anonymous: false,
      submittedAt: "2026-03-01T10:55:00.000Z",
      ratings: {
        clarity: 5,
        patience: 5,
        subjectKnowledge: 5,
        communication: 5,
      },
      overallRating: 5,
      comment: "Best calculus session I have had so far.",
      reflection: {
        improvedUnderstanding: "Yes, I feel much more confident choosing the right method.",
        needsImprovement: "Need more timed practice on mixed integration questions.",
      },
      recommendation: "",
      sessionNotes: "",
      flag: null,
    },
    {
      id: "fb-s-14",
      sessionId: 14,
      fromRole: "student",
      fromUserId: 104,
      toUserId: 201,
      sessionSubject: "Linear Algebra",
      sessionTopic: "Eigenvalues and Diagonalisation",
      counterpartName: "Tobi Adebayo",
      anonymous: true,
      submittedAt: "2026-03-03T12:10:00.000Z",
      ratings: {
        clarity: 4,
        patience: 5,
        subjectKnowledge: 5,
        communication: 4,
      },
      overallRating: 4.5,
      comment: "Helpful explanations and good patience when I got stuck.",
      reflection: {
        improvedUnderstanding: "Yes, diagonalisation is much less intimidating now.",
        needsImprovement: "I still need more matrix arithmetic practice.",
      },
      recommendation: "",
      sessionNotes: "",
      flag: null,
    },
  ],
  moderationActions: [
    {
      caseId: "case-fb-s-5",
      feedbackId: "fb-s-5",
      action: "warn",
      note: "Issued reminder about punctuality expectations.",
      actedAt: "2026-03-02T09:30:00.000Z",
    },
  ],
};

const readState = () => {
  if (typeof window === "undefined") return initialState;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialState;

    const parsed = JSON.parse(stored);
    return {
      ...initialState,
      ...parsed,
      tutorDirectory: parsed.tutorDirectory || initialState.tutorDirectory,
      courseCatalog: parsed.courseCatalog || initialState.courseCatalog,
      students: parsed.students || initialState.students,
      studentSessions: parsed.studentSessions || initialState.studentSessions,
      tutorSessions: parsed.tutorSessions || initialState.tutorSessions,
      feedbackRecords: parsed.feedbackRecords || initialState.feedbackRecords,
      moderationActions: parsed.moderationActions || initialState.moderationActions,
    };
  } catch (error) {
    console.error("Failed to parse feedback state", error);
    return initialState;
  }
};

const getSessionMap = (state) => {
  const allSessions = [...state.studentSessions, ...state.tutorSessions];
  return allSessions.reduce((acc, session) => {
    acc[session.id] = session;
    return acc;
  }, {});
};

const getFeedbackPair = (records, sessionId) => ({
  student: records.find(
    (record) => record.sessionId === sessionId && record.fromRole === "student"
  ),
  tutor: records.find(
    (record) => record.sessionId === sessionId && record.fromRole === "tutor"
  ),
});

const computeTutorProfile = (state, tutor) => {
  const records = state.feedbackRecords.filter(
    (record) => record.fromRole === "student" && record.toUserId === tutor.id
  );
  const averageRating = records.length
    ? roundToOneDecimal(
        records.reduce((sum, record) => sum + record.overallRating, 0) / records.length
      )
    : 0;
  const dimensions = summarizeRatings(records, studentDimensionKeys);
  const completedSessions = state.studentSessions.filter(
    (session) => session.tutorId === tutor.id && session.tab === "completed"
  ).length;
  const visibilityScore = roundToOneDecimal(
    averageRating * 20 + Math.min(records.length, 25) + completedSessions * 1.5
  );

  return {
    ...tutor,
    rating: averageRating,
    reviews: records.length,
    completedSessions,
    visibilityScore,
    dimensions,
    recentReviews: records
      .slice()
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, 3)
      .map((record) => ({
        ...record,
        authorName: record.anonymous ? "Anonymous student" : "Student reviewer",
      })),
  };
};

const computeStudentProfile = (state, studentId) => {
  const student = state.students.find((entry) => entry.id === studentId);
  const records = state.feedbackRecords.filter(
    (record) => record.fromRole === "tutor" && record.toUserId === studentId
  );
  const averageRating = records.length
    ? roundToOneDecimal(
        records.reduce((sum, record) => sum + record.overallRating, 0) / records.length
      )
    : 0;

  return {
    ...student,
    rating: averageRating,
    reviews: records.length,
    dimensions: summarizeRatings(records, tutorDimensionKeys),
    receivedFeedback: records
      .slice()
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
  };
};

const formatFeedbackForCase = (state, feedbackRecord) => {
  const action = state.moderationActions.find(
    (entry) => entry.feedbackId === feedbackRecord.id
  );
  return {
    caseId: `case-${feedbackRecord.id}`,
    feedbackId: feedbackRecord.id,
    sessionId: feedbackRecord.sessionId,
    fromRole: feedbackRecord.fromRole,
    issueType: feedbackRecord.flag?.type || "none",
    details: feedbackRecord.flag?.details || "",
    sessionSubject: feedbackRecord.sessionSubject,
    counterpartName: feedbackRecord.counterpartName,
    overallRating: feedbackRecord.overallRating,
    submittedAt: feedbackRecord.submittedAt,
    action: action?.action || "pending",
    actionNote: action?.note || "",
    actedAt: action?.actedAt || "",
  };
};

export function FeedbackProvider({ children }) {
  const [state, setState] = useState(readState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const submitFeedback = ({ sessionId, role, payload }) => {
    const duplicateExists = state.feedbackRecords.some(
      (record) => record.sessionId === sessionId && record.fromRole === role
    );

    if (duplicateExists) {
      throw new Error("Feedback has already been submitted for this session.");
    }

    const sessionMap = getSessionMap(state);
    const session = sessionMap[sessionId];
    if (!session) {
      throw new Error("Session not found.");
    }

    const record = {
      id: `fb-${role}-${sessionId}-${Date.now()}`,
      sessionId,
      fromRole: role,
      fromUserId: role === "student" ? 101 : 201,
      toUserId: role === "student" ? session.tutorId : session.studentId,
      sessionSubject: session.subject,
      sessionTopic: session.topic,
      counterpartName: role === "student" ? session.tutor : session.student,
      anonymous: !!payload.anonymous,
      submittedAt: new Date().toISOString(),
      ratings: payload.ratings,
      overallRating: averageFromRatings(payload.ratings),
      comment: payload.comment || "",
      reflection: payload.reflection || null,
      recommendation: payload.recommendation || "",
      sessionNotes: payload.sessionNotes || null,
      flag: payload.flag?.type ? payload.flag : null,
    };

    setState((current) => ({
      ...current,
      feedbackRecords: [...current.feedbackRecords, record],
    }));

    return record;
  };

  const takeModerationAction = ({ feedbackId, action, note }) => {
    const caseId = `case-${feedbackId}`;
    setState((current) => {
      const existing = current.moderationActions.filter(
        (entry) => entry.feedbackId !== feedbackId
      );

      return {
        ...current,
        moderationActions: [
          ...existing,
          {
            caseId,
            feedbackId,
            action,
            note: note || "",
            actedAt: new Date().toISOString(),
          },
        ],
      };
    });
  };

  const getStudentSessions = () =>
    state.studentSessions.map((session) => {
      const pair = getFeedbackPair(state.feedbackRecords, session.id);
      return {
        ...session,
        feedback: pair,
        feedbackPending: session.tab === "completed" && !pair.student,
      };
    });

  const getTutorSessions = () =>
    state.tutorSessions.map((session) => {
      const pair = getFeedbackPair(state.feedbackRecords, session.id);
      return {
        ...session,
        feedback: pair,
        feedbackPending: session.tab === "completed" && !pair.tutor,
      };
    });

  const getSessionByRole = (role, sessionId) => {
    const collection = role === "student" ? getStudentSessions() : getTutorSessions();
    return collection.find((session) => session.id === Number(sessionId));
  };

  const tutorProfiles = state.tutorDirectory
    .map((tutor) => computeTutorProfile(state, tutor))
    .sort((a, b) => b.visibilityScore - a.visibilityScore);

  const studentProfile = computeStudentProfile(state, 101);

  const flaggedCases = state.feedbackRecords
    .filter((record) => record.flag?.type)
    .map((record) => formatFeedbackForCase(state, record))
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const allFeedback = state.feedbackRecords
    .slice()
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const value = {
    courseCatalog: state.courseCatalog,
    tutorProfiles,
    studentProfile,
    students: state.students,
    allFeedback,
    flaggedCases,
    moderationActions: state.moderationActions,
    getStudentSessions,
    getTutorSessions,
    getSessionByRole,
    getFeedbackPair: (sessionId) => getFeedbackPair(state.feedbackRecords, sessionId),
    submitFeedback,
    takeModerationAction,
  };

  return <FeedbackContext.Provider value={value}>{children}</FeedbackContext.Provider>;
}

export const useFeedback = () => useContext(FeedbackContext);
