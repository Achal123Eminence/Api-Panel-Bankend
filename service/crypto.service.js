import crypto from "crypto";
import { ALGORITHM, ENCRYPTION_SECRET } from "../common/constants.js";

const keyHash = crypto.createHash("sha256").update(ENCRYPTION_SECRET).digest("base64");
const keyUtf8 = keyHash.substring(0, 32);
export const SECRET_KEY = Buffer.from(keyUtf8, "utf8"); // parse same as frontend

export const IV = Buffer.from("0000000000000000", "utf8"); // 16 chars

// Encrypt function
export function encrypt(data) {
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

// Decrypt function
export function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, IV);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}

// Middleware: decrypt incoming requests
export function decryptRequestMiddleware(req, res, next) {
  try {
    if (req.body && typeof req.body === "string") {
      req.body = decrypt(req.body); // overwrite body with decrypted JSON
    }
    next();
  } catch (err) {
    console.error("Request decryption failed:", err.message);
    res.status(400).json({ error: "Invalid encrypted request" });
  }
};

// Middleware: encrypt outgoing responses
export function encryptResponseMiddleware(req, res, next) {
  const oldJson = res.json;
  res.json = function (data) {
    try {
      // Only encrypt if status is success (200-299)
      if (this.statusCode >= 200 && this.statusCode < 300) {
        const encrypted = encrypt(data);
        return oldJson.call(this, { payload: encrypted });
      }

      // For errors, send plain JSON (so frontend can read error codes)
      return oldJson.call(this, data);
    } catch (err) {
      console.error("Response encryption failed:", err.message);
      return oldJson.call(this, { error: "Encryption failed" });
    }
  };
  next();
}