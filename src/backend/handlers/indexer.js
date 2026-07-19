const { ipcMain, app } = require('electron');
const db          = require('../database.js');
const fs          = require('fs');
const fsp         = fs.promises;
const path        = require('path');

function getAllDrives() {
	const drives = [];

	if (process.platform === 'win32')
	{
		for (let letter = 'C'.charCodeAt(0); letter <= 'Z'.charCodeAt(0); letter++)
		{
			const drive = `${String.fromCharCode(letter)}:\\`;

			try {
				if (fs.existsSync(drive)) {
					try {
						fs.accessSync(drive, fs.constants.R_OK);
						drives.push(drive);
					}
					catch (e) {
						console.log(`⚠️ Диск ${drive} недоступен, пропускаем`);
					}
				}
			} catch (e) {}
		}
	}
	else if (process.platform === 'darwin')
	{
		const macPaths =
		[
			'/Applications',
			'/System/Applications',
			'/Users'
		];

		macPaths.forEach((p) =>
			{
				if (fs.existsSync(p))
					drives.push(p);
			}
		);
	}
	else
	{
		const linuxPaths =
		[
			'/usr/bin',
			'/usr/local/bin',
			'/opt',
			'/home'
		];

		linuxPaths.forEach((p) =>
			{
				if (fs.existsSync(p))
					drives.push(p);
			}
		);
	}

	return drives;
}

// lists for skip
const SKIP_DIRS = new Set(
[
	'Windows', 'ProgramData', 'PerfLogs', '$Recycle.Bin', 'Recovery',
	'System Volume Information', 'Config.Msi', 'MSOCache',

	'node_modules', '.git', '.vs', '.idea', '.vscode', 'venv', '__pycache__',

	'Temp', 'tmp', 'Cache', 'Caches',

	'SteamApps', 'steamapps', 'common', 'shadercache', 'downloading',
	'logs', 'log', 'debug', 'diagnostic', 'crash', 'crashes'
]);

const SKIP_EXTENSIONS = new Set(
[
	'dll', 'sys', 'drv', 'ocx', 'cpl', 'msi', 'msp', 'msu',
	'ini', 'log', 'tmp', 'temp', 'bak', 'old', 'backup',
	'dat', 'db', 'sqlite', 'sqlite3', 'journal',
	'zip', 'rar', '7z', 'iso', 'tar', 'gz', 'bz2',
	'mp3', 'mp4', 'avi', 'mkv', 'jpg', 'jpeg', 'png', 'gif', 'bmp',
	'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
	'txt', 'log', 'md', 'json', 'xml', 'yml', 'yaml', 'css', 'js', 'ts',
	'exe.log', 'exe.old', 'exe.bak'
]);

// Scaning
async function scanDirectory(dirPath, extensions, results = [], depth = 0, maxDepth = 4) {
	if (depth > maxDepth)
		return results;

	const dirName = path.basename(dirPath);
	if (SKIP_DIRS.has(dirName))
		return results;

	try {
		const entries = await fsp.readdir(dirPath, { withFileTypes: true });

		const subdirs = [];

		for (const entry of entries)
		{
			const fullPath = path.join(dirPath, entry.name);

			if (entry.isDirectory())
				subdirs.push([fullPath, depth + 1]);
			else if (entry.isFile())
			{
				const ext = path.extname(entry.name).slice(1).toLowerCase();

				if (ext && extensions.includes(ext) && !SKIP_EXTENSIONS.has(ext))
					results.push(fullPath);
			}
		}

		for (const [subdir, subDepth] of subdirs)
			await scanDirectory(subdir, extensions, results, subDepth, maxDepth);

	}
	catch (error) {
		if (error.code !== 'EPERM' && error.code !== 'EACCES' && error.code !== 'ENOENT')
			console.warn(`⚠️ Не удалось прочитать ${dirPath}: ${error.message}`);
	}

	return results;
}

