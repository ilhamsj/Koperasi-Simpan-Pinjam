const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// module to create menu
const Menu = electron.Menu

//Module to receive from render
const ipcMain = require('electron').ipcMain;

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  //ukuran window sesuai layar
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  mainWindow = new BrowserWindow({width, height, resizable:false})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/login/html/index.html'),
    protocol: 'file:',
    slashes: true,
  }))

  // buang menu
  mainWindow.setMenu(null);


  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null

  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()

  }
})

//import module dari controllers.js dengan parameter ipcMain untuk passing ipcMain dari main.js ke ipcMain
//USER

var ipcUserLogin = require('./controllers/user_login_controller.js')(ipcMain);

var ipcRegisterNasabah = require('./controllers/register_nasabah_controller.js')(ipcMain);
var ipcDataSimpanan = require('./controllers/data_simpanan_controller.js')(ipcMain);
var ipcProfilSimpananNasabah = require('./controllers/profil_simpanan_nasabah_controller.js')(ipcMain);
var ipcDataPinjaman = require('./controllers/data_pinjaman_controller.js')(ipcMain);
var ipcProfilPinjamanNasabah = require('./controllers/profil_pinjaman_nasabah_controller.js')(ipcMain);

//ADMIN
var ipcManagementDataSimpanan = require('./controllers/management_data_simpanan_controller.js')(ipcMain);
var ipcManagementDataPinjaman = require('./controllers/managament_data_pinjaman_controller.js')(ipcMain);
var ipcManagementDataAnggota = require('./controllers/management_data_anggota_controller.js')(ipcMain);
var ipcManagementDataUser = require('./controllers/management_data_user_controller.js')(ipcMain);
var ipcManagementDataAngsuran = require('./controllers/management_data_angsuran_controller.js')(ipcMain);
var ipcManagementDataPengambilan = require('./controllers/management_data_pengambilan_controller.js')(ipcMain);
var ipcManagementDataHistorySimpanan = require('./controllers/management_data_history_simpanan_controller.js')(ipcMain);

//method untuk membuat window admin
exports.openAdminWindow = (filename) => {
  //ukuran window sesuai layar
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  
  let win = new BrowserWindow({width, height, resizable:false})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'views/admin/html/'+filename+'.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.webContents.openDevTools();

  //buil menu
  var menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        {
          label: "Open"
        },
        {label: "Save"},
        {type: "separator"},
        {
          label: "Logout",
          click(){
            createWindow();
            win.close();
          }
        },
        {
          label: "Exit",
          click(){
            app.quit()
          }
        }
      ]
    },
    {
      label: "Master",
      submenu: [
        {
          label: "Anggota",
          click(){
            win.loadURL('file://' + __dirname + '/views/admin/html/management_data_anggota.html');
          }
        },
        {
          label: "User",
          click(){
            win.loadURL('file://' + __dirname + '/views/admin/html/management_data_user.html');
          }
        }
      ]
    },
    {
      label: "Simpanan",
      submenu: [
        {
          label: "Data Simpanan",
          click(){
            win.loadURL('file://' + __dirname + '/views/admin/html/management_data_simpanan.html');
          }
        },
        {
          label: "Data Pengambilan",
          click(){
            win.loadURL('file://' + __dirname + '/views/admin/html/management_data_pengambilan.html');
          }
        },
        {
          label: "Data Riwayat Simpanan",
          click(){
            win.loadURL('file://' + __dirname + '/views/admin/html/management_data_history_simpanan.html');
          }
        },
      ]
    },
    {
      label: "Pinjaman",
      submenu: [
        {
          label: "Data Pinjaman",
          click(){
            win.loadURL('file://' + __dirname + '/views/admin/html/management_data_pinjaman.html');
          }
        },
        {
          label: "Data Angsuran",
          click(){
            win.loadURL('file://' + __dirname + '/views/admin/html/management_data_angsuran.html');
          }
        },
      ]
    }
  ])

  //set Menu
  Menu.setApplicationMenu(menu);
}

//method untuk membuat window user
exports.openUserWindow = (filename) => {
  //ukuran window sesuai layar
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize

  let win = new BrowserWindow({width, height, resizable:false})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'views/user/html/'+filename+'.html'),
    protocol: 'file:',
    slashes: true
  }));

  // win.webContents.openDevTools();

  //buil menu
  var menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        {
          label: "Open"
        },
        {label: "Save"},
        {type: "separator"},
        {
          label: "Logout",
          click(){
            createWindow();
            win.close();
          }
        },
        {
          label: "Exit",
          click(){
            app.quit()
          }
        }
      ]
    },
    {
      label: "Menu",
      submenu: [
        {
          label: "Data Simpanan",
          click(){
            win.loadURL('file://' + __dirname + '/views/user/html/data_simpanan.html');
          }
        },
        {
          label: "Data Pinjaman",
          click(){
            win.loadURL('file://' + __dirname + '/views/user/html/data_pinjaman.html');
          }
        },
        {
          label: "Registrasi Nasabah",
          click(){
            win.loadURL('file://' + __dirname + '/views/user/html/register_nasabah.html');
          }
        }
      ]
    }
  ])

  //set Menu
  Menu.setApplicationMenu(menu);
}


