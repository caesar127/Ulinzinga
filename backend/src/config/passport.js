import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../features/users/users.model.js';

// JWT Strategy Options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
};

// JWT Strategy
passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      // Find user by ID from JWT payload
      const user = await User.findById(payload.userId);

      if (user && user.isActive) {
        // User found and active
        return done(null, {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        });
      } else if (user && !user.isActive) {
        // User found but deactivated
        return done(null, false, { message: 'Account is deactivated' });
      } else {
        // User not found
        return done(null, false, { message: 'User not found' });
      }
    } catch (error) {
      console.error('Passport JWT strategy error:', error);
      return done(error, false);
    }
  })
);

// Serialize user for session (if using sessions)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session (if using sessions)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      done(null, {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      });
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, false);
  }
});

export default passport;