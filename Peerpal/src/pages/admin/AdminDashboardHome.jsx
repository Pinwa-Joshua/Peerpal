import { Link } from "react-router-dom";

const STATS = [
    { label: "Total Users", value: "2,543", change: "+12%", changeType: "positive", icon: "people", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Tutors", value: "312", change: "+5%", changeType: "positive", icon: "school", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Gross Platform Volume", value: "₦245,000", change: "+18%", changeType: "positive", icon: "account_balance", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active Disputes", value: "4", change: "-2", changeType: "positive", icon: "gavel", color: "text-rose-600", bg: "bg-rose-50" },
];

const RECENT_ACTIVITY = [
    { id: 1, user: "Sipho N.", action: "Requested Payout", amount: "₦1,200", time: "10 mins ago", status: "Pending" },
    { id: 2, user: "Liam T.", action: "Reported Session #4592", amount: "-", time: "1 hr ago", status: "Action Required" },
    { id: 3, user: "Zanele D.", action: "Tutor Application Submitted", amount: "-", time: "2 hrs ago", status: "Under Review" },
    { id: 4, user: "Amara L.", action: "Completed 50th Session", amount: "-", time: "5 hrs ago", status: "Automated" },
];

export default function AdminDashboardHome() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time metrics and system health.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm">
                        Download Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                            </div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <span className="material-icons-round">{stat.icon}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5">
                            <span className={`text-xs font-semibold ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.change}
                            </span>
                            <span className="text-xs text-slate-400">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart placeholder (spanning 2 columns) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Revenue Growth</h3>
                        <select className="text-sm border-slate-200 rounded-lg text-slate-600 bg-slate-50 px-3 py-1.5 outline-none">
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="flex-1 min-h-[250px] bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center border-dashed">
                        <div className="text-center">
                            <span className="material-icons-round text-slate-300 text-4xl mb-2">bar_chart</span>
                            <p className="text-sm text-slate-400">Chart Visualization Area</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">System Activity</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="divide-y divide-slate-100">
                            {RECENT_ACTIVITY.map((item) => (
                                <div key={item.id} className="p-4 hover:bg-slate-50 transition cursor-pointer">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className="text-sm font-semibold text-slate-900">{item.action}</p>
                                        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{item.time}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-slate-500">User: <span className="font-medium">{item.user}</span></p>
                                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full 
                                            ${item.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                item.status === 'Action Required' ? 'bg-rose-100 text-rose-700' :
                                                    item.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-600'}`
                                        }>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-3 border-t border-slate-100 bg-slate-50 mt-auto">
                        <Link to="/admin/dashboard/users" className="text-sm font-medium text-purple-600 hover:text-purple-700 w-full text-center block">
                            View All Activity
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}