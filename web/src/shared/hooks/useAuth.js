import { useSelector } from 'react-redux';

/**
 * Custom hook to access authentication state
 * @returns {Object} - Auth state including user, token, and isAuthenticated
 */
export const useAuth = () => {
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  return {
    user,
    token,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isVendor: user?.role === 'vendor',
    isOrganizer: user?.role === 'organizer',
    isUser: user?.role === 'user',
  };
};
