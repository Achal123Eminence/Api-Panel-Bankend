import { Schema, model } from 'mongoose';

const manualEventSchema = new Schema(
  {
    competitionId: { type: Number, unique: true, required: true },
    competitionName: { type: String, required: true },
    sportId: { type: String, required: true },
    eventId: { type: Number, unique: true, required: true },
    eventName: { type: String, required: true },
    marketId: { type: String, required: true },
    eventType: { type: String, enum: ["manual", "virtual"], required: true },
    openDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const ManualEvent = model("ManualEvent", manualEventSchema);
export default ManualEvent;