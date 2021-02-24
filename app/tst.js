var tokenService_1 = require('./src/node/tokenService')
var ws_1 = require('./src/node/ws')
var ws = new ws_1.default()
var ts = new tokenService_1.default()
ts.connect(function(token, baseUrl) {
  ws.subscribe(token, baseUrl)
})
