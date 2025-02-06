import { compareSync } from "bcrypt";
import { Schema } from "mongoose";
import mongoose from "mongoose";

var userSchema = new Schema(
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
        type: Schema.Types.ObjectId,
        ref: "coupons",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.verifyPassword = function (password) {
  return compareSync(password, this.password);
};

//Export the model
// export default model("User", userSchema);
const User = mongoose.model("User", userSchema);
export default User;
