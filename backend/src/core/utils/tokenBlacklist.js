class TokenBlacklist {
  constructor() {
    this.blacklistedTokens = new Set();
    this.tokenExpiryTimes = new Map();
  }
  
  blacklistToken(token, expiryTime) {
    this.blacklistedTokens.add(token);
    if (expiryTime) {
      this.tokenExpiryTimes.set(token, expiryTime);
    }
  }
  
  isTokenBlacklisted(token) {
    if (!this.blacklistedTokens.has(token)) {
      return false;
    }
    
    const expiryTime = this.tokenExpiryTimes.get(token);
    if (expiryTime && Date.now() > expiryTime) {
      this.blacklistedTokens.delete(token);
      this.tokenExpiryTimes.delete(token);
      return false;
    }

    return true;
  }
  
  cleanupExpiredTokens() {
    const now = Date.now();
    for (const [token, expiryTime] of this.tokenExpiryTimes.entries()) {
      if (now > expiryTime) {
        this.blacklistedTokens.delete(token);
        this.tokenExpiryTimes.delete(token);
      }
    }
  }
  
  getBlacklistedTokenCount() {
    this.cleanupExpiredTokens();
    return this.blacklistedTokens.size;
  }
}

const tokenBlacklist = new TokenBlacklist();

setInterval(() => {
  tokenBlacklist.cleanupExpiredTokens();
}, 60 * 60 * 1000);

export default tokenBlacklist;