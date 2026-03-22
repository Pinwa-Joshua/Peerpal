export default function AdminSettings() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">System Configuration</h1>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                <span className="material-icons-round text-slate-300 text-5xl mb-3 block">settings_applications</span>
                <h3 className="text-lg font-medium text-slate-900">Global Settings</h3>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">Update university lists, course catalogs, platform commission rates, and notification banners here.</p>
            </div>
        </div>
    );
}