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

		try
		{
			const searchQuery = `%${value}%`;
			const startsWithQuery = `${value}%`;

			const results = db.prepare(`
				SELECT id, name, path, extension, icon, active
				FROM apps
				WHERE active = 1
				AND (
					(name || '.' || extension) LIKE ?
					OR path LIKE ?
				)
				ORDER BY
				CASE
					WHEN name LIKE ? THEN 1
					WHEN (name || '.' || extension) LIKE ? THEN 2
					WHEN path LIKE ? THEN 3
					ELSE 4
				END,
				name
				LIMIT 50
			`)
			.all(
				searchQuery,
				searchQuery,
				startsWithQuery,
				searchQuery,
				searchQuery
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
		catch (error)
		{
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