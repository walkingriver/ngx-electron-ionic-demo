const { app, BrowserWindow, Menu, MenuItem, } = require('electron')
const path = require('path')
const url = require('url')

let win
let tray

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', appReady)

function appReady() {
  initMenu()
  createWindow()
}

function initMenu() {
  const menu = Menu.getApplicationMenu()

  menu.insert(menu.items.length - 2, new MenuItem({
    label: 'Tabs',
    submenu: [{
      label: 'Home',
      click: onHome
    }, {
      label: 'About',
      click: onAbout
    }, {
      label: 'Contact',
      click: onContact
    }]
  }))

  Menu.setApplicationMenu(menu)
}

function onHome() {
  activateAndNav('home')
}

function onAbout() {
  activateAndNav('about')
}

function onContact() {
  activateAndNav('contact')
}

function activateAndNav(page) {
  if (!win) {
    createWindow(page)
  } else {
    navigateTo(page)
  }
}

function createWindow(page) {
  const windowIcon = process.platform === 'darwin' ? 'icon.png' : 'icon.ico'
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Ionic & ngx-Electron Demo',
    show: false
  })

  // and load the index.html of the app.
  win.loadURL('http://localhost:8100')
  // win.loadURL(url.format({
  //   pathname: path.join(__dirname, '../www/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }))

  win.once('ready-to-show', () => {
    if (!win.isVisible()) {
      win.show()
    }

    if (page) {
      navigateTo(page)
    }
  })

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })
}

function navigateTo(page) {
  app.focus()
  console.log(`Navigating to ${page}.`)
  win.webContents.send(page)
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
