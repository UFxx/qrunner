const { app, BrowserWindow, Tray, Menu, globalShortcut, screen } = require('electron');
const path = require('path');

const init = require('./backend/app.js');

let win  = null;
let tray = null;

function createWindow()
{
	const primaryDisplay = screen.getPrimaryDisplay();
	const { width, height } = primaryDisplay.workAreaSize;

	win = new BrowserWindow(
		{
			width          : width,
			height         : height,
			show           : false,
			frame: false,
			titleBarStyle  : 'hidden',
			transparent    : true,
			alwaysOnTop    : true,
			focusable: true,
			webPreferences :
			{
				preload          : path.join(__dirname, 'preload.js'),
				contextIsolation : true,
			},
		}
	);

	const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

	if (isDev)
	{
		win.loadURL('http://localhost:5173');
		win.webContents.openDevTools({ mode: 'right' });
	}
	else
		win.loadFile(path.join(__dirname, '../renderer/index.html'));

	win.on('blur', () => win.hide());
}

function createTray() {
	const iconPath = path.join(__dirname, 'icons', 'tray-icon.png');

	tray = new Tray(iconPath);

	const contextMenu = Menu.buildFromTemplate(
		[
			{
				label: 'Показать приложение',
				click: () =>
				{
					win.show();
					win.focus();
				}
			},
			{
				label: 'Выход',
				click: () => app.quit()
			}
		]
	);

	tray.setContextMenu(contextMenu);
	tray.setToolTip('QRunner');

	tray.on('click', () =>
		{
			win.show();
			win.focus();
		}
	);
}

function registerGlobalShortcut()
{
	const shortcut = 'Shift+Ctrl+S';

	const registered = globalShortcut.register(shortcut, () =>
		{
			win.show();
			win.focus();
		}
	);

	if (!registered)
		console.warn(`Не удалось зарегистрировать хоткей: ${shortcut}`);
}

app.whenReady().then(() =>
	{
		createWindow();
		createTray();
		registerGlobalShortcut();
		init();

		app.on('activate', () =>
			{
				if (BrowserWindow.getAllWindows().length === 0)
					createWindow();
			}
		);
	}
);

app.on('window-all-closed', (e) =>
{
	e.preventDefault();
	if (win) win.hide();
});

app.on('will-quit', () => globalShortcut.unregisterAll());

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) app.quit();
else
{
	app.on('second-instance', () =>
		{
			if (win)
			{
				win.show();
				win.focus();
			}
		}
	);
}