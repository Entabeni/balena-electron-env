//SERVER
const ipc = require('node-ipc')
ipc.config.networkHost = '127.0.0.3'

ipc.config.id = 'world'
ipc.config.retry = 1500
ipc.config.maxConnections = 1
ipc.config.networkPort = '80'

ipc.config.id = 'world'
ipc.config.retry = 1500
ipc.config.tls = {
  public: '/usr/src/app/server.pub',
  private: '/usr/src/app/server.key'
}

ipc.serveNet(function() {
  ipc.server.on('message', function(data, socket) {
    console.log('got a message : ', data)
    ipc.server.emit(socket, 'message', 'hello  world!')
  })

  ipc.server.on('socket.disconnected', function(data, socket) {
    console.log(arguments)
  })
})

ipc.server.start()
