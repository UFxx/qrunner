const { ipcMain } = require('electron');

function index()
{
	ipcMain.on('index', (e) =>
	{
		e.reply('index-response',
			{
				newTimestamp: Date.now()
			}
		)
	})
}

module.exports = index;