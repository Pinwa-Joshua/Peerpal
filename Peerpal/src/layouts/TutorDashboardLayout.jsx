import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ─── sidebar nav items ─── */
const NAV_ITEMS = [
    { to: "/tutor/dashboard", icon: "dashboard", label: "Dashboard", end: true },
    { to: "/tutor/dashboard/requests", icon: "inbox", label: "Session Requests" },
    { to: "/tutor/dashboard/sessions", icon: "event_note", label: "My Sessions" },
    { to: "/tutor/dashboard/messages", icon: "chat_bubble", label: "Messages" },
    { to: "/tutor/dashboard/earnings", icon: "account_balance_wallet", label: "Earnings" },
    { to: "/tutor/dashboard/availability", icon: "calendar_month", label: "Availability" },
    { to: "/tutor/dashboard/students", icon: "groups", label: "Students" },
    { to: "/tutor/dashboard/settings", icon: "settings", label: "Settings" },
];

export default function TutorDashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const linkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
            ? "bg-teal-50 text-tutor font-semibold"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        }`;

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 h-16 flex-shrink-0 border-b border-gray-100">
                <img src="/icon.png" alt="PeerPal" className="h-8 w-auto flex-shrink-0" />
                {(!collapsed || isMobile) && (
                    <span className="text-lg font-bold bg-gradient-to-r from-tutor to-teal-500 bg-clip-text text-transparent whitespace-nowrap">
                        PeerPal
                    </span>
                )}
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={linkClasses}
                        onClick={() => isMobile && setMobileOpen(false)}
                    >
                        <span className="material-icons-round text-xl flex-shrink-0">
                            {item.icon}
                        </span>
                        {(!collapsed || isMobile) && (
                            <span className="whitespace-nowrap">{item.label}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom: user + logout */}
            <div className="flex-shrink-0 border-t border-gray-100 p-3 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-tutor to-tutor-light flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        T
                    </div>
                    {(!collapsed || isMobile) && (
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                Tutor
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                tutor@uni.ac.za
                            </p>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition w-full"
                >
                    <span className="material-icons-round text-xl flex-shrink-0">
                        logout
                    </span>
                    {(!collapsed || isMobile) && <span>Log out</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="h-screen flex overflow-hidden bg-bg-light">
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <SidebarContent isMobile />
            </aside>

            {/* Desktop sidebar */}
            <aside
                className={`hidden lg:flex flex-col flex-shrink-0 bg-white border-r border-gray-100 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-64"
                    }`}
            >
                <SidebarContent />
            </aside>

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 transition"
                        >
                            <span className="material-icons-round text-2xl">menu</span>
                        </button>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex text-gray-400 hover:text-gray-600 transition"
                        >
                            <span className="material-icons-round text-xl">
                                {collapsed ? "menu_open" : "menu"}
                            </span>
                        </button>
                        <div className="hidden sm:flex items-center relative">
                            <span className="material-icons-round absolute left-3 text-gray-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search students, sessions…"
                                className="pl-10 pr-4 py-2 w-72 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tutor/20 focus:border-tutor focus:bg-white transition"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition">
                            <span className="material-icons-round text-xl">
                                notifications
                            </span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <Link
                            to="/tutor/dashboard/settings"
                            className="w-9 h-9 rounded-full bg-gradient-to-br from-tutor to-tutor-light flex items-center justify-center text-white text-sm font-bold"
                        >
                            T
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
