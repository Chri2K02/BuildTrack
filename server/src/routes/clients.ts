import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// GET /api/clients
router.get("/", async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      where: { userId: String(req.userId) },
      include: { jobs: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(clients);
  } catch {
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// GET /api/clients/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const client = await prisma.client.findFirst({
      where: { id: String(req.params.id), userId: String(req.userId) },
      include: { jobs: { include: { invoice: true } } },
    });
    if (!client) { res.status(404).json({ error: "Client not found" }); return; }
    res.json(client);
  } catch {
    res.status(500).json({ error: "Failed to fetch client" });
  }
});

// POST /api/clients
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name) { res.status(400).json({ error: "Name is required" }); return; }
    const client = await prisma.client.create({
      data: { userId: String(req.userId), name, email, phone, address },
    });
    res.status(201).json(client);
  } catch {
    res.status(500).json({ error: "Failed to create client" });
  }
});

// PUT /api/clients/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;
    const id = String(req.params.id);
    const existing = await prisma.client.findFirst({
      where: { id, userId: String(req.userId) },
    });
    if (!existing) { res.status(404).json({ error: "Client not found" }); return; }
    const client = await prisma.client.update({
      where: { id },
      data: { name, email, phone, address },
    });
    res.json(client);
  } catch {
    res.status(500).json({ error: "Failed to update client" });
  }
});

// DELETE /api/clients/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.client.findFirst({
      where: { id, userId: String(req.userId) },
    });
    if (!existing) { res.status(404).json({ error: "Client not found" }); return; }
    await prisma.client.delete({ where: { id } });
    res.json({ message: "Client deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete client" });
  }
});

export default router;
