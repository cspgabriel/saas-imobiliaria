import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "./src/lib/prisma.js";

// SECURITY: minimal auth middleware skeleton. Verifies a Firebase ID token sent in
// the Authorization: Bearer <token> header. TODO: wire up firebase-admin SDK and
// initialize with service-account credentials, then call admin.auth().verifyIdToken(token).
// Until firebase-admin is wired, this middleware enforces presence of the header to
// block fully-anonymous calls to expensive Gemini endpoints.
async function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      return res.status(401).json({ error: "Missing Bearer token." });
    }
    // TODO: const decoded = await admin.auth().verifyIdToken(match[1]);
    // (req as any).user = decoded;
    // For now, reject obviously invalid tokens (too short) but allow others through
    // so existing flows don't break before firebase-admin is added.
    if (match[1].length < 20) {
      return res.status(401).json({ error: "Invalid token." });
    }
    next();
  } catch (err: any) {
    return res.status(401).json({ error: "Auth failed: " + (err?.message || "unknown") });
  }
}

export const app = express();

async function startServer() {
  const PORT = 3000;

  app.use(express.json({ limit: "32kb" })); // SECURITY: bound request size

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Agency MySQL CRUD
  app.get("/api/agencies/subdomain/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const agency = await prisma.agency.findUnique({
        where: { subdomain: slug },
      });
      if (!agency) return res.status(404).json({ error: "Agency not found" });
      res.json(agency);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/agencies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const agency = await prisma.agency.findUnique({
        where: { id },
      });
      if (!agency) return res.status(404).json({ error: "Agency not found" });
      res.json(agency);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/agencies", async (req, res) => {
    try {
      const { name, subdomain, ownerId, plan } = req.body;
      const agency = await prisma.agency.upsert({
        where: { subdomain },
        update: { name, ownerId, plan: plan || "trial" },
        create: { name, subdomain, ownerId, plan: plan || "trial" },
      });
      res.json(agency);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Property MySQL CRUD
  app.get("/api/properties", async (req, res) => {
    try {
      const { agencyId } = req.query;
      if (!agencyId) return res.status(400).json({ error: "agencyId is required" });
      const properties = await prisma.property.findMany({
        where: { agencyId: String(agencyId) },
        orderBy: { createdAt: "desc" },
      });
      res.json(properties);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const property = await prisma.property.findUnique({
        where: { id },
      });
      if (!property) return res.status(404).json({ error: "Property not found" });
      res.json(property);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const {
        id,
        title,
        description,
        price,
        type,
        status,
        city,
        neighborhood,
        bedrooms,
        bathrooms,
        area,
        imageUrl,
        agencyId,
      } = req.body;
      if (!agencyId) return res.status(400).json({ error: "agencyId is required" });

      if (id) {
        const property = await prisma.property.update({
          where: { id },
          data: {
            title,
            description,
            price: Number(price),
            type,
            status,
            city,
            neighborhood,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            area: Number(area),
            imageUrl,
          },
        });
        return res.json(property);
      } else {
        const property = await prisma.property.create({
          data: {
            title,
            description,
            price: Number(price),
            type,
            status,
            city,
            neighborhood,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            area: Number(area),
            imageUrl: imageUrl || "",
            agencyId,
          },
        });
        return res.json(property);
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await prisma.property.delete({
        where: { id },
      });
      res.json({ success: true });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/generate-ad", requireAuth, async (req, res) => {
    try {
      const { prompt } = req.body;
      // SECURITY: validate prompt shape to limit abuse / cost.
      if (typeof prompt !== "string" || prompt.length === 0 || prompt.length > 4000) {
        return res.status(400).json({ error: "Invalid prompt." });
      }
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set." });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });

      res.json({ ad: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message || "Faied to generate ad." });
    }
  });

  // On Vercel, routes above are registered on the exported `app`; the dev
  // server (vite middleware + listen) must NOT run.
  if (process.env.VERCEL) return;

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
