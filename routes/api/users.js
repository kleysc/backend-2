const CustomRouter = require('../../CustomRouter');
const UserRepository = require('../../dao/repositories/UserRepository');
const CartRepository = require('../../dao/repositories/CartRepository');
const { jwtAuth, injectUser } = require('../../middlewares/auth');

const router = new CustomRouter();

// Inyectar req.user si hay JWT (para políticas)
router.router.use(injectUser);

// Crear usuario (público)
router.post('/', ['PUBLIC'], async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;
    const existingUser = await UserRepository.getByEmail(email);
    if (existingUser) return res.sendError('User with this email already exists');
    const cart = await CartRepository.create({});
    const user = await UserRepository.create({
      first_name,
      last_name,
      email,
      age,
      password,
      cart: cart._id,
      role: role || 'user'
    });
    res.sendSuccess({
      id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role
    });
  } catch (error) {
    res.sendError(error.message);
  }
});

// Obtener todos los usuarios (solo admin)
router.get('/', ['admin'], jwtAuth, async (req, res) => {
  try {
    const users = await UserRepository.getAll().select('-password');
    res.sendSuccess(users);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Obtener usuario por ID (cualquier autenticado)
router.get('/:id', ['user', 'admin'], jwtAuth, async (req, res) => {
  try {
    const user = await UserRepository.getById(req.params.id).select('-password');
    if (!user) return res.sendError('User not found');
    res.sendSuccess(user);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Actualizar usuario (cualquier autenticado, solo admin puede cambiar role)
router.put('/:id', ['user', 'admin'], jwtAuth, async (req, res) => {
  try {
    const { first_name, last_name, age, role } = req.body;
    const updateData = { first_name, last_name, age };
    if (role && req.user.role === 'admin') updateData.role = role;
    const user = await UserRepository.update(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    if (!user) return res.sendError('User not found');
    res.sendSuccess(user);
  } catch (error) {
    res.sendError(error.message);
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', ['admin'], jwtAuth, async (req, res) => {
  try {
    const user = await UserRepository.delete(req.params.id);
    if (!user) return res.sendError('User not found');
    res.sendSuccess({ message: 'User deleted successfully' });
  } catch (error) {
    res.sendError(error.message);
  }
});

module.exports = router.getRouter(); 