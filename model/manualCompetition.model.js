import { Schema, model } from 'mongoose';

const manualCompetitionSchema = new Schema(
  {
    competitionId: { type: Number, unique: true, required: true },
    competitionName: { type: String, required: true },
    sportId: { type: String, required: true },
    competitionType: { type: String, enum: ["manual", "virtual"], required: true },
    openDate: { type: Date, required: true },
    status: { type: Boolean, default: true},
  },
  { timestamps: true }
);

const ManualCompetition = model("ManualCompetition", manualCompetitionSchema);
export default ManualCompetition;