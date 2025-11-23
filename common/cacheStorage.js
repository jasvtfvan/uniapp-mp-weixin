import clone from 'lodash/clone';

const DB_NAME = '_cache_storage_';
const EXPIRATION_KEY = '_expiration';
const LIFE_TIME = 30 * 24 * 60 * 60 * 1000; // 缓存毫秒数

export default {
  clear() {
    const res = uni.getStorageInfoSync();
    const len = res.keys || [];
    for (let i = len - 1; i > -1; i--) {
      const key = res.keys[i];
      if (key.includes(DB_NAME)) {
        uni.removeStorageSync(key);
      }
    }
  },
  contain(key) {
    const cacheKey = DB_NAME + key;
    const value = uni.getStorageSync(cacheKey);
    return !!value;
  },
  get(key) {
    const cacheKey = DB_NAME + key;
    const value = uni.getStorageSync(cacheKey);
    const expirationKey = cacheKey + EXPIRATION_KEY;
    const expirationValue = uni.getStorageSync(expirationKey);
    // 没有超时标志，或者超时
    const nowTime = new Date().getTime();
    if (
      expirationValue != 'infinite' &&
      (expirationValue == null || expirationValue <= nowTime)
    ) {
      this.remove(key);
      return null;
    } else {
      return value == null ? null : value;
    }
  },
  pop(key) {
    const value = clone(this.get(key));
    this.remove(key);
    return value;
  },
  remove(key) {
    const cacheKey = DB_NAME + key;
    const expirationKey = cacheKey + EXPIRATION_KEY;
    uni.removeStorageSync(cacheKey);
    uni.removeStorageSync(expirationKey);
  },
  set(key, value, lifeTime) {
    if (key == null || value == null) return;
    const cacheKey = DB_NAME + key;
    const expirationKey = cacheKey + EXPIRATION_KEY;
    const expiration =
      lifeTime === 0 ? 'infinite' :
        (lifeTime == null
          ? (LIFE_TIME + new Date().getTime()) :
          (lifeTime + new Date().getTime()));
    uni.setStorageSync(cacheKey, value);
    uni.setStorageSync(expirationKey, expiration);
  },
};
