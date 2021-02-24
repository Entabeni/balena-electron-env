const electron = require('electron')
const path = require('path')

const customerFacing = require('node-ipc')
const cashierFacing = new customerFacing.IPC()
// const isDev = require('electron-is-dev')

//Config
// isDev && require('react-devtools-electron')

const isCustomerFacing = process.env.CLIENT_FACING === '0'
const isCashierFacing = process.env.CLIENT_FACING === '1'
customerFacing.config.networkHost = process.env.CUSTOMER_FACING_IP || '127.0.0.2'
customerFacing.config.id = 'customerFacingServer2'
customerFacing.config.networkPort = '8001'
customerFacing.config.retry = 1500
cashierFacing.config.networkHost = process.env.CLIENT_FACING_IP || '127.0.0.3'
cashierFacing.config.id = 'cashierFacingServer2'
cashierFacing.config.networkPort = '8002'
cashierFacing.config.retry = 1500

var tokenService_1 = require('./src/node/tokenService')
var ws_1 = require('./src/node/ws')
var ws = new ws_1.default()
var ts = new tokenService_1.default()
var beginPrinting = require('./src/node/receiptPrinter')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const { app, BrowserWindow, ipcMain } = electron
const printer = require('@thiagoelg/node-printer/lib')
// const SerialPort = require('serialport')

const portPath = process.env.PORT || '/dev/tty.usbserial-0001'

var buffer = Buffer.from([0x04, 0x00, 0x01, 0xdb, 0x4b])

const { download } = require('electron-dl')
ipcMain.on('print-button', async (event, arg) => {
  const win = BrowserWindow.getFocusedWindow()
  await download(win, arg, { options: { filename: 'test.pdf' } })
})
ipcMain.on('receipt-button', (event, arg) => {
  beginPrinting.default(arg, 'receipt')
})
ipcMain.on('cashout-button', (event, arg) => {
  beginPrinting.default(arg, 'cashout')
})
if (isCashierFacing) {
  cashierFacing.connectToNet('customerFacingServer2', function() {
    cashierFacing.of.customerFacingServer2.on('connect', function() {
      cashierFacing.log('## connected to customerFacingServer2 ##', cashierFacing.config.delay)
      // cashierFacing.of.customerFacingServer2.emit('message', 'hello')
    })
    cashierFacing.of.customerFacingServer2.on('disconnect', function() {
      cashierFacing.log('disconnected from customerFacingServer2')
    })
    ipcMain.on('update-customer-facing-screen', (event, arg) => {
      cashierFacing.of.customerFacingServer2.emit('message', arg)
    })
  })
} else if (isCustomerFacing) {
  customerFacing.connectToNet('cashierFacingServer2', function() {
    customerFacing.of.cashierFacingServer2.on('connect', function() {
      customerFacing.log('## connected to cashierFacingServer2 ##', customerFacing.config.delay)
      // customerFacing.of.cashierFacingServer2.emit('message', 'hello')
    })
    customerFacing.of.cashierFacingServer2.on('disconnect', function() {
      customerFacing.log('disconnected from cashierFacingServer2')
    })
    ipcMain.on('update-cashier-facing-screen', (event, arg) => {
      customerFacing.of.cashierFacingServer2.emit('message', arg)
    })
  })
}

ipcMain.on('scan-button', (event, arg) => {
  // const port = new SerialPort(portPath, {
  //   baudRate: 57600
  // })
  // port.on('error', function(err) {
  //   clearInterval(intervalId)
  //   event.reply('scan-reply', 'OPEN-ERROR')
  // })
  // const intervalId = setInterval(() => {
  //   port.write(buffer, (err, result) => {
  //     if (err) {
  //       console.log('Error on write', err)
  //       clearInterval(intervalId)
  //       event.reply('scan-reply', 'WRITE-ERROR')
  //     }
  //   })
  // }, 100)
  // setTimeout(() => {
  //   if (intervalId) {
  //     event.reply('scan-reply', 'NO-SCAN')
  //     clearInterval(intervalId)
  //     port.close()
  //   }
  // }, 7000)
  // port.on('data', data => {
  //   if ((data.length === 20 || data.length === 14) && data[4] === 1) {
  //     if (intervalId) {
  //       clearInterval(intervalId)
  //     }
  //     port.close()
  //     event.reply('scan-reply', data.slice(6, 18).toString('hex'))
  //   }
  // })
})