function saveToDatabase(filePaths) {
	const insertStmt = db.prepare(`
		INSERT OR IGNORE INTO apps (name, path, extension, active)
		VALUES (?, ?, ?, 1)
	`);

	const transaction = db.transaction(() => {
		let count = 0;

		for (const filePath of filePaths) {
			const fileName = filePath.split(/[\\/]/).pop();
			const ext = fileName.split('.').pop()?.toLowerCase() || '';
			const name = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;

			try {
				insertStmt.run(name, filePath, ext);
				count++;
			}
			catch (error) {
				if (!error.message.includes('UNIQUE constraint failed'))
					console.error(`Ошибка сохранения ${filePath}:`, error.message);
			}
		}

		return count;
	});

	return transaction();
}

async function fetchAndSaveIcons(filePaths) {
	const updateStmt = db.prepare('UPDATE apps SET icon = ? WHERE path = ?');
	const selectStmt = db.prepare('SELECT path, icon FROM apps WHERE path = ?');
	
	let updated = 0;
	let skipped = 0;

	for (const filePath of filePaths) {
		// Проверяем, есть ли уже иконка
		const existing = selectStmt.get(filePath);
		if (existing && existing.icon)
		{
			skipped++;
			continue;
		}

		try {
			const icon = await app.getFileIcon(filePath, { size: 'normal' });
			const iconData = icon.toDataURL();
			updateStmt.run(iconData, filePath);
			updated++;

			if (updated % 100 === 0)
				console.log(`📊 Получено иконок: ${updated}`);
		}
		catch (error) { console.error('Не удалось найти иконку', err); }
	}

	console.log(`✅ Иконки обновлены: ${updated}, пропущено: ${skipped}`);
	return updated;
}

function cleanupDatabase(existingFiles) {
	const existingPaths = new Set(existingFiles);
	const allApps = db.prepare('SELECT path FROM apps').all();

	const deleteStmt = db.prepare('DELETE FROM apps WHERE path = ?');
	const transaction = db.transaction(() =>
	{
		let deleted = 0;
		for (const app of allApps)
		{
			if (!existingPaths.has(app.path))
			{
				deleteStmt.run(app.path);
				deleted++;
			}
		}
		return deleted;
	});

	return transaction();
}

// Indexed func
async function performIndex(extensions) {
	const drives = getAllDrives();

	if (drives.length === 0)
		throw new Error('Не найдено доступных дисков для сканирования');

	const scanPromises = drives.map(drive => 
		scanDirectory(drive, extensions, [], 0, 4)
			.catch(error => {
				console.warn(`⚠️ Ошибка сканирования ${drive}:`, error.message);
				return [];
			})
	);

	const resultsPerDrive = await Promise.all(scanPromises);
	const allFiles = resultsPerDrive.flat();
	const totalScanned = allFiles.length;

	const uniqueFiles = [...new Set(allFiles)];
	const savedCount = saveToDatabase(uniqueFiles);
	
	// Получаем иконки после сохранения в БД
	console.log(` Начинаем получение иконок для ${uniqueFiles.length} файлов...`);
	const iconsUpdated = await fetchAndSaveIcons(uniqueFiles);
	
	const deletedCount = cleanupDatabase(uniqueFiles);

	return {
		totalScanned,
		saved: savedCount,
		iconsUpdated,
		deleted: deletedCount,
		drivesCount: drives.length,
		uniqueFiles: uniqueFiles.length
	};
}

async function getFileIcon(filePath)
{
	try
	{
		const icon = await app.getFileIcon(filePath, { size: 'normal' });
		return icon.toDataURL();
	}
	catch (error)
	{
		console.warn(`⚠️ Не удалось получить иконку для ${filePath}:`, error.message);
		return null;
	}
}

function indexer()
{
	ipcMain.on('indexer', async (e, extensions) =>
	{
		try {
			const exts = extensions || (
				process.platform === 'win32' ? ['exe', 'lnk'] :
				process.platform === 'darwin' ? ['app'] :
				['sh', 'desktop']
			);

			const startTime = Date.now();
			const result    = await performIndex(exts);
			const duration  = Date.now() - startTime;

			e.reply('indexer-response',
				{
					success: true,
					...result,
					duration,
					newTimestamp: Date.now()
				}
			);
		}
		catch (error) {
			console.error('❌ Ошибка индексации:', error);

			e.reply('indexer-response',
				{
					success: false,
					error: error.message,
					newTimestamp: Date.now()
				}
			);
		}
	});
}

module.exports = indexer;