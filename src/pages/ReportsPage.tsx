import ReportForm from "../components/reports/ReportForm";
function ReportsPage() {
  return <div className="mx-auto max-w-3xl space-y-5"><section className="border-b border-slate-200 pb-5"><p className="text-sm font-medium text-slate-500">Field reporting</p><h1 className="mt-1 text-2xl font-semibold text-slate-900">Report an incident</h1><p className="mt-1.5 text-sm leading-6 text-slate-600">Share what you see. Reports are reviewed by an operations team before they are verified.</p></section><ReportForm /></div>;
}

export default ReportsPage;
