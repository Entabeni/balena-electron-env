//CLIENT
const ipc = require('node-ipc')
ipc.config.networkHost = '127.0.0.1'
ipc.config.networkPort = '80'

ipc.config.id = 'world'
ipc.config.retry = 1500

ipc.connectToNet('world', function() {
  ipc.of.world.on('connect', function() {
    console.log('## connected to world ##', ipc.config.delay)
    ipc.of.world.emit('message', 'hello')
  })
  ipc.of.world.on('disconnect', function() {
    console.log('disconnected from world')
  })
  ipc.of.world.on('message', function(data) {
    console.log('got a message from world : ', data)
  })
})
