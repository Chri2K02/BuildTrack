import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useApi, DashboardStats, Job, Invoice } from "../lib/api";
import { jobStatusBadge, invoiceStatusBadge } from "../components/Badge";
import {
  ArrowRight,
  ChevronRight,
  Plus,
  CheckCircle2,
  Circle,
  Briefcase,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-lg border p-5 ${accent ? "bg-[#0d1117] border-transparent" : "bg-white border-gray-200"}`}>
      <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${accent ? "text-gray-500" : "text-gray-400"}`}>
        {label}
      </p>
      <p className={`text-2xl font-bold ${accent ? "text-white" : "text-gray-900"}`}>{value}</p>
      <p className={`text-xs mt-1 ${accent ? "text-gray-600" : "text-gray-400"}`}>{sub}</p>
    </div>
  );
}

export default function Dashboard() {
  const api = useApi();
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStats(), api.getJobs(), api.getInvoices()])
      .then(([s, jobs, invoices]) => {
        setStats(s);
        setAllJobs(jobs);
        setRecentJobs(jobs.slice(0, 5));
        setRecentInvoices(invoices.filter((i) => i.status !== "PAID").slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = isLoaded ? (user?.firstName ?? "") : "";

  const hasJobs = (stats?.totalJobs ?? 0) > 0;
  const pending = allJobs.filter((j) => j.status === "PENDING").length;
  const inProgress = allJobs.filter((j) => j.status === "IN_PROGRESS").length;
  const completed = allJobs.filter((j) => j.status === "COMPLETED").length;

  // Getting started steps
  const steps = [
    { label: "Create your account", done: true },
    { label: "Add your first client", done: (stats?.totalJobs ?? 0) > 0 || recentJobs.length > 0, to: "/clients" },
    { label: "Log your first job", done: (stats?.totalJobs ?? 0) > 0, to: "/jobs" },
    { label: "Mark an invoice as paid", done: (stats?.outstandingInvoices ?? 0) < (stats?.totalJobs ?? 0) && (stats?.totalJobs ?? 0) > 0, to: "/invoices" },
  ];
  const allDone = steps.every((s) => s.done);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-lg" />)}
        </div>
        <div className="h-64 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Overview</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/clients"
            className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus size={14} /> Client
          </Link>
          <Link
            to="/jobs"
            className="flex items-center gap-1.5 bg-[#0d1117] text-white text-sm font-semibold px-3.5 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={14} /> Log Job
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Jobs" value={stats?.totalJobs ?? 0} sub="all time" />
        <StatCard label="Revenue" value={fmt(stats?.totalRevenue ?? 0)} sub="across all jobs" accent />
        <StatCard label="Unpaid" value={stats?.outstandingInvoices ?? 0} sub="invoices pending" />
        <StatCard label="Owed" value={fmt(stats?.outstandingAmount ?? 0)} sub="awaiting payment" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-5">

        {/* Recent Jobs — takes 2/3 */}
        <div className="col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Briefcase size={15} className="text-gray-400" />
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Recent Jobs</p>
            </div>
            <Link to="/jobs" className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-0.5">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          {recentJobs.length === 0 ? (
            <div className="px-5 py-6 space-y-3">
              {/* Skeleton rows to fill space */}
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-4">Sample data — add your first job</p>
              {[
                { title: "Kitchen remodel", client: "Mike Johnson", status: "IN_PROGRESS", amount: 8400 },
                { title: "Roof repair", client: "Sarah K.", status: "COMPLETED", amount: 3200 },
                { title: "Deck build", client: "R. Torres", status: "PENDING", amount: 5600 },
                { title: "Bathroom tile", client: "L. Graham", status: "PENDING", amount: 2100 },
              ].map((j) => (
                <div key={j.title} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 opacity-30">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{j.title}</p>
                    <p className="text-xs text-gray-400">{j.client}</p>
                  </div>
                  {jobStatusBadge(j.status)}
                  <span className="text-sm font-bold text-gray-800">{fmt(j.amount)}</span>
                </div>
              ))}
              <Link
                to="/jobs"
                className="mt-2 flex items-center justify-center gap-2 w-full border border-dashed border-gray-300 text-gray-400 hover:border-orange-400 hover:text-orange-500 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={14} /> Log your first real job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentJobs.map((j) => (
                <div key={j.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{j.title}</p>
                    <p className="text-xs text-gray-400 truncate">{j.client?.name ?? "—"}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {jobStatusBadge(j.status)}
                    <span className="text-sm font-bold text-gray-900 w-20 text-right">{fmt(j.amount)}</span>
                  </div>
                </div>
              ))}
              <div className="px-5 py-3 bg-gray-50">
                <Link to="/jobs" className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-medium">
                  <Plus size={12} /> Log another job <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="col-span-1 space-y-5">

          {/* Job Pipeline */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-gray-400" />
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Pipeline</p>
            </div>
            {!hasJobs ? (
              <div className="space-y-2.5">
                {[
                  { label: "Pending", count: 0, color: "bg-amber-400" },
                  { label: "In Progress", count: 0, color: "bg-blue-500" },
                  { label: "Completed", count: 0, color: "bg-emerald-500" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${s.color} opacity-30`} />
                      <span className="text-sm text-gray-400">{s.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-300">—</span>
                  </div>
                ))}
                <div className="h-2 bg-gray-100 rounded-full mt-3 opacity-50" />
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  { label: "Pending", count: pending, color: "bg-amber-400" },
                  { label: "In Progress", count: inProgress, color: "bg-blue-500" },
                  { label: "Completed", count: completed, color: "bg-emerald-500" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${s.color}`} />
                      <span className="text-sm text-gray-600">{s.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{s.count}</span>
                  </div>
                ))}
                <div className="flex gap-0.5 h-2 rounded-full overflow-hidden mt-3">
                  {pending > 0 && <div className="bg-amber-400" style={{ width: `${(pending / allJobs.length) * 100}%` }} />}
                  {inProgress > 0 && <div className="bg-blue-500" style={{ width: `${(inProgress / allJobs.length) * 100}%` }} />}
                  {completed > 0 && <div className="bg-emerald-500" style={{ width: `${(completed / allJobs.length) * 100}%` }} />}
                </div>
              </div>
            )}
          </div>

          {/* Unpaid Invoices */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-gray-400" />
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Unpaid</p>
              </div>
              <Link to="/invoices" className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                View all
              </Link>
            </div>
            {recentInvoices.length === 0 ? (
              <div className="px-5 py-5 text-center">
                <p className="text-xs text-gray-400">No unpaid invoices.</p>
                <p className="text-xs text-emerald-500 font-medium mt-0.5">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-gray-800 truncate">{inv.job?.title ?? "—"}</p>
                      <p className="text-xs text-gray-400 truncate">{inv.job?.client?.name ?? "—"}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {invoiceStatusBadge(inv.status)}
                      <span className="text-xs font-bold text-gray-800">{fmt(inv.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Getting started checklist */}
          {!allDone && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Getting Started</p>
              </div>
              <div className="px-5 py-4 space-y-3">
                {steps.map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    {s.done ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : (
                      <Circle size={16} className="text-gray-300 shrink-0" />
                    )}
                    {!s.done && s.to ? (
                      <Link to={s.to} className="text-sm text-orange-500 hover:underline font-medium">
                        {s.label}
                      </Link>
                    ) : (
                      <span className={`text-sm ${s.done ? "text-gray-400 line-through" : "text-gray-700 font-medium"}`}>
                        {s.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick links */}
          <div className="bg-[#0d1117] rounded-lg p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">Quick Add</p>
            <div className="space-y-2">
              <Link to="/clients" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group">
                <div className="flex items-center gap-2.5">
                  <Users size={14} className="text-orange-400" />
                  <span className="text-sm text-gray-300 font-medium">New client</span>
                </div>
                <ArrowRight size={13} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </Link>
              <Link to="/jobs" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group">
                <div className="flex items-center gap-2.5">
                  <Briefcase size={14} className="text-orange-400" />
                  <span className="text-sm text-gray-300 font-medium">Log a job</span>
                </div>
                <ArrowRight size={13} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </Link>
              <Link to="/invoices" className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group">
                <div className="flex items-center gap-2.5">
                  <FileText size={14} className="text-orange-400" />
                  <span className="text-sm text-gray-300 font-medium">View invoices</span>
                </div>
                <ArrowRight size={13} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
