const server = require('http').createServer((req, res) => {
  res.write('Hello World!!')
  res.end()
})
const io = require('socket.io')(server)

const RandomManager = require('./RoomManager.js')
const RM = new RandomManager()
const BattleManager = require('./BattleManager.js')

const stageLen = 1

class Player {
  constructor (id, name, charaNum) {
    this.ID = id
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

  // RoomManager
  socket.on('rm_access', (data) => { //配列をJSON
    let name = JSON.parse(data)[name]
    let charaNum = JSON.parse(data)[charaNum]
    console.log(`${name} accessed`)
    let id = socket.id
    let getRmInfo = RM.access(new Player(id, name, charaNum))
    switch(getRmInfo[0]){ // 0:待機、1:開始、2:復帰
      case 0: //待機
        io.to(id).emit('rm_wait', null)
        break
      case 1: //バトル開始
        let room = getRmInfo[1]
        room.bm = new BattleManager(room.members[0].ID, room.members[1].ID)
        let stageNum = Math.floor(Math.random * Math.stageLen)
        let data0 = [room.members[0].name, room.members[0].charaNum, stageNum]
        let data1 = [room.members[1].name, room.members[1].charaNum, stageNum]
        io.to(room.members[0].ID).emit('btl_start', JSON.stringify(data1))
        io.to(room.members[1].ID).emit('btl_start', JSON.stringify(data0))
        break
      case 2: //バトル復帰
        io.to(id).emit('btl_return')
        break
    }

    console.log('send message')
    socket.emit('from_server', 'welcome')
  })

  socket.on('in_socket', () => {
    console.log('in_socket');
    socket.emit('in_ok', null)
  })
  
  //ここを追加
   socket.on('in_socket1' , () => {
    console.log('in_socket1');
    socket.emit('in_ok1' , null)
  })


  // BattleManager
  socket.on('cmd_mine', () => {
    let data = 0//TODO
    socket.emit('cmd_enemy', JSON.stringify(data))
  })
  socket.on('cmd_timeup', () => {

  })
})

io.on('out_socket)', () => {
  socket.emit('out_ok', null)
})

let port = 3000
server.listen(port)
console.log(`running on port: ${port}`)
