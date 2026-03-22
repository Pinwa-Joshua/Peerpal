export default function AdminSessions() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Sessions & Disputes</h1>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                <span className="material-icons-round text-slate-300 text-5xl mb-3 block">gavel</span>
                <h3 className="text-lg font-medium text-slate-900">Dispute Resolution</h3>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">This area will be used to monitor session statuses and mediate reported issues between students and tutors.</p>
            </div>
        </div>
    );
}