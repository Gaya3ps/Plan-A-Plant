import { Schema, model } from "mongoose";

const bannerSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    
  },
  linkUrl: {
    type: String,
    
  },
  bannerImage: {
    type: [String],
  },
  position: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  modifiedDate: {
    type: Date,
    default: Date.now,
  },
  is_delete: {
    type: Boolean,
    default: false,
  },
});

const Banner = model("Banner", bannerSchema);

export default Banner;
