import os
from typing import Optional
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, HtmlContent

class EmailService:
    def __init__(self):
        self.sendgrid_api_key = os.getenv("SENDGRID_API_KEY")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@skillcoterie.com")
        self.sg = SendGridAPIClient(api_key=self.sendgrid_api_key) if self.sendgrid_api_key else None

    async def send_otp_email(self, email: str, otp_code: str, user_name: str) -> bool:
        """
        Send OTP verification email.
        """
        if not self.sg:
            print(f"[EMAIL SERVICE] OTP {otp_code} would be sent to {email} for {user_name}")
            return True
        
        try:
            subject = "Verify Your SkillCoterie Account"
            html_content = self._get_otp_email_template(otp_code, user_name)
            
            message = Mail(
                from_email=Email(self.from_email),
                to_emails=To(email),
                subject=subject,
                html_content=HtmlContent(html_content)
            )
            
            response = self.sg.send(message)
            return response.status_code == 202
            
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

    async def send_login_otp_email(self, email: str, otp_code: str, user_name: str) -> bool:
        """
        Send OTP for login verification.
        """
        if not self.sg:
            print(f"[EMAIL SERVICE] Login OTP {otp_code} would be sent to {email} for {user_name}")
            return True
        
        try:
            subject = "Login Verification - SkillCoterie"
            html_content = self._get_login_otp_email_template(otp_code, user_name)
            
            message = Mail(
                from_email=Email(self.from_email),
                to_emails=To(email),
                subject=subject,
                html_content=HtmlContent(html_content)
            )
            
            response = self.sg.send(message)
            return response.status_code == 202
            
        except Exception as e:
            print(f"Error sending login email: {e}")
            return False

    def _get_otp_email_template(self, otp_code: str, user_name: str) -> str:
        """
        Generate HTML email template for OTP verification.
        """
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Account - SkillCoterie</title>
            <style>
                body {{
                    font-family: 'Georgia', serif;
                    line-height: 1.6;
                    color: #2c3e50;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
                    color: #ffffff;
                    padding: 30px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                    font-weight: 300;
                    letter-spacing: 2px;
                }}
                .content {{
                    padding: 40px 30px;
                }}
                .otp-box {{
                    background-color: #f8f9fa;
                    border: 2px solid #8B4513;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    margin: 30px 0;
                }}
                .otp-code {{
                    font-size: 32px;
                    font-weight: bold;
                    color: #8B4513;
                    letter-spacing: 4px;
                    font-family: 'Courier New', monospace;
                }}
                .footer {{
                    background-color: #2c3e50;
                    color: #ffffff;
                    padding: 20px 30px;
                    text-align: center;
                    font-size: 14px;
                }}
                .button {{
                    display: inline-block;
                    background-color: #8B4513;
                    color: #ffffff;
                    padding: 12px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: bold;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SkillCoterie</h1>
                    <p>Luxury Skill Exchange Platform</p>
                </div>
                
                <div class="content">
                    <h2>Welcome to SkillCoterie, {user_name}!</h2>
                    
                    <p>Thank you for joining our exclusive community of skilled professionals. To complete your registration and ensure the security of your account, please verify your email address using the OTP code below:</p>
                    
                    <div class="otp-box">
                        <p><strong>Your Verification Code:</strong></p>
                        <div class="otp-code">{otp_code}</div>
                        <p><small>This code will expire in 10 minutes</small></p>
                    </div>
                    
                    <p>Please enter this code in the verification form on our website to complete your registration.</p>
                    
                    <p>If you didn't create an account with SkillCoterie, please ignore this email.</p>
                    
                    <p>Best regards,<br>The SkillCoterie Team</p>
                </div>
                
                <div class="footer">
                    <p>&copy; 2024 SkillCoterie. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_login_otp_email_template(self, otp_code: str, user_name: str) -> str:
        """
        Generate HTML email template for login OTP verification.
        """
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Verification - SkillCoterie</title>
            <style>
                body {{
                    font-family: 'Georgia', serif;
                    line-height: 1.6;
                    color: #2c3e50;
                    background-color: #f8f9fa;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
                    color: #ffffff;
                    padding: 30px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                    font-weight: 300;
                    letter-spacing: 2px;
                }}
                .content {{
                    padding: 40px 30px;
                }}
                .otp-box {{
                    background-color: #f8f9fa;
                    border: 2px solid #8B4513;
                    border-radius: 8px;
                    padding: 20px;
                    text-align: center;
                    margin: 30px 0;
                }}
                .otp-code {{
                    font-size: 32px;
                    font-weight: bold;
                    color: #8B4513;
                    letter-spacing: 4px;
                    font-family: 'Courier New', monospace;
                }}
                .warning {{
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 5px;
                    padding: 15px;
                    margin: 20px 0;
                }}
                .footer {{
                    background-color: #2c3e50;
                    color: #ffffff;
                    padding: 20px 30px;
                    text-align: center;
                    font-size: 14px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>SkillCoterie</h1>
                    <p>Luxury Skill Exchange Platform</p>
                </div>
                
                <div class="content">
                    <h2>Login Verification Required</h2>
                    
                    <p>Hello {user_name},</p>
                    
                    <p>We detected a login attempt from a new device. To ensure the security of your account, please verify this login using the OTP code below:</p>
                    
                    <div class="otp-box">
                        <p><strong>Your Verification Code:</strong></p>
                        <div class="otp-code">{otp_code}</div>
                        <p><small>This code will expire in 10 minutes</small></p>
                    </div>
                    
                    <div class="warning">
                        <p><strong>Security Notice:</strong> If you didn't attempt to log in, please change your password immediately and contact our support team.</p>
                    </div>
                    
                    <p>Please enter this code in the verification form to complete your login.</p>
                    
                    <p>Best regards,<br>The SkillCoterie Security Team</p>
                </div>
                
                <div class="footer">
                    <p>&copy; 2024 SkillCoterie. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        """ 