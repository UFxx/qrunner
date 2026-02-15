const { ipcMain } = require('electron');
const { execFile } = require('child_process');

function launcher()
{
	ipcMain.on('launchApp', (_, value) =>
		{
			let filePath = '';
			filePath = value;

			console.log(filePath);

			execFile(filePath);
		}
	)
}

module.exports = launcher;

