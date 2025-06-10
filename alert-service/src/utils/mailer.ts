import nodemailer from 'nodemailer';
import { Server, User } from '@prisma/client';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

export async function sendImmediateAlert(server: Server, user: User) {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: `🚨 Alert: ${server.name} is down!`,
        html: `
        <div style="width:100%; background-color: #040506;">
            <div style="font-family: Arial, sans-serif; max-width:600px; margin: 0 auto; background-color: #040506; color: #e2e8f0; padding: 30px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.4);">
                <!-- Logo -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://raw.githubusercontent.com/shivdutt-B/heimdall/refs/heads/main/server/assets/logo/heimdall-logo.png" width="60" height="60" alt="Heimdall Logo" style="margin: 0 auto;" />
                </div>

                <!-- Alert Box -->
                <div style="background-color: #101112; padding: 25px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #ef4444; margin-top: 0; font-weight: 550">Server Down Alert</h2>
                    <p style="color: #e2e8f0;">Your server <strong style="color: #ffffff;">${server.name}</strong> has failed to respond after ${server.failureThreshold} consecutive attempts.</p>
                    
                    <div style="background-color: #27272a; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #e2e8f0; margin-top: 0;">Server Details</h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">URL:</strong> <span style="color: #e2e8f0;">${server.url}</span></li>
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">Last Checked:</strong> <span style="color: #e2e8f0;">${server.lastPingedAt?.toLocaleString()}</span></li>
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">Consecutive Failures:</strong> <span style="color: #ef4444;">${server.consecutiveFailures}</span></li>
                        </ul>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 14px;">We'll continue monitoring and send you updates every 24 hours until the server recovers.</p>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                       style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: 500;">
                        View Dashboard
                    </a>
                </div>
            </div>
        </div>
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
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: `⚠️ Reminder: ${server.name} is still down`,
        html: `
        <div style="width:100%; background-color: #040506;">
            <div style="font-family: Arial, sans-serif; max-width:600px; margin: 0 auto; background-color: #040506; color: #e2e8f0; padding: 30px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.4);">
                <!-- Logo -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://raw.githubusercontent.com/shivdutt-B/heimdall/refs/heads/main/server/assets/logo/heimdall-logo.png" width="60" height="60" alt="Heimdall Logo" style="margin: 0 auto;" />
                </div>

                <!-- Alert Box -->
                <div style="background-color: #101112; padding: 25px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #eab308; margin-top: 0;">Server Still Down</h2>
                    <p style="color: #e2e8f0;">Your server <strong style="color: #ffffff;">${server.name}</strong> is still unresponsive.</p>
                    
                    <div style="background-color: #27272a; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #e2e8f0; margin-top: 0;">Server Details</h3>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">URL:</strong> <span style="color: #e2e8f0;">${server.url}</span></li>
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">Last Checked:</strong> <span style="color: #e2e8f0;">${server.lastPingedAt?.toLocaleString()}</span></li>
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">Total Downtime:</strong> <span style="color: #eab308;">${downtime}</span></li>
                            <li style="margin: 10px 0;"><strong style="color: #94a3b8;">Consecutive Failures:</strong> <span style="color: #ef4444;">${server.consecutiveFailures}</span></li>
                        </ul>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 14px;">We'll continue monitoring and send you another update in 24 hours if the server remains down.</p>
                </div>

                <div style="text-align: center; margin-top: 20px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                       style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: 500;">
                        View Dashboard
                    </a>
                </div>
            </div>
        </div>
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
