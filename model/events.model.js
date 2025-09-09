import { model, Schema } from "mongoose";

const inningInfoSchema = new Schema({
  perInningOver: { type: Number, required: true },
  totalOver: { type: Number, required: true },
  maxInningNumber: { type: Number, required: true },
}, { _id: false });

const tossInfo = new Schema({
  eventId:{ type: String, required: true, unique: true },
  eventName: { type: String, required: true },
  name: { type: String, default:"Who will win the toss" },
  provider:{ type: String, default:"toss" },
  runnersId:{ type: Number, required:true },
  runnersName:{ type: String, default:"Who will win the toss" },
  fancyId:{ type: String, required: true, unique: true },
  mType:{ type: String, enum:["normal","winner"]},
  status: { type: String, enum:["OPEN","CLOSED"], default:"OPEN"},
  openDate: { type: String },
}, { _id: false });

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

const runnerSchema = new Schema({
  selectionId: { type: Number, required: true },
  runnerName: { type: String, required: true },
  handicap: { type: Number, default: 0 },
  sortPriority: { type: Number }
}, { _id: false });

const marketSchema = new Schema({
  marketId: { type: String, required: true },
  marketName: { type: String, required: true },
  // runners: [runnerSchema],
  // isAdded: { type:Boolean, default:true},
  limit:[limitSchema],
}, { _id: false });

const eventSchema = new Schema({
  eventId: { type: String, required: true, unique: true },
  deventId: { type: String },
  altEventId: { type: String, default:""},
  altMarketId: { type: String, default:""},
  eventName: { type: String, required: true },
  competitionName: { type: String },
  competitionId: { type: String, required: true },
  sportId: { type: String, required: true },
  sportName: { type: String },
  markets: [marketSchema],
  marketName: { type: String },
  marketId: { type: String },
  marketIds: { type: Array, default:[]},
  dmarketId: { type: String },
  eventGrade: { type: String,enum:["A","B","C"] ,default:"A"},
  openDate: { type: Date },
  matchRunners: [runnerSchema],
  bmRunners: [runnerSchema],
  marketCount: { type: Number, default: 0 },
  totalMatched: { type: String, default: "" },
  isAdded: { type: Boolean, default: true},
  openDate: { type: String },
  unixDate:  { type: Number },
  matchType: { type: String, enum:["t10","t15","100balls","t20","oneDay","test"]},
  mType:{ type: String, enum:["normal","winner"]},
  inningInfo: inningInfoSchema,
  tossInfo: tossInfo,
  newMatchType: { type: String, default:""}
}, { timestamps: true });

const Event = model("events", eventSchema);
export default Event;