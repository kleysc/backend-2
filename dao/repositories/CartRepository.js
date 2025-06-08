const BaseRepository = require('./BaseRepository');
const Cart = require('../../models/Cart');

class CartRepository extends BaseRepository {
  constructor() {
    super(Cart);
  }
}

module.exports = new CartRepository();
