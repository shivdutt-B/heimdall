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
            <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Heimdall Server Alert</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #000000 0%, #111827 50%, #1f2937 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; min-height: 100vh;">
            
            <!-- Outer Container -->
            <div style="width: 100%; padding: 40px 20px; background: linear-gradient(135deg, #000000 0%, #111827 50%, #1f2937 100%);">
                
                <!-- Main Email Container -->
                <div style="max-width: 600px; margin: 0 auto; background: rgba(17, 24, 39, 0.95); backdrop-filter: blur(15px); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(75, 85, 99, 0.3);">
                    
                    <!-- Header with Logo -->
                    <div style="background: linear-gradient(135deg, #000000 0%, #1f2937 100%); padding: 32px 10px; text-align: center; position: relative; overflow: hidden; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        
                        <div style="position: relative; z-index: 2; flex-direction:column; justify-content:center; align-items:center;">
                            <img src="https://raw.githubusercontent.com/shivdutt-B/heimdall/refs/heads/main/server/assets/logo/heimdall-logo-transparent.png" 
                                 width="90" height="90" alt="Heimdall Logo" 
                                 style="margin-bottom: 16px;display:block;margin:auto; border-radius: 50%;" />
                            <h1 style="color: #ffffff;display:block; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;">Server Alert</h1>
                            <p style="color: rgba(255, 255, 255, 0.7); display:block; margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">Critical Monitoring Notification</p>
                        </div>
                    </div>
                    
                    <!-- Main Content -->
                    <div style="padding: 40px;">
                        
                        <!-- Alert Status -->
                        <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid #ef4444; border-radius: 12px; padding: 28px; margin-bottom: 32px; position: relative; overflow: hidden;">
                            
                            <!-- Alert Icon & Title -->
                            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                                
                                    <span style="margin-right: 14px; font-size: 22px;">🚨</span>
                                <div>
                                    <h2 style="color: #ef4444; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.025em;">Server Down Detected</h2>
                                    <p style="color: #9ca3af; margin: 4px 0 0 0; font-size: 15px; font-weight: 500;">Immediate attention required</p>
                                </div>
                            </div>
                            
                            <p style="color: #e5e7eb; margin: 0; font-size: 17px; line-height: 1.6;">
                                Your server <strong style="color: #ffffff; background: rgba(255, 255, 255, 0.1); padding: 4px 12px; border-radius: 5px; font-weight: 700; border: 1px solid rgba(255, 255, 255, 0.2);">${server.name}</strong> has failed to respond after <strong style="color: #ef4444; font-size: 18px;">${server.failureThreshold}</strong> consecutive monitoring attempts.
                            </p>
                        </div>
                        
                        <!-- Server Details Card -->
                        <div style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); border-radius: 12px; padding: 32px; margin-bottom: 32px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4); border: 1px solid rgba(75, 85, 99, 0.3);">
                            <h3 style="color: #f9fafb; margin: 0 0 24px 0; font-size: 22px; font-weight: 700; display: flex; align-items: center;">
                                <span style="margin-right: 14px; font-size: 22px;">🖥️</span>
                                Server Information
                            </h3>
                            
                            <div style="space-y: 18px;">
                                <!-- URL -->
                                <div style="padding: 20px; background: rgba(0, 0, 0, 0.4); border-radius: 10px; margin-bottom: 18px; border-left: 5px solid #ffffff; border: 1px solid rgba(255, 255, 255, 0.1);">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="color: #d1d5db; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Server URL</span>
                                    </div>
                                    <p style="color: #f3f4f6; margin: 10px 0 0 0; font-size: 16px; font-family: 'Monaco', 'Menlo', monospace; word-break: break-all; background: rgba(255, 255, 255, 0.05); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1);">${server.url}</p>
                                </div>
                                
                                <!-- Last Checked -->
                                <div style="padding: 20px; background: rgba(0, 0, 0, 0.4); border-radius: 10px; margin-bottom: 18px; border-left: 5px solid #9ca3af; border: 1px solid rgba(255, 255, 255, 0.1);">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="color: #d1d5db; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Last Checked</span>
                                    </div>
                                     <p style="color: #f3f4f6; margin: 10px 0 0 0; font-size: 16px; font-family: 'Monaco', 'Menlo', monospace; word-break: break-all; background: rgba(255, 255, 255, 0.05); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                     ${format(new Date(server.lastPingedAt), "yyyy-MM-dd HH:mm:ss")}
                              </p>
                                </div>
                                
                                <!-- Consecutive Failures -->
                                <div style="padding: 20px; background: rgba(0, 0, 0, 0.4); border-radius: 10px; margin-bottom: 0; border-left: 5px solid #ef4444; border: 1px solid rgba(255, 255, 255, 0.1);">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="color: #d1d5db; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Consecutive Failures</span>
                                    </div>
                                    <div style="display: flex; align-items: center; margin-top: 10px;">
                                        <p style="color: #f3f4f6; margin: 10px 0 0 0; font-size: 16px; font-family: 'Monaco', 'Menlo', monospace; word-break: break-all; background: rgba(255, 255, 255, 0.05); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1);">${server.consecutiveFailures}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Status Message -->
                        <div style="background: rgba(255, 255, 255, 0.05); border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                                <div>
                                    <span style="margin-right: 14px; font-size: 22px;">🔁</span>
                                </div>
                                <h4 style="color: #f9fafb; margin-top: 8px; font-size: 18px; font-weight: 700;">Monitoring Status</h4>
                            </div>
                            <p style="color: #d1d5db; margin: 0; font-size: 15px; line-height: 1.6;">
                                We'll continue monitoring your server and send you status updates every <strong style="color: #ffffff;">24 hours</strong> until the server recovers. You'll receive an immediate notification as soon as your server is back online.
                            </p>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div style="text-align: center; margin-bottom: 32px;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                               style="display: block; background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%); color: #000000; padding: 18px 36px; text-decoration: none; border-radius: 9px; font-weight: 700; font-size: 17px; letter-spacing: 0.025em; box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1); margin-right: 16px; border: 2px solid rgba(255, 255, 255, 0.3);">
                                🚀 Go To Dashboard
                            </a>
                        </div>
                        
                        <!-- Divider -->
                        <div style="height: 2px; background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%); margin: 32px 0;"></div>
                        
                        <!-- Footer -->
                        <div style="text-align: center;">
                            <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 15px; line-height: 1.6;">
                                This alert was generated by <strong style="color: #ffffff;">Heimdall Server Monitor</strong><br>
                                Keeping your infrastructure secure and monitored 24/7
                            </p>
                            <p style="color: #6b7280; margin: 0; font-size: 13px;">
                                Generated at ${new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Bottom Spacing -->
                <div style="height: 40px;"></div>
            </div>
        </body>
        </html>
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
    const alertId = `HMD-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: `🕒 Daily Alert: ${server.name} - ${downtime} Downtime`,
        html: `
            <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Heimdall Server Daily Alert</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #000000 0%, #111827 50%, #1f2937 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; min-height: 100vh;">
            
            <!-- Outer Container -->
            <div style="width: 100%; padding: 40px 20px; background: linear-gradient(135deg, #000000 0%, #111827 50%, #1f2937 100%);">
                
                <!-- Main Email Container -->
                <div style="max-width: 600px; margin: 0 auto; background: rgba(17, 24, 39, 0.95); backdrop-filter: blur(15px); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(75, 85, 99, 0.3);">
                    
                    <!-- Header with Logo -->
                    <div style="background: linear-gradient(135deg, #000000 0%, #1f2937 100%); padding: 32px 10px; text-align: center; position: relative; overflow: hidden; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        
                        <div style="position: relative; z-index: 2; flex-direction:column; justify-content:center; align-items:center;">
                            <img src="https://raw.githubusercontent.com/shivdutt-B/heimdall/refs/heads/main/server/assets/logo/heimdall-logo-transparent.png" 
                                 width="90" height="90" alt="Heimdall Logo" 
                                 style="margin-bottom: 16px;display:block;margin:auto; border-radius: 50%;" />
                            <h1 style="color: #ffffff;display:block; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em;">Daily Status Alert</h1>
                            <p style="color: rgba(255, 255, 255, 0.7); display:block; margin: 8px 0 0 0; font-size: 16px; font-weight: 500;">Server Monitoring Update</p>
                        </div>
                    </div>
                    
                    <!-- Main Content -->
                    <div style="padding: 40px;">
                        
                        <!-- Alert Status -->
                        <div style="background: rgba(234, 179, 8, 0.1); border: 2px solid #eab308; border-radius: 12px; padding: 28px; margin-bottom: 32px; position: relative; overflow: hidden;">
                            
                            <!-- Alert Icon & Title -->
                            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                                <span style="margin-right: 14px; font-size: 22px;">⚠️</span>
                                <div>
                                    <h2 style="color: #eab308; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.025em;">Extended Downtime Alert</h2>
                                    <p style="color: #9ca3af; margin: 4px 0 0 0; font-size: 15px; font-weight: 500;">Alert ID: ${alertId}</p>
                                </div>
                            </div>
                            
                            <p style="color: #e5e7eb; margin: 0; font-size: 17px; line-height: 1.6;">
                                Your server <strong style="color: #ffffff; background: rgba(255, 255, 255, 0.1); padding: 4px 12px; border-radius: 5px; font-weight: 700; border: 1px solid rgba(255, 255, 255, 0.2);">${server.name}</strong> has been down for <strong style="color: #eab308; font-size: 18px;">${downtime}</strong>. Our monitoring system is actively tracking its status.
                            </p>
                        </div>
                        
                        <!-- Server Details Card -->
                        <div style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); border-radius: 12px; padding: 32px; margin-bottom: 32px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4); border: 1px solid rgba(75, 85, 99, 0.3);">
                            <h3 style="color: #f9fafb; margin: 0 0 24px 0; font-size: 22px; font-weight: 700; display: flex; align-items: center;">
                                <span style="margin-right: 14px; font-size: 22px;">🖥️</span>
                                Server Information
                            </h3>
                            
                            <div style="space-y: 18px;">
                                <!-- URL -->
                                <div style="padding: 20px; background: rgba(0, 0, 0, 0.4); border-radius: 10px; margin-bottom: 18px; border-left: 5px solid #ffffff; border: 1px solid rgba(255, 255, 255, 0.1);">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="color: #d1d5db; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Server URL</span>
                                    </div>
                                    <p style="color: #f3f4f6; margin: 10px 0 0 0; font-size: 16px; font-family: 'Monaco', 'Menlo', monospace; word-break: break-all; background: rgba(255, 255, 255, 0.05); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1);">${server.url}</p>
                                </div>
                                
                                <!-- Last Checked -->
                                <div style="padding: 20px; background: rgba(0, 0, 0, 0.4); border-radius: 10px; margin-bottom: 18px; border-left: 5px solid #9ca3af; border: 1px solid rgba(255, 255, 255, 0.1);">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="color: #d1d5db; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Last Checked</span>
                                    </div>
                                     <p style="color: #f3f4f6; margin: 10px 0 0 0; font-size: 16px; font-family: 'Monaco', 'Menlo', monospace; word-break: break-all; background: rgba(255, 255, 255, 0.05); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1);">${server.lastPingedAt?.toLocaleString()}</p>
                                </div>
                                
                                <!-- Total Downtime -->
                                <div style="padding: 20px; background: rgba(0, 0, 0, 0.4); border-radius: 10px; margin-bottom: 0; border-left: 5px solid #eab308; border: 1px solid rgba(255, 255, 255, 0.1);">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="color: #d1d5db; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">Total Downtime</span>
                                    </div>
                                    <div style="display: flex; align-items: center; margin-top: 10px;">
                                        <p style="color: #f3f4f6; margin: 10px 0 0 0; font-size: 16px; font-family: 'Monaco', 'Menlo', monospace; word-break: break-all; background: rgba(255, 255, 255, 0.05); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1);">${downtime}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Status Message -->
                        <div style="background: rgba(255, 255, 255, 0.05); border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                            <div style="display: flex; align-items: center; margin-bottom: 16px;">
                                <div>
                                    <span style="margin-right: 14px; font-size: 22px;">🔁</span>
                                </div>
                                <h4 style="color: #f9fafb; margin-top: 8px; font-size: 18px; font-weight: 700;">Next Status Update</h4>
                            </div>
                            <p style="color: #d1d5db; margin: 0; font-size: 15px; line-height: 1.6;">
                                You will receive the next status update in <strong style="color: #ffffff;">24 hours</strong>. We'll send an immediate notification if your server comes back online before then.
                            </p>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div style="text-align: center; margin-bottom: 32px;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                               style="display: block; background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%); color: #000000; padding: 18px 36px; text-decoration: none; border-radius: 9px; font-weight: 700; font-size: 17px; letter-spacing: 0.025em; box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1); margin-right: 16px; border: 2px solid rgba(255, 255, 255, 0.3);">
                                🚀 Go To Dashboard
                            </a>
                        </div>
                        
                        <!-- Divider -->
                        <div style="height: 2px; background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%); margin: 32px 0;"></div>
                        
                        <!-- Footer -->
                        <div style="text-align: center;">
                            <p style="color: #9ca3af; margin: 0 0 8px 0; font-size: 15px; line-height: 1.6;">
                                This alert was generated by <strong style="color: #ffffff;">Heimdall Server Monitor</strong><br>
                                Keeping your infrastructure secure and monitored 24/7
                            </p>
                            <p style="color: #6b7280; margin: 0; font-size: 13px;">
                                Generated at ${new Date().toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </div>
                
                <!-- Bottom Spacing -->
                <div style="height: 40px;"></div>
            </div>
        </body>
        </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Recurring alert email sent successfully');
    } catch (error) {
        console.error('Error sending recurring alert email:', error);
        throw error;
    }
}
