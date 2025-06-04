const CustomRouter = require('../../CustomRouter');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const { jwtAuth, injectUser } = require('../../middlewares/auth');

const router = new CustomRouter();
router.router.use(injectUser);

// Crear orden a partir del carrito del usuario
router.post('/', ['user', 'admin'], jwtAuth, async (req, res) => {
  try {
    const cart = await Cart.findById(req.user.cart).populate('products.product');
    if (!cart || cart.products.length === 0) return res.sendError('Cart is empty');
    // Calcular total y armar productos
    let total = 0;
    const orderProducts = cart.products.map(item => {
      total += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      };
    });
    const order = await Order.create({
      user: req.user._id,
      cart: cart._id,
      products: orderProducts,
      total
    });
    // Vaciar carrito
    cart.products = [];
    await cart.save();
    res.sendSuccess(order);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Obtener mis órdenes
router.get('/mine', ['user', 'admin'], jwtAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('products.product');
    res.sendSuccess(orders);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Obtener todas las órdenes (solo admin)
router.get('/', ['admin'], jwtAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.product');
    res.sendSuccess(orders);
  } catch (error) {
    res.sendError(error.message);
  }
});

module.exports = router.getRouter(); 