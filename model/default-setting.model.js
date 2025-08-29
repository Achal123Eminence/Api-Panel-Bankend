import { model, Schema } from "mongoose";

const defaultSettingSchema = new Schema(
    {
        name:{type:String,default:"defaultSettings"},
        data:{type:String,required:true}
    },
    {timestamps:true}
);

const DefaultSettings = model("defaultSetting",defaultSettingSchema);
export default DefaultSettings;