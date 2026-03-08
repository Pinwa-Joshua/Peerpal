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
import StudentOnboarding from "./pages/StudentOnboarding";

/* Student Dashboard */
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import BrowseTutors from "./pages/dashboard/BrowseTutors";
import MySessions from "./pages/dashboard/MySessions";
import Messages from "./pages/dashboard/Messages";
import Progress from "./pages/dashboard/Progress";
import Wallet from "./pages/dashboard/Wallet";
import Settings from "./pages/dashboard/Settings";
import SessionDetail from "./pages/dashboard/SessionDetail";

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
        <Route path="/onboarding/student" element={<StudentOnboarding />} />
        <Route path="/onboarding/tutor" element={<TutorOnboarding />} />

        {/* Student Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="browse" element={<BrowseTutors />} />
          <Route path="sessions" element={<MySessions />} />
          <Route path="sessions/:id" element={<SessionDetail />} />
          <Route path="messages" element={<Messages />} />
          <Route path="progress" element={<Progress />} />
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
          <Route path="availability" element={<Availability />} />
          <Route path="students" element={<Students />} />
          <Route path="settings" element={<TutorSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
