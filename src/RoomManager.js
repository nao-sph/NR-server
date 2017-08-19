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
  delete (rid) { //部屋を消す
    console.log('RM.delete')
    console.log('rid', rid)
    let idx = this.getIdx(rid)
    if(idx === -1) return
    this.rooms.splice(idx, 1)
  }
  deleteUser (uid) { //部屋から人を消す
    console.log('RM.deleteUser')
    console.log('uid', uid)
    let room = this.getRoomInfo()
    if(this.getRoomInfo(uid) === -1) return
    let rid = this.getRoomInfo(uid).id
    let idx = this.getIdx(rid)
    if(idx === -1) return
    this.rooms[idx].leaveUser(uid)
    console.log('-------------checkpoint')
    console.log(this.rooms[idx].members.length)
    if(this.rooms[idx].members.length === 0){
      this.delete(rid)
    }
  }
  getRoomInfo (uid) {
    console.log('RM.getRoomInfo')
    console.log('uid', uid)
    for (let i = 0; i < this.rooms.length; i++) {
      let ridx = this.rooms[i].getIdx(uid)
      if(ridx === -1) return this.rooms[ridx]
    }
    return -1
  }

  makeOrJoinMethod (user, full) {
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

  getNotfullIdx () {
    for (let i = 0; i < this.rooms.length; i++) {
      if(!(this.rooms[i].isFull)) return i
    }
    return -1
  }
  getIdx (rid) {
    for (let i = 0; i < this.rooms.length; i++) {
      if(this.rooms[i].id === rid) return
    }
    return -1
  }
}

class Room {
  constructor (user, n) { //n:自然数 は定員
    this.id = this.genRanStr(8)
    this.members = [user]
    this.full = Math.max(1, Math.ceil(n)) // 1以下だった場合は1として扱う。 1より大きい場合はMath.ceil
    this.isFull = false
    this.checkFull()
  }

  joinUser (user) { //return 0:join but still not full, 1:join and full, 2:room is full, 3:this user already exists
    console.log('Room.joinUser')
    console.log('user',user)
    if(this.isFull) return 2
    if(this.getIdx(user.id) !== -1) return 3
    this.members.push(user)
    if(this.checkFull()) return 1
    return 0
  }
  leaveUser (uid) {
    console.log('Room.leaveUser')
    console.log('uid',uid)
    this.members.splice(this.getIdx(uid),1)
    this.checkFull()
  }
  exists (uid) {
    console.log('Room.exists')
    console.log('uid',uid)
    if(this.getIdx(uid) === -1) return false
    return true
  }

  checkFull () {
    console.log('Room.checkFull')
    if(this.members.length >= this.full) {
      this.isFull = true
      return true
    } else {
      this.isFull = false
      return false
    }
  }
  getIdx (uid) {
    for (let i = 0; i < this.members.length; i++) {
      if(this.members[i].id === uid) return i
    }
    return -1
  }

  genRanStr (l) {
    let c = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let r = ''
    for (let i = 0; i < l; i++) {
      r += c[Math.floor(Math.random() * c.length)]
    }
    return r
  }
}

module.exports = RoomManager
