import { Schema } from "mongoose";
import mongoose from "mongoose";

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
    require: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        require: true,
      },
      price: {
        type: Number,
        require: true,
      },
      total: Number,
      returnStatus: {
        type: String,
      },
    },
  ],
  paymentMethod: {
    type: String,
    require: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Out for Delivery",
      "Confirmed",
      "Return Requested",
      "Return Accepted",
      "Return Rejected",
    ],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  grandTotal: Number,
  cancelRequest: {
    type: Boolean,
    default: false,
  },
  reason: String,
  response: Boolean,
  payment_id: String,
  payment_status: {
    type: Boolean,
    default: false,
  },
  shippedDate: {
    type: Date,
    default: null,
  },
  coupon: {
    type: String,
  },
  deliveredDate: {
    type: Date,
    default: null,
  },
});

// export default model("Order", orderSchema);
const Order = mongoose.model("Order", orderSchema);
export default Order;
