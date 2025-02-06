import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        subTotal: {
          type: Number,
        },
      },
    ],
    total: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Export the model
export default model("Cart", cartSchema);
