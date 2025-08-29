import { model, Schema } from "mongoose";

const runnerSchema = new Schema({
  selectionId: { type: Number, required: true },
  runnerName: { type: String, required: true },
  handicap: { type: Number, default: 0 },
  sortPriority: { type: Number }
}, { _id: false });

const marketSchema = new Schema({
  marketId: { type: String, required: true },
  marketName: { type: String, required: true },
  runners: [runnerSchema],
  isAdded: { type:Boolean, default:true}
}, { _id: false });

const eventSchema = new Schema({
  eventId: { type: String, required: true, unique: true },
  eventName: { type: String, required: true },
  competitionName: { type: String },
  competitionId: { type: String, required: true },
  sportId: { type: String, required: true },
  sportName: { type: String, required: true },
  markets: [marketSchema],
  marketName: { type: String },
  marketId: { type: String },
  openDate: { type: Date },
  matchRunners: [runnerSchema],
  marketCount: { type: Number, default: 0 },
  totalMatched: { type: String, default: "" },
  isAdded: { type: Boolean, default: true}
}, { timestamps: true });

const Event = model("events", eventSchema);
export default Event;