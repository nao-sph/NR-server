class BattleManager { // playerそれぞれのIDと、一つ前のコマンドを保持する
  constructor (pID1, pID2, stageNum) {
    this.players = [new pStatus(pID1), new pStatus(pID2)]
    this.sentCount = 0
  }

  setCmd (pID, command) { // idとコマンドを受けて、１人分ならnull,揃ったらcmdをreturn
    let cmd = command
    let pIdx = this.getPIdx(pID)
    if(cmd === -1) {
      while(true) {
        let ran = Math.floor(Math.random() * 4)
        if(this.players[pIdx].latestCmd !== ran) {
          cmd = ran
          break
        }
      }
    }

    this.players[pIdx].latestCmd = cmd
    if(this.sentCount === 1){
      this.sentCount = 0
      return [{
        id: this.players[0].ID,
        cmd: this.players[0].latestCmd
      },{
        id: this.players[1].ID,
        cmd: this.players[1].latestCmd
      }]
    }
    this.sentCount++
    return null
  }
  getPIdx (pID) {
    for(let i = 0; i < 2; i++) {
      if(this.players[i].ID === pID) {
        return i
      }
    }
  }
}

class pStatus {
  constructor (pID) {
    this.ID = pID
    this.latestCmd = null
  }
}

module.exports = BattleManager
