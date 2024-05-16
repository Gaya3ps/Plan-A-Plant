const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isBLock: {
      type: Boolean,
      default: false,
    },

    token: {
      type: String,
      default: "",
    },

    wallet: {
      type: Number,
      required: false,
    },

    coupons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "coupons",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//Export the model
module.exports = mongoose.model("User", userSchema);
