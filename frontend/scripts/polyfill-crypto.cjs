try {
  const c = require("node:crypto");
  const gv = (arr) => {
    if (!arr || typeof arr.byteLength !== "number") throw new TypeError("Expected TypedArray");
    const buf = c.randomBytes(arr.byteLength);
    const view = new Uint8Array(buf);
    new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength).set(view);
    return arr;
  };
  if (typeof c.getRandomValues !== "function") c.getRandomValues = gv;
  if (!globalThis.crypto) globalThis.crypto = {};
  if (typeof globalThis.crypto.getRandomValues !== "function") globalThis.crypto.getRandomValues = gv;
} catch (e) {}
