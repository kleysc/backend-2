// Session routes for login and JWT validation
const CustomRouter = require('../../CustomRouter');
const jwt = require('jsonwebtoken');
const { localAuth, jwtAuth, injectUser } = require('../../middlewares/auth');

const router = new CustomRouter();

// Inyectar req.user si hay JWT (para políticas)
router.router.use(injectUser);

// Login route (público)
router.post('/login', ['PUBLIC'], localAuth, (req, res) => {
  // Generate JWT token
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.sendSuccess({
    token,
    user: {
      id: req.user._id,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      role: req.user.role
    }
  });
});

// Current user route (cualquier autenticado)
router.get('/current', ['user', 'admin'], jwtAuth, (req, res) => {
  res.sendSuccess({
    user: {
      id: req.user._id,
      email: req.user.email,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      role: req.user.role
    }
  });
});

module.exports = router.getRouter(); 