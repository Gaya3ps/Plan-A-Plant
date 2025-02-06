import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const verifyPayment = (details) => {
  return new Promise((resolve, reject) => {
    try {
      const hmac = crypto
        .createHmac("sha256", process.env.key_secret)
        .update(
          `${details.payment.razorpay_order_id}|${details.payment.razorpay_payment_id}`
        )
        .digest("hex");

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

export default verifyPayment;
