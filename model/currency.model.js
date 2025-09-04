import { model, Schema} from 'mongoose';

const currencySchema = new Schema(
    {
        name:{ type: String, required: true, unique: true},
        value:{ type: Number, required: true},
        isBase:{ type: Boolean, default: false}
    },
    {timestamps:true}
);

const Currency = model("currency",currencySchema);
export default Currency;