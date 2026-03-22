import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ─── admin nav items ─── */
const NAV_ITEMS = [
    { to: "/admin/dashboard", icon: "dashboard", label: "Dashboard", end: true },
    { to: "/admin/dashboard/users", icon: "manage_accounts", label: "User Management" },
    { to: "/admin/dashboard/sessions", icon: "gavel", label: "Sessions & Disputes" },
    { to: "/admin/dashboard/payouts", icon: "account_balance", label: "Financials" },
    { to: "/admin/dashboard/settings", icon: "settings_applications", label: "System Config" },
];

export default function AdminDashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    /* shared link classes */
    const linkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
            ? "bg-purple-50 text-purple-700 font-semibold"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        }`;

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full bg-white border-r border-gray-100">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 h-16 flex-shrink-0 border-b border-gray-100">
                <img src="/icon.png" alt="PeerPal Admin" className="h-8 w-auto flex-shrink-0" />
                {(!collapsed || isMobile) && (
                    <span className="text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
                        PeerPal Admin
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
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-700 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        A
                    </div>
                    {(!collapsed || isMobile) && (
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                Admin User
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                admin@peerpal.com
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
            {/* ── Mobile backdrop ── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── Mobile drawer ── */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <SidebarContent isMobile />
            </aside>

            {/* ── Desktop sidebar ── */}
            <aside
                className={`hidden lg:flex flex-col flex-shrink-0 bg-white border-r border-gray-100 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-64"
                    }`}
            >
                <SidebarContent />
            </aside>

            {/* ── Main area ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 transition"
                        >
                            <span className="material-icons-round text-2xl">menu</span>
                        </button>
                        {/* Desktop collapse toggle */}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden lg:flex text-gray-400 hover:text-gray-600 transition"
                        >
                            <span className="material-icons-round text-xl">
                                {collapsed ? "menu_open" : "menu"}
                            </span>
                        </button>
                        {/* Search */}
                        <div className="hidden sm:flex items-center relative">
                            <span className="material-icons-round absolute left-3 text-gray-400 text-lg">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="pl-10 pr-4 py-2 w-72 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700 focus:bg-white transition"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition">
                            <span className="material-icons-round text-xl">
                                notifications
                            </span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        </button>
                        {/* Avatar */}
                        <Link
                            to="/admin/dashboard/settings"
                            className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-700 to-indigo-600 flex items-center justify-center text-white text-sm font-bold"
                        >
                            A
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
