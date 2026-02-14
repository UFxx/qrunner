const { ipcMain } = require('electron');
const { execFile } = require('child_process');

function launcher()
{
	ipcMain.on('launchApp', (_, value) =>
		{
			execFile(value);
		}
	)
}

module.exports = launcher;

