import nodemailer from 'nodemailer';
import { Server, User } from '@prisma/client';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

export async function sendImmediateAlert(server: Server, user: User) {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: `🚨 Alert: ${server.name} is down!`,
        html: `
            <h2>Server Down Alert</h2>
            <p>Your server <strong>${server.name}</strong> has failed to respond after ${server.failureThreshold} consecutive attempts.</p>
            <p><strong>Server Details:</strong></p>
            <ul>
                <li>URL: ${server.url}</li>
                <li>Last Checked: ${server.lastPingedAt?.toLocaleString()}</li>
                <li>Consecutive Failures: ${server.consecutiveFailures}</li>
            </ul>
            <p>We'll continue monitoring and send you updates every 24 hours until the server recovers.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✉️ Immediate alert sent to ${user.email} for server ${server.name}`);
    } catch (error) {
        console.error('Error sending immediate alert:', error);
        throw error;
    }
}

export async function sendRecurringAlert(server: Server, user: User, downtime: string) {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: `⚠️ Reminder: ${server.name} is still down`,
        html: `
            <h2>Server Still Down</h2>
            <p>Your server <strong>${server.name}</strong> is still unresponsive.</p>
            <p><strong>Server Details:</strong></p>
            <ul>
                <li>URL: ${server.url}</li>
                <li>Last Checked: ${server.lastPingedAt?.toLocaleString()}</li>
                <li>Total Downtime: ${downtime}</li>
                <li>Consecutive Failures: ${server.consecutiveFailures}</li>
            </ul>
            <p>We'll continue monitoring and send you another update in 24 hours if the server remains down.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✉️ Recurring alert sent to ${user.email} for server ${server.name}`);
    } catch (error) {
        console.error('Error sending recurring alert:', error);
        throw error;
    }
}
