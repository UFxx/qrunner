const { ipcMain, BrowserWindow } = require('electron');
const { execFile } = require('child_process');

function launcher()
{
	ipcMain.on('launchApp', (_, value) =>
		{
			let filePath = '';
			filePath = value;

			execFile(filePath);
			BrowserWindow.getFocusedWindow().hide();
		}
	)
}

module.exports = launcher;

