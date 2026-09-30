import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await Database.load("sqlite:bluepage.db");
    await db.execute("PRAGMA journal_mode = WAL;");
    await db.execute("PRAGMA foreign_keys = ON;");
    await db.execute("PRAGMA synchronous = NORMAL;");
    await db.execute("PRAGMA busy_timeout = 5000;");
    await db.execute("PRAGMA cache_size = -64000;");
    await db.execute("PRAGMA temp_store = MEMORY;");
    await db.execute("PRAGMA optimize;");
  }

  return db;
}
