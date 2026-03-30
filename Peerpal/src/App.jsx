import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import WhyPeerPal from "./components/WhyPeerPal";
import Testimonials from "./components/Testimonials";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StudentOnboarding from "./pages/StudentOnboarding";
import StudentLearningQuiz from "./pages/StudentLearningQuiz";
import TutorLearningQuiz from "./pages/TutorLearningQuiz";

/* Student Dashboard */
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import BrowseTutors from "./pages/dashboard/BrowseTutors";
import TutorProfile from "./pages/dashboard/TutorProfile";
import MySessions from "./pages/dashboard/MySessions";
import Messages from "./pages/dashboard/Messages";
import Progress from "./pages/dashboard/Progress";
import Wallet from "./pages/dashboard/Wallet";
import Settings from "./pages/dashboard/Settings";
import SessionDetail from "./pages/dashboard/SessionDetail";
import FeedbackHub from "./pages/dashboard/FeedbackHub";

/* Tutor Portal */
import TutorOnboarding from "./pages/TutorOnboarding";
import TutorDashboardLayout from "./layouts/TutorDashboardLayout";
import TutorDashboardHome from "./pages/tutor/TutorDashboardHome";
import SessionRequests from "./pages/tutor/SessionRequests";
import TutorSessions from "./pages/tutor/TutorSessions";
import TutorSessionDetail from "./pages/tutor/TutorSessionDetail";
import TutorMessages from "./pages/tutor/TutorMessages";
import Earnings from "./pages/tutor/Earnings";
import Availability from "./pages/tutor/Availability";
import Students from "./pages/tutor/Students";
import TutorSettings from "./pages/tutor/TutorSettings";
import TutorFeedbackHub from "./pages/tutor/TutorFeedbackHub";

/* Admin Portal */
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import AdminDashboardHome from "./pages/admin/AdminDashboardHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSessions from "./pages/admin/AdminSessions";
import AdminPayouts from "./pages/admin/AdminPayouts";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminFeedback from "./pages/admin/AdminFeedback";

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <WhyPeerPal />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/get-started" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/onboarding/student" element={<StudentOnboarding />} />
        <Route path="/onboarding/student/quiz" element={<StudentLearningQuiz />} />
        <Route path="/onboarding/tutor" element={<TutorOnboarding />} />
        <Route path="/onboarding/tutor/quiz" element={<TutorLearningQuiz />} />

        {/* Student Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="browse" element={<BrowseTutors />} />
          <Route path="tutors/:id" element={<TutorProfile />} />
          <Route path="sessions" element={<MySessions />} />
          <Route path="sessions/:id" element={<SessionDetail />} />
          <Route path="messages" element={<Messages />} />
          <Route path="progress" element={<Progress />} />
          <Route path="feedback" element={<FeedbackHub />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Tutor Dashboard */}
        <Route path="/tutor/dashboard" element={<TutorDashboardLayout />}>
          <Route index element={<TutorDashboardHome />} />
          <Route path="requests" element={<SessionRequests />} />
          <Route path="sessions" element={<TutorSessions />} />
          <Route path="sessions/:id" element={<TutorSessionDetail />} />
          <Route path="messages" element={<TutorMessages />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="feedback" element={<TutorFeedbackHub />} />
          <Route path="availability" element={<Availability />} />
          <Route path="students" element={<Students />} />
          <Route path="settings" element={<TutorSettings />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sessions" element={<AdminSessions />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="payouts" element={<AdminPayouts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
