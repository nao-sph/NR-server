const server = require('http').createServer((req, res) => {
  res.write('Hello World!!')
  res.end()
})
const io = require('socket.io')(server)

// const UserManager = require('./UserManager.js')
// const UM = new UserManager()
const RoomManager = require('./RoomManager.js')
const RM = new RoomManager()

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
  console.log(`${socket.id} connected`)
  // UM.add(new User(socket.id, null))

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`)
    // UM.delete(socket.id)
    RM.deleteUser(socket.id)
  })

  // socket.on('req_to_everyone', (data) => { // socketに繋がってる全員
  //   console.log('to_everyone', JSON.stringify(withError(data, null)))
  //   io.sockets.emit('to_everyone', JSON.stringify(withError(data, null)))
  // })
  socket.on('req_to_everyone', (data) => { // socketに繋がってる全員
    console.log('to_everyone', data)
    io.sockets.emit('to_everyone', data)
  })
  socket.on('req_to_self', (data) => { // 送った本人のみ
    console.log('to_self', JSON.stringify(withError(data, null)))
    io.to(socket.id).emit('to_self', JSON.stringify(withError(data, null)))
  })
  socket.on('req_to_room', (data) => { // (roomが使われてる時のみ) 自分の所属するroomの全員
    console.log('to_room', JSON.stringify(withError(data, null)))
    if(RM.getRoomInfo(socket.id) === -1) {
      err = new Error("you haven't joined any room yet")
      io.to(socket.id).emit('to_room', JSON.stringify(withError(data, err)))
    }
    for(let i = 0; i < RM.getRoomInfo(socket.id).users.length; i++) {
      io.to(RM.getRoomInfo(socket.id).users[i].id).emit('to_room', JSON.stringify(withError(data, null)))
    }
  })
  // socket.RM.getRoomInfo(socket.id)('req_to_room_without_self', (data) => { // (roomが使われてる時のみ) 自分の所属するroomの全員
  //   console.log('to_room_without_self', JSON.stringify(withError(data, null)))
  //   let RM.getRoomInfo(socket.id) = RM.getRoomInfo(socket.id)
  //   if(RM.getRoomInfo(socket.id) === -1) {
  //     err = new Error("you haven't joined any room yet")
  //     io.to(socket.id).emit('to_room_without_self', JSON.stringify(withError(data, err)))
  //   }
  //   for(let i = 0; i < RM.getRoomInfo(socket.id).users.length; i++) {
  //     let uid = RM.getRoomInfo(socket.id).users[i].id
  //     if(uid === socket.id) continue
  //     io.to().emit('to_room_without_self', JSON.stringify(withError(data, null)))
  //   }
  // })
  socket.on('req_to_room_without_self', (data) => { // (roomが使われてる時のみ) 自分の所属するroomの全員
    console.log('on "req_to_room_without_self"',socket.id, data)
    if(RM.getRoomInfo(socket.id) === -1) {
      err = new Error("you haven't joined any room yet")
      io.to(socket.id).emit('to_room_without_self', "you haven't joined any room yet")//TODO ほんとはdata
      return
    }
    for(let i = 0; i < RM.getRoomInfo(socket.id).users.length; i++) {
      let uid = RM.getRoomInfo(socket.id).users[i].id
      if(uid === socket.id) continue
      io.to(uid).emit('to_room_without_self', data)
      console.log('emit "to_room_without_self"',socket.id, data)
    }
  })

  //room処理
  socket.on('rm_access', (data) => {
    console.log(`${socket.id} accessed`)
    switch (RM.makeOrJoinMethod(new User(socket.id, data), 2)) {
      // return -1:makroom, 0:join but still not full, 1:join and full, 2:room is full, 3:this user already exists
      case -1: // makeroom

        break
      case 0: // join but still not full

        break
      case 1: // join and full 満員になったからルームの全員に送信
        console.log('---------joined and full')
        console.log('RM.getRoomInfo(socket.id)', RM.getRoomInfo(socket.id))
        if(RM.getRoomInfo(socket.id) === -1) {
          err = new Error("you haven't joined any room yet")
          io.to(socket.id).emit('rm_full', JSON.stringify(withError(data, err)))
          break
        }
        for(let i = 0; i < RM.getRoomInfo(socket.id).users.length; i++) {
          io.to(RM.getRoomInfo(socket.id).users[i].id).emit('rm_full', data)
          console.log(`emit "rm_full" to ${RM.getRoomInfo(socket.id).users[i].id}`)
        }
        turnCount(RM.getRoomInfo(socket.id).users)
        function turnCount(users) {
          let msec = 20000 //msecごとにくりかえし
          let turnNum = 0
          console.log('emit turn_start', users, turnNum)
          let loop = setInterval(() => {
            turnNum++
            for (let user of users) {
              io.to(user.id).emit('turn_start', turnNum)
            }
            console.log('emit turn_start', users, turnNum)
            if(turnNum >= 5) clearInterval(loop)
          }, msec)
        }
        break
      case 2: // room is full
        err = new Error("room is full")
        console.log('to_self', JSON.stringify(withError(data, err)))
        io.to(socket.id).emit('rm_full', JSON.stringify(withError(data, err)))
        break
      case 3: // this user already ezists
        err = new Error("this user already ezists")
        console.log('to_self', JSON.stringify(withError(data, err)))
        io.to(socket.id).emit('rm_full', JSON.stringify(withError(data, err)))
        break
    }
  })
})



let port = server.listen(process.env.PORT || 3000);
server.listen(port)
console.log(`running on port: ${port}`)
