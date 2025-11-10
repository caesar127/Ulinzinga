import passport from 'passport';

// Middleware to authenticate using Passport JWT strategy
const authenticateToken = passport.authenticate('jwt', { session: false });

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export { authenticateToken, requireAdmin };