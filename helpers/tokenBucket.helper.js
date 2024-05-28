/**
 * TokenBucket class for rate limiting using a token bucket algorithm.
 */
class TokenBucket {

  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefillTime = Date.now();
    this.refillInterval = 1000;
  }

  /**
   * Asynchronously consumes tokens from the bucket.
   * @param {number} tokens Number of tokens to consume.
   * @returns {Promise<boolean>} Promise that resolves to true if tokens are successfully consumed, false otherwise.
   */
  async consumeTokens(tokens) {
    await this.refillTokens();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Asynchronously refills tokens based on elapsed time since last refill and refill rate.
   */
  async refillTokens() {
    const currentTime = Date.now();
    const timeElapsed = currentTime - this.lastRefillTime;
    const tokensToAdd =
      Math.floor(timeElapsed / this.refillInterval) * this.refillRate;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTime = currentTime;
  }
}

module.exports = TokenBucket;
