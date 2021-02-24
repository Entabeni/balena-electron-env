//CLIENT
const ipc = require('node-ipc')
ipc.config.networkHost = 'localhost'
ipc.config.networkHost = '127.0.0.3'

ipc.config.id = 'world'

ipc.config.retry = 1500
ipc.config.maxConnections = 1
ipc.config.networkPort = '80'

ipc.config.tls = {
  public: '/usr/src/app/server.pub',
  rejectUnauthorized: false
}

ipc.connectToNet('world', function() {
  ipc.of.world.on('connect', function() {
    console.log('## connected to world ##', ipc.config.delay)
    ipc.of.world.emit('message', 'hello')
  })
  ipc.of.world.on('disconnect', function() {
    ipc.log('disconnected from world')
  })
  ipc.of.world.on('message', function(data) {
    ipc.log('got a message from world : ', 'test')
  })
})
