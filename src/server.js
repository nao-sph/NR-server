const server = require('http').createServer((req, res) => {
  res.write('Hello World!!')
  res.end()
})
const io = require('socket.io')(server)

const RandomManager = require('RoomManager.js')
const RM = new RandomManager()
const BattleManager = require('BattleManager.js')

const stageLen = 1

class Player {
  constructor (id, name, charaNum) {
    this.id = id
    this.name = name
    this.roomID = null
    this.charaNum = charaNum
  }
}

io.on('connection', (socket) => {
  console.log('client connected')

  socket.on('disconnect', () => {
    console.log('client disconnected')
  })

  socket.on('rm_access', (data) => {
    let name = JSON.parse(data)[0]
    let charaNum = JSON.parse(data)[1]
    console.log(`${name} accessed`)
    let getRmInfo = RM.access(new Player(socket.id, name, charaNum))
    switch(getRmInfo[0]){ // 0:待機、1:開始、2:復帰
      case 0: //待機
        socket.emit('rm_wait', null)
        break
      case 1: //バトル開始
        console.log();
        
        socket.emit('btl_start', name) //TODO
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
