import transporter from "../config/emailSender.js";
function generateOTP() {
  const min = 1000;
  const max = 9999;
  return Math.floor(Math.random() * (max - min) + min);
}

function sendOtp(email, otp, name) {
  const htmlMessage = `
        <html>
          <head>
            <style>
              /* Add your CSS styles here */
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 5px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                background-color: #007bff;
                color: #ffffff;
                padding: 10px;
                border-radius: 5px 5px 0 0;
              }
              .content {
                padding: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>OTP Verification</h1>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                <p>Your OTP for verifying your email is:</p>
                <h2>${otp}</h2>
                <p>Please enter this OTP to complete the verification process.</p>
              </div>
            </div>
          </body>
        </html>
      `;

  const mailOptions = {
    from: "gayathri07211@gmail.com",
    to: email,
    subject: "OTP Verification",
    html: htmlMessage,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending OTP:", error);
    } else {
      console.log("OTP sent:", info.response);
    }
  });
}

function sendVerifymail(name, email, token) {
  const htmlMessage = `
    <html>
    <head>
      <style>
        /* Add your CSS styles here */
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          background-color: #007bff;
          color: #ffffff;
          padding: 10px;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Password Verification</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Please click this link to reset the password process
          <a href="http://127.0.0.1:8000/forget-password?token=${token}">Reset Password</a>
          .</p>
        </div>
      </div>
    </body>
  </html>
  `;

  const mailOptions = {
    from: "gayathri07211@gmail.com",
    to: email,
    subject: "Reset Password Verification",
    html: htmlMessage,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("verification email sent:", info.response);
    }
  });
}

// export default {
//   sendOtp,
//   generateOTP,
//   sendVerifymail,
// };

export  {
  sendOtp,
  generateOTP,
  sendVerifymail,
};