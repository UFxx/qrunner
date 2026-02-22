const { ipcMain, BrowserWindow } = require('electron');

function closeWindow()
{
	ipcMain.on('close', (e) =>
		{
			e.reply('close-response', { success: true });
			BrowserWindow.getFocusedWindow().hide();
		}
	)
}

module.exports = closeWindow;