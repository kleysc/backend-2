module.exports = function(user) {
  return {
    id: user._id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role
  };
};
