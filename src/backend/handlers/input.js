const { ipcMain } = require('electron');

function registerInputHandler ()
{
	ipcMain.on('input-value', (e, value) =>
	{
		e.reply('input-value-response', {
			value: value
		})
	})
}

module.exports = registerInputHandler;