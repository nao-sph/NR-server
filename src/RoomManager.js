class RoomManager {
  constructor () {
    this.rooms = []
    this.players = []
  }

  // playerはID、name、roomIDをkeyにもつインスタンス(server.js)
  // returnは[数字, Room]　最初の数字は0:待機、1:開始、2:復帰
  access (player) {
    // playerがすでにroomIDを持っていた時の処理
    if (player.roomID !== null) {
      for(let i = 0; i < this.rooms.length; i++) {
        if (player.roomID === this.rooms[i].ID) {
          return [2, this.room[i]]
        }
      }
    }

    // 既存の部屋を全てみて空きがあれば入る
    for (let i = 0; i < this.rooms.length; i++){
      if(!(this.rooms[i].isFull)) {
        this.rooms[i].members.push(player)
        player.roomID = this.rooms[i].ID
        this.rooms[i].isFull = true
        return [1, this.rooms[i]]
      }
    }
    // なければ作成
    let room = new Room(player)
    this.rooms.push(room)
    player.roomID = room.ID
    return [0, null]
  }

  delete (roomID) {
    for (let i = 0; i < this.rooms.length; i++) {
      if(this.rooms[i].ID === roomID) {
        this.rooms[i].splice(i,1)
        return
      }
    }
  }
  getRmfrompID (pID) {//TODO
    for (let i = 0; i < this.rooms.length; i++) {
      if(this.rooms[i].ID === roomID) {
        this.rooms[i].splice(i,1)
        return
      }
    }
  }
}

class Room {
  constructor (player) {
    this.ID = this.genRanStr(8)
    this.members = [player]
    this.bm = null
    this.stageNum = null
    this.isFull = false
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
