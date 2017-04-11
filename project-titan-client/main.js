const electron = require('electron');
const {app, BrowserWindow } = electron;
const Templater = require('./templater');

let templater = new Templater();
templater.start();

let win;

process.env.client = true;

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('browser-window-created',function(e,window) {
      window.setMenu(null);
  });

function createWindow() {
  // create the window

  let primaryDisplay = electron.screen.getPrimaryDisplay();
  win = new BrowserWindow(primaryDisplay.size);
  win.loadURL(`file://${__dirname}/views-dist/index.hbs`);
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
}
