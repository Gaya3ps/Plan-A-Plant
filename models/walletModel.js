import { Schema, model } from "mongoose";

const walletSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    income: [
      {
        amount: {
          type: Number,
        },
        orderId: {
          type: Schema.Types.ObjectId,
        },
        date: {
          type: Date,
        },
        description: {
          type: String,
        },
      },
    ],
    expense: [
      {
        amount: {
          type: Number,
        },
        orderId: {
          type: Schema.Types.ObjectId,
        },
        date: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

export default model("userWallet", walletSchema);
