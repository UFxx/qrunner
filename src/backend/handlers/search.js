const { ipcMain } = require('electron');

function searchHandler ()
{
	ipcMain.on('input', (e, value, fileExts = ['.exe', '.txt', '.dll']) =>
	{

		// e.reply
		// (
		// 	'input-response',
		// 	{
		// 		value: value
		// 	}
		// )
	})
}

module.exports = searchHandler;