import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "gayathri07211@gmail.com",
    pass: "uldi flhq dovm vcuj",
  },
});
export default transporter;
