import ReportForm from "../components/reports/ReportForm";
function ReportsPage() {
  return <div className="mx-auto max-w-3xl space-y-6"><section><p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-400">Field reporting</p><h1 className="mt-2 text-2xl font-bold">Report an incident</h1><p className="mt-2 text-sm text-slate-400">New reports are queued as reported and require operator verification.</p></section><ReportForm /></div>;
}

export default ReportsPage;
