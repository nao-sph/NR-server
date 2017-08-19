class UserManager {
  constructor () {
    this.users = []
  }

  add (user) {
    this.users.push(user)
  }
  delete (id) {
    this.users.splice(this.getIdx(id), 1)
  }
  getData (id) {
    let idx = this.getIdx(id)
    if(idx === -1) {
      console.log(`cannot find user: ${id}`);
      return -1
    }
    return this.users[idx].data
  }
  setData (id, data) {
    this.users[this.getIdx(id).data] = data
  }

  getIdx (id) {
    for (let i = 0; i < this.users.length; i++) {
      if(this.users[i].id === id) return i
    }
    return -1
  }
}


module.exports = UserManager
