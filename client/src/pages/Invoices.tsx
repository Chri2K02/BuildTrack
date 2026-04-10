import { useEffect, useState } from "react";
import { useApi, Invoice, InvoiceStatus } from "../lib/api";
import EmptyState from "../components/EmptyState";
import { invoiceStatusBadge } from "../components/Badge";
import { FileText } from "lucide-react";

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Invoices() {
  const api = useApi();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<InvoiceStatus | "ALL">("ALL");

  async function load() {
    setLoading(true);
    const data = await api.getInvoices();
    setInvoices(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function markStatus(id: string, status: InvoiceStatus) {
    setUpdating(id);
    try {
      await api.updateInvoice(id, { status });
      load();
    } finally {
      setUpdating(null);
    }
  }

  const filtered = filter === "ALL" ? invoices : invoices.filter((i) => i.status === filter);
  const totalOutstanding = invoices
    .filter((i) => i.status !== "PAID")
    .reduce((s, i) => s + i.amount, 0);

  if (loading) return <div className="text-gray-400 text-sm p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Invoices</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {invoices.length > 0 ? `${invoices.length} Invoice${invoices.length !== 1 ? "s" : ""}` : "Invoices"}
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">Auto-generated when you log a job.</p>
        </div>
        {totalOutstanding > 0 && (
          <div className="bg-[#0d1117] rounded-lg px-5 py-3 text-right">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">Outstanding</p>
            <p className="text-white text-xl font-bold mt-0.5">{fmt(totalOutstanding)}</p>
          </div>
        )}
      </div>

      {/* Filter */}
      {invoices.length > 0 && (
        <div className="flex gap-1.5">
          {(["ALL", "UNPAID", "OVERDUE", "PAID"] as const).map((s) => {
            const count = s === "ALL" ? invoices.length : invoices.filter((i) => i.status === s).length;
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
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}{" "}
                <span className="opacity-50 ml-1">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {invoices.length === 0 ? (
          <EmptyState
            icon={<FileText size={22} />}
            title="No invoices yet"
            description="Invoices are created automatically when you log a job."
          />
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">No invoices with this status.</div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <div className="col-span-3">Job</div>
              <div className="col-span-2">Client</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Due Date</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-1" />
            </div>
            <div className="divide-y divide-gray-50">
              {filtered.map((inv) => {
                const isOverdue = inv.status !== "PAID" && new Date(inv.dueDate) < new Date();
                return (
                  <div key={inv.id} className="grid grid-cols-12 gap-4 items-center px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                    <div className="col-span-3 font-semibold text-sm text-gray-800 truncate">
                      {inv.job?.title ?? "—"}
                    </div>
                    <div className="col-span-2 text-sm text-gray-500 truncate">{inv.job?.client?.name ?? "—"}</div>
                    <div className="col-span-2">{invoiceStatusBadge(inv.status)}</div>
                    <div className="col-span-2">
                      <span className={`text-xs font-medium ${isOverdue ? "text-red-500" : "text-gray-400"}`}>
                        {new Date(inv.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {isOverdue && <span className="ml-1">· Late</span>}
                      </span>
                    </div>
                    <div className="col-span-2 text-right font-bold text-gray-900 text-sm">{fmt(inv.amount)}</div>
                    <div className="col-span-1 flex justify-end">
                      <select
                        disabled={updating === inv.id}
                        value={inv.status}
                        onChange={(e) => markStatus(inv.id, e.target.value as InvoiceStatus)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-600 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange-400 disabled:opacity-40 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <option value="UNPAID">Unpaid</option>
                        <option value="PAID">Paid</option>
                        <option value="OVERDUE">Overdue</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
