import { Schema, Types, model } from "mongoose";

var addressSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
    user_name: {
      type: String,
    },

    phone: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    town: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
export default model("Address", addressSchema);
