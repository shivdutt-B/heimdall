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
        <div style="width:100%; background-color: #040506;">
            <div style="font-family: Arial, sans-serif; max-width:600px; margin: 0 auto; background-color: #040506; color: #e2e8f0; padding: 30px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.4);">
                <!-- Logo -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://raw.githubusercontent.com/shivdutt-B/heimdall/refs/heads/main/server/assets/logo/heimdall-logo.png" width="60" height="60" alt="Heimdall Logo" style="margin: 0 auto;" />
                </div>

                <!-- Alert Box -->
                <div style="background-color: #101112; padding: 25px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #ef4444; margin-top: 0;">Server Alert: ${serverName} is Down</h2>
                    <p style="color: #e2e8f0;">Heimdall has detected that your server <strong style="color: #ffffff;">${serverName}</strong> is currently down.</p>
                    
                    <div style="background-color: #27272a; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #e2e8f0; margin-top: 0;">Server Details</h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">URL:</strong> <span style="color: #e2e8f0;">${serverUrl}</span></li>
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">Downtime:</strong> <span style="color: #eab308;">${downtime} minutes</span></li>
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">Status:</strong> <span style="color: #ef4444;">Unreachable</span></li>
                        </ul>
                    </div>
                    
                    <p style="color: #94a3b8;">Please check your server as soon as possible. You can view more details in your Heimdall dashboard.</p>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard" 
                       style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: 500;">
                        View Dashboard
                    </a>
                </div>

                <p style="margin-top: 30px; font-size: 12px; color: #718096; text-align: center;">
                    This is an automated alert from the Heimdall monitoring system. If you no longer wish to receive these alerts, 
                    you can adjust your notification settings in your Heimdall dashboard.
                </p>
            </div>
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
        <div style="width:100%; background-color: #040506;">
            <div style="font-family: Arial, sans-serif; max-width:600px; margin: 0 auto; background-color: #040506; color: #e2e8f0; padding: 30px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.4);">
                <!-- Logo -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://raw.githubusercontent.com/shivdutt-B/heimdall/refs/heads/main/server/assets/logo/heimdall-logo.png" width="60" height="60" alt="Heimdall Logo" style="margin: 0 auto;" />
                </div>

                <!-- Alert Box -->
                <div style="background-color: #101112; padding: 25px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #22c55e; margin-top: 0;">Server Recovered: ${serverName} is Back Online</h2>
                    <p style="color: #e2e8f0;">Good news! Heimdall has detected that your server <strong style="color: #ffffff;">${serverName}</strong> is back online.</p>
                    
                    <div style="background-color: #27272a; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #e2e8f0; margin-top: 0;">Server Details</h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">URL:</strong> <span style="color: #e2e8f0;">${serverUrl}</span></li>
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">Total Downtime:</strong> <span style="color: #eab308;">${downtime} minutes</span></li>
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">Status:</strong> <span style="color: #22c55e;">Online</span></li>
                        </ul>
                    </div>
                    
                    <p style="color: #94a3b8;">You can view more details and performance metrics in your Heimdall dashboard.</p>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard" 
                       style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: 500;">
                        View Dashboard
                    </a>
                </div>

                <p style="margin-top: 30px; font-size: 12px; color: #718096; text-align: center;">
                    This is an automated alert from the Heimdall monitoring system. If you no longer wish to receive these alerts, 
                    you can adjust your notification settings in your Heimdall dashboard.
                </p>
            </div>
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
