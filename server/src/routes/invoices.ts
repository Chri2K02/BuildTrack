import { Router, Request, Response } from "express";
import { PrismaClient, InvoiceStatus } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET /api/invoices
router.get("/", async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId: String(req.userId) },
      include: { job: { include: { client: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(invoices);
  } catch {
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

// GET /api/invoices/stats/summary — dashboard stats (must be before /:id)
router.get("/stats/summary", async (req: Request, res: Response) => {
  try {
    const [jobs, invoices] = await Promise.all([
      prisma.job.findMany({ where: { userId: String(req.userId) } }),
      prisma.invoice.findMany({ where: { userId: String(req.userId) } }),
    ]);

    const totalJobs = jobs.length;
    const totalRevenue = jobs.reduce((sum, j) => sum + j.amount, 0);
    const outstanding = invoices.filter(
      (i) => i.status === "UNPAID" || i.status === "OVERDUE"
    );
    const outstandingInvoices = outstanding.length;
    const outstandingAmount = outstanding.reduce((sum, i) => sum + i.amount, 0);

    res.json({ totalJobs, totalRevenue, outstandingInvoices, outstandingAmount });
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// GET /api/invoices/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: String(req.params.id), userId: String(req.userId) },
      include: { job: { include: { client: true } } },
    });
    if (!invoice) { res.status(404).json({ error: "Invoice not found" }); return; }
    res.json(invoice);
  } catch {
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
});

// PUT /api/invoices/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { status, dueDate } = req.body;
    const id = String(req.params.id);
    const existing = await prisma.invoice.findFirst({
      where: { id, userId: String(req.userId) },
    });
    if (!existing) { res.status(404).json({ error: "Invoice not found" }); return; }
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: status as InvoiceStatus,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
      include: { job: { include: { client: true } } },
    });
    res.json(invoice);
  } catch {
    res.status(500).json({ error: "Failed to update invoice" });
  }
});

export default router;
