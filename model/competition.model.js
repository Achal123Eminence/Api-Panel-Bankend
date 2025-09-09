import { model, Schema } from "mongoose";

const limitSchema = new Schema({
  name:{type:String, required:true},
  baseCurrency:{type:Boolean,required:true},
  preMinStake:{type:String, required:true},
  preMaxStake:{type:String, required:true},
  preMaxPL:{type:String, required:true},
  minStake:{type:String, required:true},
  maxStake:{type:String, required:true},
  maxPL:{type:String, required:true},
  delay:{type:String, required:true},
  oddsLimit:{type:String, required:true},
  b2CpreMinStake:{type:String, required:true},
  b2CpreMaxStake:{type:String, required:true},
  b2CpreMaxPL:{type:String, required:true},
  b2CminStake:{type:String, required:true},
  b2CmaxStake:{type:String, required:true},
  b2CmaxPL:{type:String, required:true},
  b2Cdelay:{type:String, required:true},
  b2CoddsLimit:{type:String, required:true},
});

const marketSchema = new Schema({
  marketId: { type: String, required: true },
  marketName: { type: String, required: true },
  // status: { type: Boolean, default: true},
  type: { type:String},
  limit:[limitSchema],
}, { _id: false });

const competitionSchema = new Schema({
  sportId: { type: String, required: true },
  competitionId: { type: String, required: true },
  competitionName: { type: String },
  competitionType: { type: String, enum:["manual","betfair"], required: true},
  markets: [marketSchema],
  status: { type: Boolean, default: true},
  liveOdds: { type: Boolean, default: false},
  bookMaker: { type: Boolean, default: false},
  fancy: { type: Boolean, default: false},
  premium: { type: Boolean, default: false},
  competitionGrade: { type: String,enum:["A","B","C"] ,default:"A"},
  competitionB2CGrade: { type: String,enum:["A","B","C"] ,default:"A"},
  volumeCheck: { type: Boolean, default: true},
  openDate: { type: Date },
  endDate: { type: Date },
  closeDate: { type: Date }
}, { timestamps: true });

const Competition = model("competition", competitionSchema);
export default Competition;