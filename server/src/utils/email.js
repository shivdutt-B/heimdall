const nodemailer = require("nodemailer");


/**
 * Create a reusable transporter object using Gmail SMTP
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // This should be an App Password, not your regular Gmail password
  },
});

/**
 * Verify transporter connection
 */
transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});


/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Email text content
 * @param {string} [options.html] - Email HTML content (optional)
 * @returns {Promise} - Nodemailer send mail promise
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"Heimdall" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    text,
    html:
      html ||
      `
      <div style="width:100%;  background-color: #040506;">
      <div style="font-family: Arial, sans-serif; max-width:600px; width:50%; margin: 0 auto; background-color: #040506; color: #e2e8f0; padding: 30px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.4); font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Company Logo -->
  <div style="text-align: center; margin-bottom: 20px; display:flex; justify-content:center;">
    <img style="display:block; margin:auto" src="https://raw.githubusercontent.com/shivdutt-B/heimdall/refs/heads/main/server/assets/logo/heimdall-logo.png" width="60" height="60" alt="Heimdall Logo" />
  </div>

  <!-- Message Box -->
  <div style="background-color: #101112; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center;">
    <p style="font-size: 18px; margin-bottom: 20px; font-weight: 400">Your Verification code is:</p>
    <div style="display: inline-block; background-color: #27272a ; padding: 10px 20px; border-radius: 5px; font-size: 24px; font-weight: bold; color: white; border:3px dashed gray;" id="otp-code">${text}</div>
    <br /><br />
  </div>

  <p style="font-size: 14px; color: #a0aec0; text-align: center;">This Code is valid for 10 minutes. Do not share it with anyone.</p>
  </div>
    `,
  };

  try {
    console.log("Attempting to send email with options:", {
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully. Response:", info.response);
    return info;
  } catch (error) {
    console.error("Failed to send email. Error details:", error);
    throw error;
  }
};


module.exports = {
  sendEmail
};
