const Database = require('better-sqlite3');
const { app }  = require('electron');
const { join } = require('path');

const dbPath = join(app.getPath('userData'), 'launcher.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

db.exec(`
	CREATE TABLE IF NOT EXISTS apps (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		path TEXT NOT NULL UNIQUE,
		extension TEXT,
		icon TEXT,
		active INTEGER DEFAULT 1,
		open_count INTEGER DEFAULT 0,
		last_opened TIMESTAMP
	)
`);

try { db.exec(`ALTER TABLE apps ADD COLUMN icon TEXT`); } catch (e) {}

try
{
	db.exec(`ALTER TABLE apps ADD COLUMN open_count INTEGER DEFAULT 0`);
	db.exec(`ALTER TABLE apps ADD COLUMN last_opened TIMESTAMP`);
} catch (e) { }

console.log('База данных инициализирована:', dbPath);

module.exports = db;