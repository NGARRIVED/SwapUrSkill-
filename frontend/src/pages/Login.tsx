import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button, Card, CardHeader, CardBody, CardFooter, Input, Avatar } from '../components';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const LoginCard = styled(Card)`
  max-width: 450px;
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
  
  .otp-inputs {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin: 1rem 0;
  }
  
  .otp-input {
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 1.2rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-weight: bold;
    
    &:focus {
      border-color: #8B4513;
      outline: none;
    }
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

interface LoginFormData {
  email: string;
  password: string;
}

interface OTPFormData {
  otp: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  const [otpData, setOtpData] = useState<OTPFormData>({
    otp: ''
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
    const { value } = e.target;
    // Only allow 6 digits
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setOtpData({ otp: value });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires_otp) {
          setRequiresOTP(true);
          setUserId(data.user.id);
          setSuccess('Please check your email and phone for the verification code.');
        } else {
          // Store token and redirect
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setSuccess('Login successful! Redirecting...');
          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
        }
      } else {
        setError(data.detail || 'Login failed');
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
      const response = await fetch('http://localhost:8000/api/v1/auth/verify-login-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          otp_code: otpData.otp
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setError(data.detail || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setError('');

    try {
      // For demo purposes, we'll simulate OAuth flow
      // In production, this would redirect to OAuth provider
      setError(`${provider} OAuth integration coming soon!`);
    } catch (err) {
      setError('OAuth login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          otp_type: 'login_verification'
        }),
      });

      if (response.ok) {
        setSuccess('OTP resent successfully!');
      } else {
        setError('Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <LoginContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <LoginCard>
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
                <Form onSubmit={handleLogin}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease',
                      fontFamily: 'Georgia, serif'
                    }}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease',
                      fontFamily: 'Georgia, serif'
                    }}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Form>

                <OAuthSection>
                  <div className="divider">
                    <span>or continue with</span>
                  </div>
                  
                  <OAuthButton
                    type="button"
                    variant="google"
                    onClick={() => handleOAuthLogin('google')}
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
                    onClick={() => handleOAuthLogin('github')}
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
                <h3>Two-Factor Authentication</h3>
                <p>We've sent a verification code to your email and phone number to ensure your account security.</p>
                
                <Form onSubmit={handleOTPVerification}>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otpData.otp}
                    onChange={handleOTPChange}
                    maxLength={6}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      transition: 'border-color 0.3s ease',
                      fontFamily: 'Georgia, serif'
                    }}
                  />
                  <Button type="submit" disabled={isLoading || otpData.otp.length !== 6}>
                    {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                  </Button>
                </Form>
                
                <button 
                  onClick={resendOTP}
                  style={{ 
                    marginTop: '1rem', 
                    width: '100%',
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    color: '#8B4513',
                    border: '2px solid #8B4513',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  Resend Code
                </button>
              </OTPForm>
            )}
          </CardBody>

          <CardFooter>
            <p style={{ textAlign: 'center', margin: 0, color: '#666' }}>
              Don't have an account?{' '}
              <a href="/signup" style={{ color: '#8B4513', textDecoration: 'none' }}>
                Sign up here
              </a>
            </p>
          </CardFooter>
        </LoginCard>
      </motion.div>
    </LoginContainer>
  );
};

export default Login; 