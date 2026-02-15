try {
  const c = require("node:crypto");
  if (!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== "function") {
    globalThis.crypto = c.webcrypto;
  }
} catch (e) {}
