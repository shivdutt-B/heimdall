const nodemailer = require("nodemailer");

/**
 * Create a reusable transporter object
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

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
        
        <a href="${
          process.env.FRONTEND_URL || "http://localhost:3000"
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
        
        <a href="${
          process.env.FRONTEND_URL || "http://localhost:3000"
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

module.exports = {
  sendServerDownAlert,
  sendServerRecoveredAlert,
};
