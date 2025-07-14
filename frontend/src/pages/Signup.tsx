import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button, Card, CardHeader, CardBody, CardFooter, Input, Avatar } from '../components';

const SignupContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SignupCard = styled(Card)`
  max-width: 500px;
  width: 100%;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-family: 'Georgia', serif;
    font-size: 2.5rem;
    color: #8B4513;
    margin: 0;
    letter-spacing: 3px;
  }
  
  p {
    color: #666;
    font-style: italic;
    margin: 0.5rem 0 0 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const OAuthSection = styled.div`
  margin: 2rem 0;
  
  .divider {
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
    
    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #ddd;
    }
    
    span {
      padding: 0 1rem;
      color: #666;
      font-size: 0.9rem;
    }
  }
`;

interface OAuthButtonProps {
  variant: 'google' | 'github';
}

const OAuthButton = styled.button<OAuthButtonProps>`
  width: 100%;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${props => props.variant === 'google' ? '#4285f4' : '#24292e'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.variant === 'google' ? '#3367d6' : '#1b1f23'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const OTPForm = styled.div`
  margin-top: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  
  h3 {
    color: #8B4513;
    margin-bottom: 1rem;
  }
  
  .otp-section {
    margin: 1rem 0;
    padding: 1rem;
    background: white;
    border-radius: 6px;
    border: 1px solid #e9ecef;
  }
  
  .otp-section h4 {
    color: #8B4513;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  color: #155724;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  font-family: 'Georgia', serif;
  
  &:focus {
    outline: none;
    border-color: #8B4513;
  }
`;

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

interface OTPFormData {
  emailOTP: string;
  phoneOTP: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  const [otpData, setOtpData] = useState<OTPFormData>({
    emailOTP: '',
    phoneOTP: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow 6 digits
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setOtpData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one digit');
      return false;
    }
    
    if (formData.phoneNumber && !/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number');
      return false;
    }
    
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRequiresOTP(true);
        setUserId(data.user_id);
        setSuccess('Account created successfully! Please verify your email and phone number.');
      } else {
        setError(data.detail || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Verify email OTP
      if (otpData.emailOTP) {
        const emailResponse = await fetch('http://localhost:8000/api/v1/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            otp_code: otpData.emailOTP
          }),
        });

        if (!emailResponse.ok) {
          setError('Invalid email OTP');
          setIsLoading(false);
          return;
        }
      }

      // Verify phone OTP
      if (otpData.phoneOTP && formData.phoneNumber) {
        const phoneResponse = await fetch('http://localhost:8000/api/v1/auth/verify-phone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            otp_code: otpData.phoneOTP
          }),
        });

        if (!phoneResponse.ok) {
          setError('Invalid phone OTP');
          setIsLoading(false);
          return;
        }
      }

      setSuccess('Account verified successfully! You can now log in.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setError('');

    try {
      // For demo purposes, we'll simulate OAuth flow
      setError(`${provider} OAuth integration coming soon!`);
    } catch (err) {
      setError('OAuth signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (type: 'email' | 'phone') => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          otp_type: type === 'email' ? 'email_verification' : 'phone_verification'
        }),
      });

      if (response.ok) {
        setSuccess(`${type === 'email' ? 'Email' : 'Phone'} OTP resent successfully!`);
      } else {
        setError(`Failed to resend ${type} OTP`);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <SignupContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SignupCard>
          <CardHeader>
            <Logo>
              <h1>SkillCoterie</h1>
              <p>Luxury Skill Exchange Platform</p>
            </Logo>
          </CardHeader>

          <CardBody>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}

            {!requiresOTP ? (
              <>
                <Form onSubmit={handleSignup}>
                  <NameRow>
                    <InputField
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    <InputField
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </NameRow>
                  
                  <InputField
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <InputField
                    type="tel"
                    name="phoneNumber"
                    placeholder="Phone Number (Optional)"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                  
                  <InputField
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <InputField
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Form>

                <OAuthSection>
                  <div className="divider">
                    <span>or continue with</span>
                  </div>
                  
                  <OAuthButton
                    type="button"
                    variant="google"
                    onClick={() => handleOAuthSignup('google')}
                    disabled={isLoading}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </OAuthButton>
                  
                  <OAuthButton
                    type="button"
                    variant="github"
                    onClick={() => handleOAuthSignup('github')}
                    disabled={isLoading}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                  </OAuthButton>
                </OAuthSection>
              </>
            ) : (
              <OTPForm>
                <h3>Verify Your Account</h3>
                <p>We've sent verification codes to your email and phone number to ensure your account security.</p>
                
                <Form onSubmit={handleOTPVerification}>
                  <div className="otp-section">
                    <h4>Email Verification</h4>
                    <InputField
                      type="text"
                      name="emailOTP"
                      placeholder="Enter email verification code"
                      value={otpData.emailOTP}
                      onChange={handleOTPChange}
                      maxLength={6}
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => resendOTP('email')}
                      style={{ 
                        marginTop: '0.5rem',
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: '#8B4513',
                        border: '1px solid #8B4513',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        fontFamily: 'Georgia, serif'
                      }}
                    >
                      Resend Email Code
                    </button>
                  </div>
                  
                  {formData.phoneNumber && (
                    <div className="otp-section">
                      <h4>Phone Verification</h4>
                      <InputField
                        type="text"
                        name="phoneOTP"
                        placeholder="Enter phone verification code"
                        value={otpData.phoneOTP}
                        onChange={handleOTPChange}
                        maxLength={6}
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => resendOTP('phone')}
                        style={{ 
                          marginTop: '0.5rem',
                          padding: '8px 16px',
                          backgroundColor: 'transparent',
                          color: '#8B4513',
                          border: '1px solid #8B4513',
                          borderRadius: '4px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontFamily: 'Georgia, serif'
                        }}
                      >
                        Resend Phone Code
                      </button>
                    </div>
                  )}
                  
                  <Button type="submit" disabled={isLoading || (!otpData.emailOTP && !otpData.phoneOTP)}>
                    {isLoading ? 'Verifying...' : 'Verify Account'}
                  </Button>
                </Form>
              </OTPForm>
            )}
          </CardBody>

          <CardFooter>
            <p style={{ textAlign: 'center', margin: 0, color: '#666' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#8B4513', textDecoration: 'none' }}>
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </SignupCard>
      </motion.div>
    </SignupContainer>
  );
};

export default Signup; 