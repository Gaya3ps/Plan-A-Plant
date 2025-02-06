import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    categoryOffer:{
      type: Number
    },
    isListed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//Export the model
export default model("Category", categorySchema);
