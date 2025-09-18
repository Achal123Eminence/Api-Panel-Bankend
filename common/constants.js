import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const MONGO_URI_LOCAL = process.env.MONGO_URI_LOCAL;
export const REDIS_URL = process.env.REDIS_URL;
export const ALGORITHM = process.env.ALGORITHM;
export const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
export const MATCH_THRESHOLD = 0.7; // 70% match required
export const STABLE_KEYS = [
  "webglVendor",
  "webglRenderer",
  "canvasHash",
  "audioHash",
  "hardwareConcurrency",
  "deviceMemory",
  "platform",
  "timezone",
  "userAgent"
];