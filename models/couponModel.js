import { Schema, model } from "mongoose";
import FlexApiBase from "twilio/lib/rest/FlexApiBase";

const couponSchema = Schema(
  {
    couponName: {
      type: String,
      uppercase: true,
      unique: true,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    usedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "userModel",
        required: false,
      },
    ],
    priceLimit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const preMethod = function (next) {
  console.log("coupon pre executing");
  const currentDate = new Date();
  if (this.expiryDate < currentDate) {
    this.isExpired = true;
  }

  next();
};
couponSchema.pre("find", preMethod);
couponSchema.pre("findOne", preMethod);
couponSchema.pre("findMany", preMethod);

export default model("coupons", couponSchema);
