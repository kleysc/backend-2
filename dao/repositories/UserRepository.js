const BaseRepository = require('./BaseRepository');
const User = require('../../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  getByEmail(email) {
    return this.model.findOne({ email });
  }
}

module.exports = new UserRepository();
