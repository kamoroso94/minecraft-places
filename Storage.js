export default class Storage {
  constructor(storage = window.localStorage) {
    this.storage = storage;
  }

  get length() {
    return this.storage.length;
  }

  key(n) {
    return this.storage.key(n);
  }

  has(key) {
    return this.storage.getItem(key) != null;
  }

  get(key) {
    return JSON.parse(this.storage.getItem(key));
  }

  set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  remove(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}
