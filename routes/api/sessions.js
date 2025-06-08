// Session routes for login and JWT validation
const CustomRouter = require('../../CustomRouter');
const jwt = require('jsonwebtoken');
const { localAuth, jwtAuth, injectUser } = require('../../middlewares/auth');
const UserRepository = require('../../dao/repositories/UserRepository');
const { sendPasswordResetEmail } = require('../../services/emailService');
const userDTO = require('../../dtos/user.dto');

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

// Send password reset email
router.post('/forgot-password', ['PUBLIC'], async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserRepository.getByEmail(email);
    if (!user) return res.sendError('User not found');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    await sendPasswordResetEmail(user.email, token);
    res.sendSuccess({ message: 'Email sent' });
  } catch (error) {
    res.sendError(error.message);
  }
});

// Reset password
router.post('/reset-password/:token', ['PUBLIC'], async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserRepository.getById(payload.id);
    if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
      return res.sendError('Invalid or expired token');
    }
    if (user.isValidPassword(password)) return res.sendError('Cannot reuse previous password');
    user.setPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.sendSuccess({ message: 'Password updated' });
  } catch (error) {
    res.sendError(error.message);
  }
});

// Current user route (cualquier autenticado)
router.get('/current', ['user', 'admin'], jwtAuth, (req, res) => {
  res.sendSuccess({ user: userDTO(req.user) });
});

module.exports = router.getRouter(); 