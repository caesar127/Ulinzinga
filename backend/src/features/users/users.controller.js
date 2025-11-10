import User from './users.model.js';

const userController = {
  getAllUsers: async (req, res) => {
    try {
      // Only admins can get all users
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin role required.' });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const users = await User.find({ isActive: true })
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await User.countDocuments({ isActive: true });

      res.json({
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params;

      // Users can only view their own profile unless they're admin
      if (req.user.userId !== id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. You can only view your own profile.' });
      }

      const user = await User.findById(id).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      console.error('Get user by ID error:', error);

      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }

      res.status(500).json({ message: 'Failed to fetch user' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Users can only update their own profile unless they're admin
      if (req.user.userId !== id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
      }

      // Prevent users from updating sensitive fields
      const allowedUpdates = ['name', 'profile'];
      const filteredUpdates = {};

      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      });

      // Only admins can change roles
      if (updates.role && req.user.role === 'admin') {
        filteredUpdates.role = updates.role;
      }

      const user = await User.findByIdAndUpdate(
        id,
        filteredUpdates,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        message: 'User updated successfully',
        user
      });
    } catch (error) {
      console.error('Update user error:', error);

      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          message: 'Validation error',
          errors: messages
        });
      }

      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }

      res.status(500).json({ message: 'Failed to update user' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      // Users can only delete their own account unless they're admin
      if (req.user.userId !== id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. You can only delete your own account.' });
      }

      // Soft delete by setting isActive to false
      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);

      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }

      res.status(500).json({ message: 'Failed to delete user' });
    }
  }
};

export default userController;