// simple parameters initialization
const electronConfig = {
  URL_LAUNCHER_TOUCH: process.env.URL_LAUNCHER_TOUCH === '1' ? 1 : 0,
  URL_LAUNCHER_TOUCH_SIMULATE: process.env.URL_LAUNCHER_TOUCH_SIMULATE === '1' ? 1 : 0,
  URL_LAUNCHER_FRAME: process.env.URL_LAUNCHER_FRAME === '1' ? 1 : 0,
  URL_LAUNCHER_KIOSK: process.env.URL_LAUNCHER_KIOSK === '1' ? 1 : 0,
  URL_LAUNCHER_NODE: process.env.URL_LAUNCHER_NODE === '1' ? 1 : 0,
  URL_LAUNCHER_WIDTH: parseInt(process.env.URL_LAUNCHER_WIDTH || 1920, 10),
  URL_LAUNCHER_HEIGHT: parseInt(process.env.URL_LAUNCHER_HEIGHT || 1080, 10),
  URL_LAUNCHER_TITLE: process.env.URL_LAUNCHER_TITLE || 'RESIN.IO',
  URL_LAUNCHER_CONSOLE: process.env.URL_LAUNCHER_CONSOLE === '1' ? 1 : 0,
  URL_LAUNCHER_URL: process.env.URL_LAUNCHER_URL || `file:///${path.join(__dirname, 'dist', 'index.html')}`,
  URL_LAUNCHER_ZOOM: parseFloat(process.env.URL_LAUNCHER_ZOOM || 1.0),
  URL_LAUNCHER_OVERLAY_SCROLLBARS: process.env.URL_LAUNCHER_OVERLAY_SCROLLBARS === '1' ? 1 : 0,
  ELECTRON_ENABLE_HW_ACCELERATION: process.env.ELECTRON_ENABLE_HW_ACCELERATION === '1',
  ELECTRON_RESIN_UPDATE_LOCK: process.env.ELECTRON_RESIN_UPDATE_LOCK === '1',
  ELECTRON_APP_DATA_DIR: process.env.ELECTRON_APP_DATA_DIR,
  ELECTRON_USER_DATA_DIR: process.env.ELECTRON_USER_DATA_DIR
}

// Enable / disable hardware acceleration
if (!electronConfig.ELECTRON_ENABLE_HW_ACCELERATION) {
  app.disableHardwareAcceleration()
}

// enable touch events if your device supports them
if (electronConfig.URL_LAUNCHER_TOUCH) {
  app.commandLine.appendSwitch('--touch-devices')
}
// simulate touch events - might be useful for touchscreen with partial driver support
if (electronConfig.URL_LAUNCHER_TOUCH_SIMULATE) {
  app.commandLine.appendSwitch('--simulate-touch-screen-with-mouse')
}

// Override the appData directory
// See https://electronjs.org/docs/api/app#appgetpathname
if (electronConfig.ELECTRON_APP_DATA_DIR) {
  electron.app.setPath('appData', electronConfig.ELECTRON_APP_DATA_DIR)
}

// Override the userData directory
// NOTE: `userData` defaults to the `appData` directory appended with the app's name
if (electronConfig.ELECTRON_USER_DATA_DIR) {
  electron.app.setPath('userData', electronConfig.ELECTRON_USER_DATA_DIR)
}

if (process.env.NODE_ENV === 'development') {
  console.log('Running in development mode')
  Object.assign(electronConfig, {
    URL_LAUNCHER_HEIGHT: 600,
    URL_LAUNCHER_WIDTH: 800,
    URL_LAUNCHER_KIOSK: 0,
    URL_LAUNCHER_CONSOLE: 1,
    URL_LAUNCHER_FRAME: 1
  })
}

/*
 we initialize our application display as a callback of the electronJS "ready" event
 */
app.on('ready', () => {
  // here we actually configure the behavour of electronJS
  mainWindow = new BrowserWindow({
    width: electronConfig.URL_LAUNCHER_WIDTH,
    height: electronConfig.URL_LAUNCHER_HEIGHT,
    frame: !!electronConfig.URL_LAUNCHER_FRAME,
    title: electronConfig.URL_LAUNCHER_TITLE,
    kiosk: false,
    webPreferences: {
      experimentalFeatures: true,
      webSecurity: false,
      sandbox: false,
      nodeIntegration: true,
      zoomFactor: electronConfig.URL_LAUNCHER_ZOOM,
      overlayScrollbars: !!electronConfig.URL_LAUNCHER_OVERLAY_SCROLLBARS
    }
  })
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    item.setSavePath('/tmp/save.pdf')
    item.once('done', (event, state) => {
      if (state === 'completed') {
        printer.printFile({
          filename: item.getSavePath(),
          printer: 'Magicard_600',
          success: function(jobID) {
            console.log('sent to printer with ID: ' + jobID)
          },
          error: function(err) {
            console.log(err)
          }
        })
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })

  mainWindow.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      mainWindow.show()
    }, 300)

    ts.connect(function(token, baseUrl) {
      ipcMain.on('open-payment-subscription', (event, arg) => {
        ws.subscribe(token, baseUrl, mainWindow, arg)
      })
    })

    if (isCustomerFacing) {
      cashierFacing.serveNet(function() {
        cashierFacing.server.on('message', function(data, socket) {
          cashierFacing.server.emit(socket, 'message', ' world!')
          mainWindow.webContents.send('message-from-customer-facing', data)
        })
        cashierFacing.server.on('socket.disconnected', function(data, socket) {
          console.log('DISCONNECTED\n\n', arguments)
        })
      })
      cashierFacing.server.start()
    } else if (isCashierFacing) {
      console.log('🚀 ~ file: main.js ~ line 233 ~ mainWindow.webContents.on ~ isCashierFacing', isCashierFacing)
      customerFacing.serveNet(function() {
        customerFacing.server.on('message', function(data, socket) {
          customerFacing.server.emit(socket, 'message', ' world!')
          mainWindow.webContents.send('message-from-cashier-facing', data)
        })
        customerFacing.server.on('socket.disconnected', function(data, socket) {
          console.log('DISCONNECTED\n\n', arguments)
        })
      })
      customerFacing.server.start()
    }
  })

  if (electronConfig.URL_LAUNCHER_CONSOLE) {
    mainWindow.webContents.openDevTools()
  }

  process.on('uncaughtException', err => {
    console.log(err)
  })

  // the big red button, here we go
  mainWindow.loadURL(electronConfig.URL_LAUNCHER_URL)
})
