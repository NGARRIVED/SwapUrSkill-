import os
from typing import Optional
from twilio.rest import Client
from twilio.base.exceptions import TwilioException

class SMSService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.from_number = os.getenv("TWILIO_FROM_NUMBER")
        
        # Initialize Twilio client if credentials are available
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None

    async def send_otp_sms(self, phone_number: str, otp_code: str) -> bool:
        """
        Send OTP verification SMS.
        """
        if not self.client or not self.from_number:
            print(f"[SMS SERVICE] OTP {otp_code} would be sent to {phone_number}")
            return True
        
        try:
            message = self.client.messages.create(
                body=f"Your SkillCoterie verification code is: {otp_code}. Valid for 10 minutes.",
                from_=self.from_number,
                to=phone_number
            )
            
            print(f"SMS sent successfully. SID: {message.sid}")
            return True
            
        except TwilioException as e:
            print(f"Twilio error sending SMS: {e}")
            return False
        except Exception as e:
            print(f"Error sending SMS: {e}")
            return False

    async def send_login_otp_sms(self, phone_number: str, otp_code: str) -> bool:
        """
        Send OTP for login verification SMS.
        """
        if not self.client or not self.from_number:
            print(f"[SMS SERVICE] Login OTP {otp_code} would be sent to {phone_number}")
            return True
        
        try:
            message = self.client.messages.create(
                body=f"SkillCoterie login verification code: {otp_code}. If you didn't attempt to log in, please contact support immediately.",
                from_=self.from_number,
                to=phone_number
            )
            
            print(f"Login SMS sent successfully. SID: {message.sid}")
            return True
            
        except TwilioException as e:
            print(f"Twilio error sending login SMS: {e}")
            return False
        except Exception as e:
            print(f"Error sending login SMS: {e}")
            return False

    def format_phone_number(self, phone_number: str) -> str:
        """
        Format phone number for international SMS (add +1 for US numbers if not present).
        """
        # Remove all non-digit characters
        digits_only = ''.join(filter(str.isdigit, phone_number))
        
        # If it's a 10-digit US number, add +1
        if len(digits_only) == 10:
            return f"+1{digits_only}"
        # If it's already 11 digits and starts with 1, add +
        elif len(digits_only) == 11 and digits_only.startswith('1'):
            return f"+{digits_only}"
        # If it already has country code, return as is
        elif digits_only.startswith('1') and len(digits_only) > 11:
            return f"+{digits_only}"
        else:
            # For other formats, assume it's already properly formatted
            return phone_number 