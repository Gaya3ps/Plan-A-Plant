import transporter from './emailConfig.js';

export const sendMail = (mailOptions, callback) => {
  transporter.sendMail(mailOptions, callback);
};