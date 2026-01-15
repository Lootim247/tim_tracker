"use client";

export class SignedUrlLRUCache {
  constructor(maxSize = 20, ttlMs = 60_000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
    this.inFlight = new Map(); // deduplicate concurrent fetches
  }

  _isExpired(entry) {
    return Date.now() > entry.expiresAt;
  }

  _touch(key, entry) {
    this.cache.delete(key);
    this.cache.set(key, entry);
  }

  _evictIfNeeded() {
    if (this.cache.size < this.maxSize) return;
    const lruKey = this.cache.keys().next().value;
    this.cache.delete(lruKey);
  }

  async _fetchUrl(owner, type) {
    const res = await fetch("/tim-tracker/api/get-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, type }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error || "Failed to fetch image");
    }

    const { url } = await res.json();
    return url;
  }

  async get(owner, type) {
    const key = `${owner}-${type}`;
    const cached = this.cache.get(key);

    if (cached && !this._isExpired(cached)) {
      this._touch(key, cached);
      return cached.url;
    }

    if (this.inFlight.has(key)) return this.inFlight.get(key);

    const promise = (async () => {
      try {
        const url = await this._fetchUrl(owner, type);
        this._evictIfNeeded();
        this.cache.set(key, { url, expiresAt: Date.now() + this.ttlMs });
        return url;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }
}

// singleton instance
export const image_LRUCache = new SignedUrlLRUCache(20, 60_000);
