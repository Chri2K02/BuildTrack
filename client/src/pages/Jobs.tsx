import { useEffect, useState } from "react";
import { useApi, Job, Client, JobStatus } from "../lib/api";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import { jobStatusBadge } from "../components/Badge";
import { Plus, Pencil, Trash2, Briefcase } from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  status: "PENDING" as JobStatus,
  amount: "",
  date: new Date().toISOString().split("T")[0],
  clientId: "",
};

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Jobs() {
  const api = useApi();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<JobStatus | "ALL">("ALL");

  async function load() {
    setLoading(true);
    const [j, c] = await Promise.all([api.getJobs(), api.getClients()]);
    setJobs(j);
    setClients(c);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, clientId: clients[0]?.id ?? "" });
    setError("");
    setShowModal(true);
  }

  function openEdit(j: Job) {
    setEditing(j);
    setForm({
      title: j.title,
      description: j.description ?? "",
      status: j.status,
      amount: String(j.amount),
      date: j.date.split("T")[0],
      clientId: j.clientId,
    });
    setError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.clientId) { setError("Title and client are required"); return; }
    setSaving(true);
    try {
      const data = { ...form, amount: parseFloat(form.amount) || 0 };
      editing ? await api.updateJob(editing.id, data) : await api.createJob(data);
      setShowModal(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this job and its invoice?")) return;
    await api.deleteJob(id);
    load();
  }

  const filtered = filter === "ALL" ? jobs : jobs.filter((j) => j.status === filter);

  if (loading) return <div className="text-gray-400 text-sm p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Jobs</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {jobs.length > 0 ? `${jobs.length} Job${jobs.length !== 1 ? "s" : ""}` : "Jobs"}
          </h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#0d1117] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <Plus size={15} /> Log a Job
        </button>
      </div>

      {/* Filter tabs */}
      {jobs.length > 0 && (
        <div className="flex gap-1.5">
          {(["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"] as const).map((s) => {
            const count = s === "ALL" ? jobs.length : jobs.filter((j) => j.status === s).length;
            const label = s === "ALL" ? "All" : s === "IN_PROGRESS" ? "In Progress" : s.charAt(0) + s.slice(1).toLowerCase();
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  filter === s
                    ? "bg-[#0d1117] text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {label} <span className="opacity-50 ml-1">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {jobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={22} />}
            title="No jobs logged"
            description="Log a job to start tracking work and generating invoices automatically."
            action={
              clients.length === 0 ? (
                <p className="text-xs text-gray-400">Add a client first, then log a job.</p>
              ) : (
                <button
                  onClick={openCreate}
                  className="flex items-center gap-2 bg-[#0d1117] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  <Plus size={14} /> Log your first job
                </button>
              )
            }
          />
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No jobs with this status.</div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <div className="col-span-4">Job</div>
              <div className="col-span-2">Client</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            <div className="divide-y divide-gray-50">
              {filtered.map((j) => (
                <div key={j.id} className="grid grid-cols-12 gap-4 items-center px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                  <div className="col-span-4">
                    <p className="text-sm font-semibold text-gray-800">{j.title}</p>
                    {j.description && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{j.description}</p>
                    )}
                  </div>
                  <div className="col-span-2 text-sm text-gray-500 truncate">{j.client?.name ?? "—"}</div>
                  <div className="col-span-2">{jobStatusBadge(j.status)}</div>
                  <div className="col-span-2 text-xs text-gray-400">
                    {new Date(j.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className="text-sm font-bold text-gray-900">{fmt(j.amount)}</span>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(j)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => handleDelete(j.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? "Edit Job" : "Log a Job"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Job Title *</label>
              <input
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Roof repair, kitchen remodel..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Client *</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              >
                <option value="">Select client...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Scope of Work</label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Materials, labor, notes..."
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as JobStatus })}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#0d1117] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Log Job"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
