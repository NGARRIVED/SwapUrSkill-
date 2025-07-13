import React from 'react';
import { StyledInputContainer, StyledInput, StyledLabel, StyledError } from './Input.styles';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  variant?: 'default' | 'error' | 'success';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  variant = 'default',
  error,
  disabled = false,
  required = false,
  icon,
  className,
  fullWidth = true,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <StyledInputContainer fullWidth={fullWidth} className={className}>
      {label && (
        <StyledLabel>
          {label}
          {required && <span style={{ color: '#ef4444' }}> *</span>}
        </StyledLabel>
      )}
      
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        variant={error ? 'error' : variant}
        disabled={disabled}
        required={required}
        hasIcon={!!icon}
      />
      
      {icon && (
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9CAF88',
          pointerEvents: 'none'
        }}>
          {icon}
        </div>
      )}
      
      {error && <StyledError>{error}</StyledError>}
    </StyledInputContainer>
  );
}; 