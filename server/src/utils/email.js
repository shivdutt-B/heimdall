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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #040506; color: #e2e8f0; padding: 30px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.4); font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!-- Company Logo -->
  <div style="text-align: center; margin-bottom: 20px; display:flex; flex-direction:column; align-items:center">
    <img src="data:image/png;base64,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" width="60" height="60" alt="Heimdall Logo" />

  </div>

  <!-- Message Box -->
  <div style="background-color: #101112; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center;">
    <p style="font-size: 18px; margin-bottom: 20px; font-weight: 400">Your Verification code is:</p>
    <div style="display: inline-block; background-color: #27272a ; padding: 10px 20px; border-radius: 5px; font-size: 24px; font-weight: bold; color: white; border:3px dashed gray;" id="otp-code">${text}</div>
    <br /><br />
  </div>

  <p style="font-size: 14px; color: #a0aec0; text-align: center;">This Code is valid for 10 minutes. Do not share it with anyone.</p>

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

/**
 * Send server alert email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.serverName - Name of the server that is down
 * @param {string} options.serverUrl - URL of the server that is down
 * @param {number} options.downtime - Downtime in minutes
 * @returns {Promise} - Nodemailer send mail promise
 */
const sendServerDownAlert = async ({ to, serverName, serverUrl, downtime }) => {
  const mailOptions = {
    from: `"Heimdall Monitoring" <${process.env.FROM_EMAIL}>`,
    to,
    subject: `🚨 Alert: ${serverName} is down!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e53e3e;">Server Alert: ${serverName} is Down</h2>
        <p>Heimdall has detected that your server <strong>${serverName}</strong> is currently down.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #e53e3e; margin: 20px 0;">
          <p><strong>Server URL:</strong> ${serverUrl}</p>
          <p><strong>Downtime:</strong> ${downtime} minutes</p>
          <p><strong>Status:</strong> Unreachable</p>
        </div>
        
        <p>Please check your server as soon as possible. You can view more details in your Heimdall dashboard.</p>
        
        <a href="${process.env.FRONTEND_URL || "http://localhost:3000"
      }/dashboard" style="display: inline-block; background-color: #3182ce; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 10px;">
          View Dashboard
        </a>
        
        <p style="margin-top: 30px; font-size: 12px; color: #718096;">
          This is an automated alert from the Heimdall monitoring system. If you no longer wish to receive these alerts, 
          you can adjust your notification settings in your Heimdall dashboard.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send server recovered alert email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.serverName - Name of the server that recovered
 * @param {string} options.serverUrl - URL of the server that recovered
 * @param {number} options.downtime - Total downtime in minutes
 * @returns {Promise} - Nodemailer send mail promise
 */
const sendServerRecoveredAlert = async ({
  to,
  serverName,
  serverUrl,
  downtime,
}) => {
  const mailOptions = {
    from: `"Heimdall Monitoring" <${process.env.FROM_EMAIL}>`,
    to,
    subject: `✅ Server Recovered: ${serverName} is back online`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #38a169;">Server Recovered: ${serverName} is Back Online</h2>
        <p>Good news! Heimdall has detected that your server <strong>${serverName}</strong> is back online.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #38a169; margin: 20px 0;">
          <p><strong>Server URL:</strong> ${serverUrl}</p>
          <p><strong>Total Downtime:</strong> ${downtime} minutes</p>
          <p><strong>Status:</strong> Online</p>
        </div>
        
        <p>You can view more details and performance metrics in your Heimdall dashboard.</p>
        
        <a href="${process.env.FRONTEND_URL || "http://localhost:3000"
      }/dashboard" style="display: inline-block; background-color: #3182ce; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 10px;">
          View Dashboard
        </a>
        
        <p style="margin-top: 30px; font-size: 12px; color: #718096;">
          This is an automated alert from the Heimdall monitoring system. If you no longer wish to receive these alerts, 
          you can adjust your notification settings in your Heimdall dashboard.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send verification code email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.code - Verification code
 */
const sendVerificationCode = async ({ to, code }) => {
  const mailOptions = {
    from: `"Heimdall" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Your Heimdall Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3182ce;">Heimdall Authentication</h2>
        <p style="font-size: 16px; color: #4a5568;">Your verification code is:</p>
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; letter-spacing: 4px; color: #2d3748; font-family: monospace;">${code}</span>
        </div>
        <p style="color: #718096; font-size: 14px;">This code will expire in 10 minutes.</p>
        <p style="color: #718096; font-size: 14px; margin-top: 20px;">If you did not request this code, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification code email:', error);
    throw new Error('Failed to send verification code email');
  }
};

module.exports = {
  sendEmail,
  sendServerDownAlert,
  sendServerRecoveredAlert,
  sendVerificationCode,
};
