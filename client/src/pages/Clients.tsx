import { useEffect, useState } from "react";
import { useApi, Client } from "../lib/api";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

const emptyForm = { name: "", email: "", phone: "", address: "" };

export default function Clients() {
  const api = useApi();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const data = await api.getClients();
    setClients(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  }

  function openEdit(c: Client) {
    setEditing(c);
    setForm({ name: c.name, email: c.email ?? "", phone: c.phone ?? "", address: c.address ?? "" });
    setError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    try {
      editing ? await api.updateClient(editing.id, form) : await api.createClient(form);
      setShowModal(false);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this client and all their jobs?")) return;
    await api.deleteClient(id);
    load();
  }

  if (loading) return <div className="text-gray-400 text-sm p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Clients</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {clients.length > 0 ? `${clients.length} Client${clients.length !== 1 ? "s" : ""}` : "Clients"}
          </h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#0d1117] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <Plus size={15} /> New Client
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {clients.length === 0 ? (
          <EmptyState
            icon={<Users size={22} />}
            title="No clients yet"
            description="Add a client to start tracking jobs and sending invoices."
            action={
              <button
                onClick={openCreate}
                className="flex items-center gap-2 bg-[#0d1117] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                <Plus size={14} /> Add your first client
              </button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-5 gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <div className="col-span-2">Name</div>
              <div>Email</div>
              <div>Phone</div>
              <div className="text-right">Jobs</div>
            </div>
            <div className="divide-y divide-gray-50">
              {clients.map((c) => (
                <div key={c.id} className="grid grid-cols-5 gap-4 items-center px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                      <span className="text-orange-600 font-bold text-xs">
                        {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-sm text-gray-800">{c.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">{c.email || "—"}</div>
                  <div className="text-sm text-gray-500">{c.phone || "—"}</div>
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-sm font-semibold text-gray-800">{c.jobs?.length ?? 0}</span>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={13} />
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
        <Modal title={editing ? "Edit Client" : "New Client"} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name *</label>
              <input
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Mike Johnson"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="mike@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Address</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-50"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 Maple St, Springfield"
              />
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
                {saving ? "Saving..." : editing ? "Save Changes" : "Add Client"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
