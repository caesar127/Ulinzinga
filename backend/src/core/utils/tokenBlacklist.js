// Simple in-memory token blacklist store
// In production, this should be replaced with Redis or database storage

class TokenBlacklist {
  constructor() {
    this.blacklistedTokens = new Set();
    this.tokenExpiryTimes = new Map();
  }

  // Add a token to the blacklist
  blacklistToken(token, expiryTime) {
    this.blacklistedTokens.add(token);
    if (expiryTime) {
      this.tokenExpiryTimes.set(token, expiryTime);
    }
  }

  // Check if a token is blacklisted
  isTokenBlacklisted(token) {
    if (!this.blacklistedTokens.has(token)) {
      return false;
    }

    // Check if token has expired (if expiry time is stored)
    const expiryTime = this.tokenExpiryTimes.get(token);
    if (expiryTime && Date.now() > expiryTime) {
      this.blacklistedTokens.delete(token);
      this.tokenExpiryTimes.delete(token);
      return false;
    }

    return true;
  }

  // Clean up expired tokens (should be called periodically)
  cleanupExpiredTokens() {
    const now = Date.now();
    for (const [token, expiryTime] of this.tokenExpiryTimes.entries()) {
      if (now > expiryTime) {
        this.blacklistedTokens.delete(token);
        this.tokenExpiryTimes.delete(token);
      }
    }
  }

  // Get count of blacklisted tokens (for monitoring)
  getBlacklistedTokenCount() {
    this.cleanupExpiredTokens();
    return this.blacklistedTokens.size;
  }
}

// Create singleton instance
const tokenBlacklist = new TokenBlacklist();

// Clean up expired tokens every hour
setInterval(() => {
  tokenBlacklist.cleanupExpiredTokens();
}, 60 * 60 * 1000);

export default tokenBlacklist;