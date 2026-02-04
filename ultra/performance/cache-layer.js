/**
 * Cache Layer - طبقة التخزين المؤقت
 * تحسين الأداء من خلال التخزين الذكي للبيانات
 */

const cache = new Map();
const stats = {
  hits: 0,
  misses: 0,
  sets: 0,
};

export function cached(key, ttl, fn) {
  const now = Date.now();
  
  if (cache.has(key)) {
    const v = cache.get(key);
    if (now < v.exp) {
      stats.hits++;
      return v.data;
    }
    cache.delete(key);
  }
  
  stats.misses++;
  const data = fn();
  cache.set(key, { data, exp: now + ttl });
  stats.sets++;
  
  return data;
}

export function cacheAsync(key, ttl, asyncFn) {
  return new Promise((resolve, reject) => {
    const now = Date.now();
    
    if (cache.has(key)) {
      const v = cache.get(key);
      if (now < v.exp) {
        stats.hits++;
        resolve(v.data);
        return;
      }
      cache.delete(key);
    }
    
    stats.misses++;
    asyncFn()
      .then((data) => {
        cache.set(key, { data, exp: now + ttl });
        stats.sets++;
        resolve(data);
      })
      .catch(reject);
  });
}

export function invalidateCache(pattern) {
  let count = 0;
  for (const key of cache.keys()) {
    if (typeof pattern === "string" && key.includes(pattern)) {
      cache.delete(key);
      count++;
    } else if (pattern instanceof RegExp && pattern.test(key)) {
      cache.delete(key);
      count++;
    }
  }
  return count;
}

export function clearCache() {
  cache.clear();
  return { cleared: true };
}

export function getCacheStats() {
  const total = stats.hits + stats.misses;
  const hitRate = total > 0 ? ((stats.hits / total) * 100).toFixed(2) : 0;
  
  return {
    ...stats,
    hitRate: `${hitRate}%`,
    size: cache.size,
  };
}

export function setCacheSize(key, data, maxSize = 100) {
  if (cache.size >= maxSize) {
    // حذف أقدم عنصر (FIFO)
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, data);
}

export class CacheManager {
  constructor(options = {}) {
    this.ttl = options.ttl || 60000;
    this.maxSize = options.maxSize || 100;
    this.cache = new Map();
  }
  
  get(key) {
    if (this.cache.has(key)) {
      const item = this.cache.get(key);
      if (Date.now() < item.exp) {
        return item.data;
      }
      this.cache.delete(key);
    }
    return null;
  }
  
  set(key, data, ttl = this.ttl) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      data,
      exp: Date.now() + ttl,
    });
  }
  
  invalidate(pattern) {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (typeof pattern === "string" && key.includes(pattern)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }
  
  clear() {
    this.cache.clear();
  }
  
  size() {
    return this.cache.size;
  }
}
