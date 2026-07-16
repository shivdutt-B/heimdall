import nodemailer from "nodemailer";
import { Server, User } from "@prisma/client";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

/**
 * Formats a Date object to a string in Indian Standard Time (IST).
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string in IST.
 */
function formatIST(date: Date): string {
  const istTime = toZonedTime(date, "Asia/Kolkata");
  return format(istTime, "yyyy-MM-dd HH:mm:ss");
}

/**
 * Nodemailer transporter for sending emails.
 * Requires GMAIL_USER and GMAIL_APP_PASSWORD environment variables.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Sends an immediate alert email to the specified user for the given server.
 * @param {Server} server - The server that failed to respond.
 * @param {User} user - The user to send the alert to.
 */
export async function sendImmediateAlert(server: Server, user: User) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: user.email,
    subject: `Alert: ${server.name} is down!`,
    html: `
            <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Heimdall Server Alert</title>
</head>

<body style="
  margin:0;
  background:#f9fafb;
  font-family:Arial, sans-serif;
  color:#4b5563;
">

  <!-- Container -->
  <div style="
    max-width:720px;
    margin:0 auto;
    padding:48px 28px;
  ">

    <!-- Logo -->
    <img
      src="https://raw.githubusercontent.com/shivdutt-B/heimdall/refs/heads/main/server/assets/logo/heimdall-black-logo-transparent-bg.png"
      width="44"
      alt="Heimdall"
      style="margin-bottom:40px;"
    />

    <!-- Heading -->
    <h1 style="
      margin:0 0 10px;
      color:#111827;
      font-size:30px;
      font-weight:700;
    ">
      Server Down Detected
    </h1>

    <p style="
      margin:0 0 36px;
      font-size:16px;
      line-height:1.8;
      color:#6b7280;
    ">
      Heimdall detected that one of your monitored servers
      is currently unavailable and requires attention.
    </p>

    <!-- Alert Box -->
    <div style="
      background:#fef2f2;
      border:1px solid #fecaca;
      border-radius:10px;
      padding:22px;
      margin-bottom:32px;
    ">

      <p style="
        margin:0;
        color:#991b1b;
        font-size:15px;
        line-height:1.9;
      ">
        Your server
        <strong>${server.name}</strong>
        failed to respond after
        <strong>${server.failureThreshold}</strong>
        consecutive monitoring attempts.
      </p>

    </div>

    <!-- Information Card -->
    <div style="
      background:#ffffff;
      border:1px solid #e5e7eb;
      border-radius:12px;
      overflow:hidden;
      margin-bottom:32px;
    ">

      <!-- Card Header -->
      <div style="
        padding:18px 22px;
        background:#f9fafb;
        border-bottom:1px solid #e5e7eb;
      ">

        <h2 style="
          margin:0;
          color:#111827;
          font-size:17px;
          font-weight:600;
        ">
          Server Information
        </h2>

      </div>

      <!-- Table -->
      <table width="100%" cellpadding="0" cellspacing="0">

        <tr>
          <td style="
            width:190px;
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#6b7280;
            font-size:14px;
            font-weight:600;
            vertical-align:top;
          ">
            Server Name
          </td>

          <td style="
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#111827;
            font-size:14px;
            line-height:1.8;
          ">
            ${server.name}
          </td>
        </tr>

        <tr>
          <td style="
            width:190px;
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#6b7280;
            font-size:14px;
            font-weight:600;
            vertical-align:top;
          ">
            Server URL
          </td>

          <td style="
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#111827;
            font-size:14px;
            line-height:1.8;
            word-break:break-word;
          ">
            ${server.url}
          </td>
        </tr>

        <tr>
          <td style="
            width:190px;
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#6b7280;
            font-size:14px;
            font-weight:600;
            vertical-align:top;
          ">
            Last Checked
          </td>

          <td style="
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#111827;
            font-size:14px;
            line-height:1.8;
          ">
            ${
              server.lastPingedAt
                ? formatIST(new Date(server.lastPingedAt))
                : "Unknown"
            }
          </td>
        </tr>

        <tr>
          <td style="
            width:190px;
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#6b7280;
            font-size:14px;
            font-weight:600;
            vertical-align:top;
          ">
            Consecutive Failures
          </td>

          <td style="
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#111827;
            font-size:14px;
            line-height:1.8;
          ">
            ${server.consecutiveFailures}
          </td>
        </tr>

        <tr>
          <td style="
            width:190px;
            padding:18px 22px;
            color:#6b7280;
            font-size:14px;
            font-weight:600;
            vertical-align:top;
          ">
            Monitoring Status
          </td>

          <td style="
            padding:18px 22px;
            color:#111827;
            font-size:14px;
            line-height:1.8;
          ">
            Heimdall will continue monitoring this server automatically.
          </td>
        </tr>

      </table>

    </div>

    <!-- Dashboard -->
    <p style="
      margin:0 0 36px;
      font-size:15px;
      line-height:1.9;
      color:#4b5563;
    ">
      View logs, uptime history, and monitoring details from your
      <a
        href="${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard"
        style="
          color:#111827;
          font-weight:600;
          text-decoration:underline;
        "
      >
        dashboard
      </a>.
    </p>

    <!-- Footer -->
    <div style="
      border-top:1px solid #e5e7eb;
      padding-top:24px;
    ">

      <p style="
        margin:0 0 8px;
        color:#6b7280;
        font-size:14px;
        line-height:1.7;
      ">
        This alert was generated by
        <strong style="color:#111827;">
          Heimdall Server Monitor
        </strong>
      </p>

      <p style="
        margin:0;
        color:#9ca3af;
        font-size:13px;
      ">
        Generated at ${new Date().toLocaleTimeString()}
      </p>

    </div>

  </div>

</body>
</html>

        `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}

