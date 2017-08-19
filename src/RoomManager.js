class RoomManager {
  constructor () {
    this.rooms = []
  }

  make (user, full) { //fullは定員数
    this.rooms.push(new Room(user, full))
  }
  delete (rid) {
    this.rooms.splice(this.getIdx(rid), 1)
  }
  getRoomInfo (uid) {
    for (let i = 0; i < this.rooms.length; i++) {
      if(this.rooms[i].exists(uid)) return this.rooms[this.getIdx(rid)]
    }
    return -1
  }

  makeOrJoinMethod (user, full) {
    // return -1:makroom, 0:join but still not full, 1:join and full, 2:room is full, 3:this user already exists
    let idx = this.getNotfullIdx()
    if(idx === -1) {
      make (user, full)
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
    this.id = getRanStr(8)
    this.members = [user]
    this.full = Math.max(1, Math.ceil(n)) // 1以下だった場合は1として扱う。 1より大きい場合はMath.ceil
    if(n <= 1) {
      this.isFull = true
    } else {
      this.isFull = false
    }
  }

  joinUser (user) { //return 0:join but still not full, 1:join and full, 2:room is full, 3:this user already exists
    if(this.isFull) return 2
    if(this.getIdx(user.id) !== -1) return 3
    this.members.push(user)
    if(this.members.length >= this.full) {
      this.isFull = true
      return 1
    }
    return 0
  }
  exists (uid) {
    if(this.getIdx(uid) === -1) return false
    return true
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
