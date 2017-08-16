class BattleManager { // ダメージ管理
  constructor (pID1, pID2) {
    this.p1 = new BattleStatus(pID1)
    this.p2 = new BattleStatus(pID2)
    this.Status = ['continue', 'p1 lose', 'p2 lose', 'draw']
  }

  turn (p1Damage, p2Damage) {
    this.p1.damaged(p1Damage)
    this.p2.damaged(p2Damage)
    if(this.p1.HP <= 0  && this.p2.HP <= 0) {
      return this.Status[3] //draw
    }
    if(this.p1.HP <= 0) {
      return this.Status[1] //p1 lose
    }
    if(this.p2.HP <= 0) {
      return this.Status[2] //p2 lose
    }
    return this.Status[0] //continue
  }
}

class BattleStatus {
  constructor (pID) {
    this.ID = pID
    this.HP = 100
  }

  damaged (num) {
    this.HP -= num
  }
}

module.exports = BattleManager