/**
 * Sends a recurring alert email to the specified user for the given server.
 * @param {Server} server - The server that failed to respond.
 * @param {User} user - The user to send the alert to.
 * @param {string} downtime - The downtime of the server.
 */
export async function sendRecurringAlert(
  server: Server,
  user: User,
  downtime: string,
) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: user.email,
    subject: `Daily Alert: ${server.name} - ${downtime} Downtime`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Server Alert</title>
</head>

<body style="
  margin:0;
  background:#f9fafb;
  font-family:Arial, sans-serif;
  color:#4b5563;
">

  <div style="
    max-width:720px;
    margin:0 auto;
    padding:48px 28px;
  ">

    <!-- Logo -->
    <img
      src="https://raw.githubusercontent.com/shivdutt-B/heimdall/refs/heads/main/server/assets/logo/heimdall-black-logo-transparent-bg.png"
      width="42"
      alt="Heimdall"
      style="margin-bottom:40px;"
    />

    <!-- Heading -->
    <h1 style="
      margin:0 0 12px;
      color:#111827;
      font-size:28px;
      font-weight:700;
    ">
      Server Down Detected
    </h1>

    <p style="
      margin:0 0 36px;
      font-size:16px;
      line-height:1.8;
      color:#6b7280;
    ">
      Heimdall detected that one of your monitored servers
      is currently unavailable.
    </p>

    <!-- Alert Box -->
    <div style="
      background:#fef2f2;
      border:1px solid #fecaca;
      border-radius:10px;
      padding:20px 22px;
      margin-bottom:32px;
    ">

      <p style="
        margin:0;
        color:#991b1b;
        font-size:15px;
        line-height:1.8;
      ">
        Your server
        <strong>${server.name}</strong>
        failed to respond after
        <strong>${server.failureThreshold}</strong>
        consecutive monitoring attempts.
      </p>

    </div>

    <!-- Information Table -->
    <div style="
      border:1px solid #e5e7eb;
      border-radius:10px;
      overflow:hidden;
      margin-bottom:32px;
      background:#ffffff;
    ">

      <!-- Header -->
      <div style="
        padding:18px 22px;
        border-bottom:1px solid #e5e7eb;
        background:#f9fafb;
      ">
        <h2 style="
          margin:0;
          color:#111827;
          font-size:17px;
          font-weight:600;
        ">
          Server Information
        </h2>
      </div>

      <!-- Rows -->
      <table width="100%" cellpadding="0" cellspacing="0">

        <tr>
          <td style="
            width:180px;
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#6b7280;
            font-size:14px;
            font-weight:600;
            vertical-align:top;
          ">
            Server Name
          </td>

          <td style="
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#111827;
            font-size:14px;
            line-height:1.7;
          ">
            ${server.name}
          </td>
        </tr>

        <tr>
          <td style="
            width:180px;
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#6b7280;
            font-size:14px;
            font-weight:600;
            vertical-align:top;
          ">
            Server URL
          </td>

          <td style="
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#111827;
            font-size:14px;
            line-height:1.7;
            word-break:break-word;
          ">
            ${server.url}
          </td>
        </tr>

        <tr>
          <td style="
            width:180px;
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#6b7280;
            font-size:14px;
            font-weight:600;
            vertical-align:top;
          ">
            Last Checked
          </td>

          <td style="
            padding:18px 22px;
            border-bottom:1px solid #f3f4f6;
            color:#111827;
            font-size:14px;
            line-height:1.7;
          ">
            ${
              server.lastPingedAt
                ? formatIST(new Date(server.lastPingedAt))
                : "Unknown"
            }
          </td>
        </tr>

        <tr>
          <td style="
            width:180px;
            padding:18px 22px;
            color:#6b7280;
            font-size:14px;
            font-weight:600;
            vertical-align:top;
          ">
            Consecutive Failures
          </td>

          <td style="
            padding:18px 22px;
            color:#111827;
            font-size:14px;
            line-height:1.7;
          ">
            ${server.consecutiveFailures}
          </td>
        </tr>

      </table>

    </div>

    <!-- Monitoring Info -->
    <p style="
      margin:0 0 28px;
      font-size:15px;
      line-height:1.9;
      color:#4b5563;
    ">
      Heimdall will continue monitoring your server automatically.
      If your server comes back online, no further action is needed and you will not receive another email. However, if the issue persists, we will send another alert after 24 hours.
    </p>

    <!-- Dashboard -->
    <p style="
      margin:0 0 48px;
      font-size:15px;
      line-height:1.9;
      color:#4b5563;
    ">
      View detailed logs and monitoring data from your
      <a
        href="${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard"
        style="
          color:#111827;
          font-weight:600;
          text-decoration:underline;
        "
      >
        dashboard
      </a>.
    </p>

    <!-- Footer -->
    <div style="
      border-top:1px solid #e5e7eb;
      padding-top:24px;
    ">

      <p style="
        margin:0 0 8px;
        color:#6b7280;
        font-size:14px;
        line-height:1.7;
      ">
        This alert was generated by
        <strong style="color:#111827;">
          Heimdall Server Monitor
        </strong>
      </p>

      <p style="
        margin:0;
        color:#9ca3af;
        font-size:13px;
      ">
        Generated at ${new Date().toLocaleTimeString()}
      </p>

    </div>

  </div>

</body>
</html>

`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
}
