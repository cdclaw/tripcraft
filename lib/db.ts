import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'trips.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Create tables
    db.exec(`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        destination TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        adults INTEGER NOT NULL DEFAULT 2,
        kids_ages TEXT NOT NULL DEFAULT '[]',
        budget TEXT NOT NULL DEFAULT 'moderate',
        interests TEXT NOT NULL DEFAULT '[]',
        nap_start TEXT,
        nap_end TEXT,
        itinerary TEXT NOT NULL,
        email TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        ip_address TEXT
      );

      CREATE TABLE IF NOT EXISTS email_captures (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trip_id TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (trip_id) REFERENCES trips(id)
      );
    `);
  }
  return db;
}

export interface TripRecord {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  adults: number;
  kids_ages: string;
  budget: string;
  interests: string;
  nap_start: string | null;
  nap_end: string | null;
  itinerary: string;
  email: string | null;
  created_at: string;
  ip_address: string | null;
}

export function saveTrip(data: Omit<TripRecord, 'created_at'>): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO trips (id, destination, start_date, end_date, adults, kids_ages, budget, interests, nap_start, nap_end, itinerary, email, ip_address)
    VALUES (@id, @destination, @start_date, @end_date, @adults, @kids_ages, @budget, @interests, @nap_start, @nap_end, @itinerary, @email, @ip_address)
  `).run(data);
}

export function getTrip(id: string): TripRecord | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM trips WHERE id = ?').get(id) as TripRecord | undefined;
  return row ?? null;
}

export function countTripsFromIp(ip: string, windowSeconds: number = 3600): number {
  const db = getDb();
  const result = db.prepare(`
    SELECT COUNT(*) as count FROM trips
    WHERE ip_address = ?
    AND created_at > datetime('now', '-' || ? || ' seconds')
  `).get(ip, windowSeconds) as { count: number };
  return result.count;
}

export function saveEmail(tripId: string, email: string): void {
  const db = getDb();
  db.prepare(`
    INSERT INTO email_captures (trip_id, email) VALUES (?, ?)
  `).run(tripId, email);
  db.prepare('UPDATE trips SET email = ? WHERE id = ?').run(email, tripId);
}
