class RoomManager {
  constructor () {
    this.rooms = []
  }

  make (user, full) { //fullは定員数
    console.log('RM.make')
    console.log('user', user)
    console.log('full', full)
    this.rooms.push(new Room(user, full))
  }
  delete (rid) { //部屋を消す//TODO
    console.log('RM.delete')
    console.log('rid', rid)
    let idx = this.getIdx(rid)
    if(idx === -1) return
    this.rooms.splice(idx, 1)
  }
  deleteUser (uid) { //部屋から人を消す//TODO
    console.log('RM.deleteUser')
    console.log('uid', uid)
    let room = this.getRoomInfo()
    if(this.getRoomInfo(uid) === -1) return
    let rid = this.getRoomInfo(uid).id
    let idx = this.getIdx(rid)
    if(idx === -1) return
    this.rooms[idx].leaveUser(uid)
    console.log('-------------checkpoint')
    console.log(this.rooms[idx].users.length)
    if(this.rooms[idx].users.length === 0){
      this.delete(rid)
    }
  }
  getRoomInfo (uid) {//TODO
    console.log('RM.getRoomInfo')
    console.log('uid', uid)
    for (let i = 0; i < this.rooms.length; i++) {
      let ridx = this.rooms[i].getIdx(uid)
      if(ridx !== -1) return this.rooms[i]
    }
    return -1
  }

  makeOrJoinMethod (user, full) {//TODO
    console.log('RM.makeOrJoinMethod')
    console.log('user', user)
    console.log('full', full)
    // return -1:makroom, 0:join but still not full, 1:join and full, 2:room is full, 3:this user already exists
    let idx = this.getNotfullIdx()
    if(idx === -1) {
      this.make (user, full)
      return -1
    }
    return this.rooms[idx].joinUser(user)
  }

  getNotfullIdx () { // 満室じゃない部屋のidxをとる//TODO
    for (let i = 0; i < this.rooms.length; i++) {
      if(!(this.rooms[i].isFull)) return i
    }
    return -1
  }
  getIdx (rid) {//TODO
    for (let i = 0; i < this.rooms.length; i++) {
      if(this.rooms[i].id === rid) return i
    }
    return -1
  }
}

class Room {
  constructor (user, n) { //n:自然数 は定員//TODO
    console.log('new Room')
    console.log('user', user)
    this.id = this.genRanStr(8)
    this.users = [user]
    this.full = Math.max(1, Math.ceil(n)) // 1以下だった場合は1として扱う。 1より大きい場合はMath.ceil
    this.isFull = false
    this.checkFull()
  }

  startTurnCount () {

  }

  joinUser (user) { //return 0:join but still not full, 1:join and full, 2:room is full, 3:this user already exists
    console.log('Room.joinUser')//TODO
    console.log('user',user)
    if(this.isFull) return 2
    if(this.getIdx(user.id) !== -1) return 3
    this.users.push(user)
    if(this.checkFull()) return 1
    return 0
  }
  leaveUser (uid) {//TODO
    console.log('Room.leaveUser')
    console.log('uid',uid)
    let idx = this.getIdx(uid)
    if(idx === -1) return
    this.users.splice(idx,1)
    this.checkFull()
  }
  exists (uid) {//TODO
    console.log('Room.exists')
    console.log('uid',uid)
    if(this.getIdx(uid) === -1) return false
    return true
  }

  checkFull () {//TODO
    console.log('Room.checkFull')
    if(this.users.length >= this.full) {
      this.isFull = true
      return true
    } else {
      this.isFull = false
      return false
    }
  }
  getIdx (uid) {//TODO
    for (let i = 0; i < this.users.length; i++) {
      if(this.users[i].id === uid) return i
    }
    return -1
  }

  genRanStr (l) {//TODO
    let c = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let r = ''
    for (let i = 0; i < l; i++) {
      r += c[Math.floor(Math.random() * c.length)]
    }
    return r
  }
}

module.exports = RoomManager
