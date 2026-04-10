import { Router, Request, Response } from "express";
import { PrismaClient, JobStatus } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET /api/jobs
router.get("/", async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { userId: String(req.userId) },
      include: { client: true, invoice: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(jobs);
  } catch {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const job = await prisma.job.findFirst({
      where: { id: String(req.params.id), userId: String(req.userId) },
      include: { client: true, invoice: true },
    });
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }
    res.json(job);
  } catch {
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

// POST /api/jobs — create a job and auto-create invoice
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, status, amount, date, clientId } = req.body;
    if (!title || !clientId) {
      res.status(400).json({ error: "Title and clientId are required" });
      return;
    }

    // Verify client belongs to this user
    const client = await prisma.client.findFirst({
      where: { id: String(clientId), userId: String(req.userId) },
    });
    if (!client) { res.status(404).json({ error: "Client not found" }); return; }

    const job = await prisma.job.create({
      data: {
        userId: String(req.userId),
        title,
        description,
        status: (status as JobStatus) || "PENDING",
        amount: amount || 0,
        date: date ? new Date(date) : new Date(),
        clientId,
        invoice: {
          create: {
            userId: String(req.userId),
            amount: amount || 0,
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: { client: true, invoice: true },
    });
    res.status(201).json(job);
  } catch {
    res.status(500).json({ error: "Failed to create job" });
  }
});

// PUT /api/jobs/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { title, description, status, amount, date, clientId } = req.body;
    const id = String(req.params.id);
    const existing = await prisma.job.findFirst({
      where: { id, userId: String(req.userId) },
      include: { invoice: true },
    });
    if (!existing) { res.status(404).json({ error: "Job not found" }); return; }

    const job = await prisma.job.update({
      where: { id },
      data: {
        title,
        description,
        status: status as JobStatus,
        amount,
        date: date ? new Date(date) : undefined,
        clientId,
      },
      include: { client: true, invoice: true },
    });

    // Keep invoice amount in sync
    if (amount !== undefined && existing.invoice) {
      await prisma.invoice.update({
        where: { id: existing.invoice.id },
        data: { amount },
      });
    }

    res.json(job);
  } catch {
    res.status(500).json({ error: "Failed to update job" });
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.job.findFirst({
      where: { id, userId: String(req.userId) },
    });
    if (!existing) { res.status(404).json({ error: "Job not found" }); return; }
    await prisma.job.delete({ where: { id } });
    res.json({ message: "Job deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

export default router;
