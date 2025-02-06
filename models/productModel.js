import { Schema, model } from "mongoose";

var ProductSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    productPrice: {
      type: Number,
    },
    salePrice: {
      type: Number,
    },
    categoryName: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    primaryImage: [
      {
        name: {
          type: String,
        },
        path: {
          type: String,
        },
      },
    ],
    secondaryImages: [
      {
        name: {
          type: String,
        },
        path: {
          type: String,
        },
      },
    ],
    isListed: {
      type: Boolean,
      default: true,
    },
    offer: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Export the model
export default model("Product", ProductSchema);
