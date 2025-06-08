const CustomRouter = require('../../CustomRouter');
const CartRepository = require('../../dao/repositories/CartRepository');
const ProductRepository = require('../../dao/repositories/ProductRepository');
const { purchaseCart } = require('../../services/purchaseService');
const { jwtAuth, injectUser } = require('../../middlewares/auth');

const router = new CustomRouter();
router.router.use(injectUser);

// Obtener el carrito del usuario autenticado
router.get('/mine', ['user', 'admin'], jwtAuth, async (req, res) => {
  try {
    const cart = await CartRepository.getById(req.user.cart).populate('products.product');
    if (!cart) return res.sendError('Cart not found');
    res.sendSuccess(cart);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Agregar producto al carrito
router.post('/mine/products', ['user'], jwtAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await CartRepository.getById(req.user.cart);
    if (!cart) return res.sendError('Cart not found');
    const product = await ProductRepository.getById(productId);
    if (!product) return res.sendError('Product not found');
    const existing = cart.products.find(p => p.product.equals(productId));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    await cart.save();
    res.sendSuccess(cart);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Quitar producto del carrito
router.delete('/mine/products/:productId', ['user'], jwtAuth, async (req, res) => {
  try {
    const cart = await CartRepository.getById(req.user.cart);
    if (!cart) return res.sendError('Cart not found');
    cart.products = cart.products.filter(p => !p.product.equals(req.params.productId));
    await cart.save();
    res.sendSuccess(cart);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Vaciar carrito
router.delete('/mine', ['user'], jwtAuth, async (req, res) => {
  try {
    const cart = await CartRepository.getById(req.user.cart);
    if (!cart) return res.sendError('Cart not found');
    cart.products = [];
    await cart.save();
    res.sendSuccess(cart);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Purchase cart and generate ticket (only user)
router.post('/mine/purchase', ['user'], jwtAuth, async (req, res) => {
  try {
    const result = await purchaseCart(req.user.cart, req.user.email);
    if (result.error) return res.sendError(result.error);
    res.sendSuccess(result);
  } catch (error) {
    res.sendError(error.message);
  }
});

module.exports = router.getRouter(); 