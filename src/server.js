const server = require('http').createServer((req, res) => {
  res.write('Hello World!!')
  res.end()
})
const io = require('socket.io')(server)

const RoomManager = require('./RoomManager.js')
const RM = new RoomManager()
const UserManager = require('./UserManager.js')
const UM = new UserManager()

class User {
  constructor (id, data) {
    this.id = id
    this.data = data
  }
}

let err
function withError (obj, err) {
  return {
    success: !err,
    msg: err ? err.message : null,
    data: obj,
  }
}

io.on('connection', (socket) => {
  console.log('client connected')

  socket.on('disconnect', () => {
    console.log('client disconnected')
  })

  socket.on('req_to_everyone', (data) => { // socketに繋がってる全員
    console.log('to_everyone', JSON.stringify(withError(data, null)))
    socket.emit('to_everyone', JSON.stringify(withError(data, null)))
  })
  socket.on('req_to_self', (data) => { // 送った本人のみ
    console.log('to_self', JSON.stringify(withError(data, null)))
    io.to(socket.id).emit('to_self', JSON.stringify(withError(data, null)))
  })
  socket.on('req_to_room', (data) => { // (roomが使われてる時のみ) 自分の所属するroomの全員
    console.log('to_room', JSON.stringify(withError(data, null)))
    let roomInfo = RM.getRoomInfo(socket.id)
    if(roomInfo === -1) {
      err = new Error("you haven't joined any room yet")
      io.to(socke.id).emit('to_room', JSON.stringify(withError(data, err)))
    }
    for(let i = 0; i < roomInfo.members.length; i++) {
      io.to(roomInfo.members[i].id).emit('to_room', JSON.stringify(withError(data, null)))
    }
  })

  //room処理
  socket.on('rm_access', (data) => {
    switch (makeOrJoinMethod(new User(socket.id, data), 2)) {
      // return -1:makroom, 0:join but still not full, 1:join and full, 2:room is full, 3:this user already exists
      case -1: // makeroom

        break;
      case 0: // join but still not full

        break;
      case 1: // join and full 満員になったからルームの全員に送信
        let roomInfo = RM.getRoomInfo(socket.id)
        if(roomInfo === -1) {
          err = new Error("you haven't joined any room yet")
          io.to(socke.id).emit('rm_full', JSON.stringify(withError(data, err)))
        }
        for(let i = 0; i < roomInfo.members.length; i++) {
          io.to(roomInfo.members[i].id).emit('rm_full', JSON.stringify(withError(data, null)))
        }
        break;
      case 2: // room is full
        err = new Error("room is full")
        console.log('to_self', JSON.stringify(withError(data, err)))
        io.to(socket.id).emit('rm_full', JSON.stringify(withError(data, err)))
        break;
      case 3: // this user already ezists
        err = new Error("this user already ezists")
        console.log('to_self', JSON.stringify(withError(data, err)))
        io.to(socket.id).emit('rm_full', JSON.stringify(withError(data, err)))
        break;
    }
  })
})

let port = server.listen(process.env.PORT || 3000);
server.listen(port)
console.log(`running on port: ${port}`)
