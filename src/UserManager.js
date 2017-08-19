class UserManager {
  constructor () {
    this.users = []
  }

  add (id, data) {
    this.users.push(new User(id, data))
  }
  delete (id) {
    this.users.splice(this.getIdx(id), 1)
  }
  getData (id) {
    this.users[getIdx(id)].data
  }

  getIdx (id) {
    for (let i = 0; i < this.users.length; i++) {
      if(this.users[i].ID === id) {
        return i
      }
    }
    return -1
  }
}

class User {
  constructor (id, data) {
    this.ID = id
    this.data = data
  }
}

exports.module = UserManager
