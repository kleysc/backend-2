const BaseRepository = require('./BaseRepository');
const Ticket = require('../../models/Ticket');

class TicketRepository extends BaseRepository {
  constructor() {
    super(Ticket);
  }

  getByCode(code) {
    return this.model.findOne({ code });
  }
}

module.exports = new TicketRepository();
