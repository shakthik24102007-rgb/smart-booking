import { getSeedData } from "../src/lib/seed";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

fs.writeFileSync(DB_PATH, JSON.stringify(getSeedData(), null, 2), "utf-8");
console.log("Database seeded at", DB_PATH);
