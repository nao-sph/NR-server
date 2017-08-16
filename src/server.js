const server = require('http').createServer((req, res) => {
  res.write('Hello World!!')
  res.end()
})
const io = require('socket.io')(server)

const RandomManager = require('RoomManager.js')
const RM = new RandomManager()
const BattleManager = require('BattleManager.js')

class Player {
  constructor (id, name) {
    this.id = id
    this.name = name
    this.roomID = null
  }
}

io.on('connection', (socket) => {
  console.log('client connected')

  socket.on('disconnect', () => {
    console.log('client disconnected')
  })

  socket.on('access', (name) => {
    console.log(`${name} accessed`)
    let roomInfo = RM.access(new Player(socket.id, name))
    switch(status[0]){ // 0:待機、1:開始、2:復帰
      case 0: //待機
        socket.emit('waiting2P', null)
        break
      case 1: //バトル開始
        console.log();
        socket.emit('start_battle', roomInfo)
        break
      case 2: //バトル復帰
        // TODO バトル復帰の実装
        break
    }

    console.log('send message')
    socket.emit('from_server', 'welcome')
  })
})

server.listen(3000)
