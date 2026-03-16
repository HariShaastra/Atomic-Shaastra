import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("atomic_shaastra.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS identities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    daily_target TEXT,
    difficulty TEXT,
    description TEXT,
    cue TEXT,
    reward TEXT,
    identity_id INTEGER,
    stack_after_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(identity_id) REFERENCES identities(id)
  );

  CREATE TABLE IF NOT EXISTS habit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER NOT NULL,
    completed_at DATE NOT NULL,
    FOREIGN KEY(habit_id) REFERENCES habits(id)
  );

  CREATE TABLE IF NOT EXISTS reflections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    easiest_habit TEXT,
    difficult_habit TEXT,
    consistency_insight TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS experiments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT DEFAULT 'active',
    summary TEXT
  );

  CREATE TABLE IF NOT EXISTS experiment_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    experiment_id INTEGER NOT NULL,
    date DATE NOT NULL,
    note TEXT,
    FOREIGN KEY(experiment_id) REFERENCES experiments(id)
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // --- API Routes ---

  // Identities
  app.get("/api/identities", (req, res) => {
    const rows = db.prepare("SELECT * FROM identities").all();
    res.json(rows);
  });

  app.post("/api/identities", (req, res) => {
    const { name, description } = req.body;
    const info = db.prepare("INSERT INTO identities (name, description) VALUES (?, ?)").run(name, description);
    res.json({ id: info.lastInsertRowid });
  });

  // Habits
  app.get("/api/habits", (req, res) => {
    const rows = db.prepare(`
      SELECT h.*, i.name as identity_name 
      FROM habits h 
      LEFT JOIN identities i ON h.identity_id = i.id
    `).all();
    res.json(rows);
  });

  app.post("/api/habits", (req, res) => {
    const { name, category, daily_target, difficulty, description, cue, reward, identity_id, stack_after_id } = req.body;
    const info = db.prepare(`
      INSERT INTO habits (name, category, daily_target, difficulty, description, cue, reward, identity_id, stack_after_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, category, daily_target, difficulty, description, cue, reward, identity_id, stack_after_id);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/habits/:id", (req, res) => {
    db.prepare("DELETE FROM habits WHERE id = ?").run(req.params.id);
    db.prepare("DELETE FROM habit_logs WHERE habit_id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Habit Logs
  app.get("/api/habit-logs", (req, res) => {
    const rows = db.prepare("SELECT * FROM habit_logs").all();
    res.json(rows);
  });

  app.post("/api/habit-logs", (req, res) => {
    const { habit_id, completed_at } = req.body;
    // Check if already logged for this date
    const existing = db.prepare("SELECT id FROM habit_logs WHERE habit_id = ? AND completed_at = ?").get(habit_id, completed_at);
    if (existing) {
      db.prepare("DELETE FROM habit_logs WHERE id = ?").run(existing.id);
      return res.json({ status: "removed" });
    }
    const info = db.prepare("INSERT INTO habit_logs (habit_id, completed_at) VALUES (?, ?)").run(habit_id, completed_at);
    res.json({ id: info.lastInsertRowid, status: "added" });
  });

  // Reflections
  app.get("/api/reflections", (req, res) => {
    const rows = db.prepare("SELECT * FROM reflections ORDER BY date DESC").all();
    res.json(rows);
  });

  app.post("/api/reflections", (req, res) => {
    const { date, easiest_habit, difficult_habit, consistency_insight } = req.body;
    const info = db.prepare(`
      INSERT INTO reflections (date, easiest_habit, difficult_habit, consistency_insight) 
      VALUES (?, ?, ?, ?)
    `).run(date, easiest_habit, difficult_habit, consistency_insight);
    res.json({ id: info.lastInsertRowid });
  });

  // Experiments
  app.get("/api/experiments", (req, res) => {
    const rows = db.prepare("SELECT * FROM experiments").all();
    res.json(rows);
  });

  app.post("/api/experiments", (req, res) => {
    const { name, duration_days, start_date } = req.body;
    const info = db.prepare("INSERT INTO experiments (name, duration_days, start_date) VALUES (?, ?, ?)").run(name, duration_days, start_date);
    res.json({ id: info.lastInsertRowid });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
