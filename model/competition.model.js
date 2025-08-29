import { model, Schema } from "mongoose";

const competitionSchema = new Schema({
  sportId: { type: String, required: true },
  competitionId: { type: String, required: true },
  competitionName: { type: String },
  competitionType: { type: String, enum:["manual","befair"], required: true},
  markets: { 
    type: [String], 
    enum:["To Win the Toss","Completed Match","Tied Match","Match Odds","Over/Under","Winner","Set 1 Winner","Set 2 Winner"]
  },
  liveOdds: { type: Boolean, default: false},
  bookMaker: { type: Boolean, default: false},
  fancy: { type: Boolean, default: false},
  premium: { type: Boolean, default: false},
  competitionGrade: { type: String,enum:["A","B","C"] ,default:"A"},
  volumeCheck: { type: Boolean, default: true},
  status: { type: Boolean, default: true},
  openDate: { type: Date },
  endDate: { type: Date },
  closeDate: { type: Date }
}, { timestamps: true });

const Competition = model("competition", competitionSchema);
export default Competition;