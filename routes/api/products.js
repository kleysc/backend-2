// Product routes
const CustomRouter = require('../../CustomRouter');
const ProductRepository = require('../../dao/repositories/ProductRepository');
const { jwtAuth, authorizeRoles, injectUser } = require('../../middlewares/auth');

const router = new CustomRouter();

// Inyectar req.user si hay JWT (para políticas)
router.router.use(injectUser);

// Get all products (public)
router.get('/', ['PUBLIC'], async (req, res) => {
  try {
    const products = await ProductRepository.getAll();
    res.sendSuccess(products);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Get product by ID (public)
router.get('/:id', ['PUBLIC'], async (req, res) => {
  try {
    const product = await ProductRepository.getById(req.params.id);
    if (!product) return res.sendError('Product not found');
    res.sendSuccess(product);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Create new product (admin only)
router.post('/', ['admin'], jwtAuth, async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const product = await ProductRepository.create({ name, description, price, stock, category });
    res.sendSuccess(product);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Update product (admin only)
router.put('/:id', ['admin'], jwtAuth, async (req, res) => {
  try {
    const updateData = req.body;
    const product = await ProductRepository.update(req.params.id, updateData);
    if (!product) return res.sendError('Product not found');
    res.sendSuccess(product);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Delete product (admin only)
router.delete('/:id', ['admin'], jwtAuth, async (req, res) => {
  try {
    const product = await ProductRepository.delete(req.params.id);
    if (!product) return res.sendError('Product not found');
    res.sendSuccess(product);
  } catch (error) {
    res.sendError(error.message);
  }
});

module.exports = router.getRouter(); 