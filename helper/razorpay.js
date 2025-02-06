import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto"

import Razorpay from "razorpay";

export default (details) => {
  return new Promise((resolve, reject) => {
    try {
      let hmac = crypto.createHmac("sha256", process.env.key_secret);
      hmac.update(
        details.payment.razorpay_order_id +
          "|" +
          details.payment.razorpay_payment_id
      );
      hmac = hmac.digest("hex");

      if (hmac === details.payment.razorpay_signature) {
        console.log("Verify SUCCESS");
        resolve();
      } else {
        console.log("Verify FAILED");
        reject(new Error("Signature verification failed"));
      }
    } catch (error) {
      console.error("Verify Exception:", error);
      reject(error);
    }
  });
};
