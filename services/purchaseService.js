const TicketRepository = require('../dao/repositories/TicketRepository');
const CartRepository = require('../dao/repositories/CartRepository');
const ProductRepository = require('../dao/repositories/ProductRepository');
const { v4: uuidv4 } = require('uuid');

async function purchaseCart(cartId, purchaserEmail) {
  const cart = await CartRepository.getById(cartId).populate('products.product');
  if (!cart || cart.products.length === 0) return { error: 'Cart is empty' };

  let amount = 0;
  const purchasedProducts = [];
  const remainingProducts = [];

  for (const item of cart.products) {
    const product = await ProductRepository.getById(item.product._id);
    if (product.stock >= item.quantity) {
      product.stock -= item.quantity;
      await product.save();
      purchasedProducts.push({ product: product._id, quantity: item.quantity, price: product.price });
      amount += product.price * item.quantity;
    } else {
      remainingProducts.push(item);
    }
  }

  cart.products = remainingProducts;
  await cart.save();

  if (purchasedProducts.length === 0) return { error: 'No products could be purchased', cart };

  const ticket = await TicketRepository.create({
    code: uuidv4(),
    amount,
    purchaser: purchaserEmail,
    products: purchasedProducts
  });

  return { ticket, cart };
}

module.exports = { purchaseCart };
