import crypto from "crypto";
import { MATCH_THRESHOLD, STABLE_KEYS } from "../common/constants.js";
import User from "../model/user.model.js";

export const fingerprintMiddleware = async (req, res, next) => {
  try {
    const { components } = req.body;
    const userData = req.user; // comes from authMiddleware

    if (!components || typeof components !== "object") {
      return res.status(400).json({ message: "Fingerprint data missing or invalid" });
    }

    // --- Step 1: Primary hash only from stable keys ---
    const primaryObj = {};
    STABLE_KEYS.forEach((k) => {
      if (components[k] !== undefined) primaryObj[k] = components[k];
    });
    const primaryHash = hashOf(primaryObj);

    // --- Step 2: Load user fingerprint details from DB ---
    const user = await User.findById(userData.id).select("fingerprintDetails");
    let fingerprintInfo = user?.fingerprintDetails || null;

    // --- Step 3: No fingerprint stored yet → Save it ---
    if (!fingerprintInfo) {
      const newEntry = {
        components,
        primaryHash,
        firstSeen: new Date(),
        lastSeen: new Date(),
      };

      await User.updateOne({ _id: userData.id }, { fingerprintDetails: newEntry });
      return next();
    }

    // --- Step 4: Exact match ---
    if (fingerprintInfo.primaryHash === primaryHash) {
      fingerprintInfo.lastSeen = new Date();
      await User.updateOne({ _id: userData.id }, { fingerprintDetails: fingerprintInfo });
      return next();
    }

    // --- Step 5: Fuzzy match ---
    let matches = 0;
    let considered = 0;
    for (const key of Object.keys(components)) {
      if (components[key] === undefined || fingerprintInfo.components[key] === undefined) continue;
      considered++;
      if (String(components[key]) === String(fingerprintInfo.components[key])) matches++;
    }

    const score = considered === 0 ? 0 : matches / considered;
    if (score >= MATCH_THRESHOLD) {
      fingerprintInfo = {
        ...fingerprintInfo,
        components,
        primaryHash,
        lastSeen: new Date(),
      };

      await User.updateOne({ _id: userData.id }, { fingerprintDetails: fingerprintInfo });
      return next();
    }

    return res.status(400).json({ message: "Fingerprint mismatch. New device detected." });
  } catch (err) {
    console.error("Fingerprint middleware error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

function hashOf(obj) {
  const s = JSON.stringify(obj, Object.keys(obj).sort());
  return crypto.createHash("sha256").update(s).digest("hex");
}
