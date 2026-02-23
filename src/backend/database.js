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
		active BIT DEFAULT 1
	)
`);

console.log('База данных инициализирована:', dbPath);

module.exports = db;