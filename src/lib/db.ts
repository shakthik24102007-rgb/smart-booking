import fs from "fs";
import path from "path";
import type { Database } from "./types";
import { getSeedData } from "./seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

function ensureDb(): Database {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const seed = getSeedData();
    fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), "utf-8");
    return seed;
  }

  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as Database;
}

export function readDb(): Database {
  return ensureDb();
}

export function writeDb(data: Database): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function updateDb(mutator: (db: Database) => void): Database {
  const db = readDb();
  mutator(db);
  writeDb(db);
  return db;
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
