const { ipcMain } = require('electron');
const db = require('../database.js');

function searchHandler()
{
	ipcMain.on('input', (e, value) =>
	{
		if (!value || value.trim().length === 0)
		{
			e.reply('input-response',
				{
					success: true,
					results: [],
					query: value
				}
			);

			return;
		}

		try {
			const searchQuery = `%${value}%`;

			const results = db.prepare(`
				SELECT id, name, path, extension
				FROM apps
				WHERE name LIKE ?
				ORDER BY
				CASE
					WHEN name LIKE ? THEN 1
					WHEN name LIKE ? THEN 2
					ELSE 3
				END,
				name
				LIMIT 10
			`)
			.all(
				searchQuery,
				`${value}%`,
				`% ${value}%`
			);

			e.reply('input-response',
				{
					success: true,
					results: results,
					query: value,
					count: results.length
				}
			);
		}
		catch (error) {
			console.error('Ошибка поиска:', error);
			e.reply('input-response',
				{
					success: false,
					error: error.message,
					query: value
				}
			);
		}
	});
}

module.exports = searchHandler;