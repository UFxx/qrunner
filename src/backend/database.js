// src/main/database.js
const Database = require('better-sqlite3');
const { app } = require('electron');
const { join } = require('path');

const dbPath = '../backend/database.db';
const db = new Database(dbPath);

console.log('aaa');


// Оптимизация
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

module.exports = db;