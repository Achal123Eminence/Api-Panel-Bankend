import { Schema, model } from 'mongoose';

const fingerprintSchema = new Schema({
  components: { type: Object, default: {} },
  primaryHash: { type: String },
  firstSeen: { type: Date },
  lastSeen: { type: Date }
}, { _id: false });

const userSchema = new Schema(
    {
        username:{ type: String, unique: true, required: true, match: /^[a-zA-Z0-9]+$/, trim: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        phone: { type: String },
        fingerprintDetails: fingerprintSchema
    },
    {timestamps:true}
);

const User = model("users",userSchema);
export default User;