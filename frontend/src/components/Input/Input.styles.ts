import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface StyledInputContainerProps {
  fullWidth: boolean;
}

interface StyledInputProps {
  variant: 'default' | 'error' | 'success';
  hasIcon: boolean;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'default':
      return css`
        border: 1px solid ${theme.colors.luxury.sage};
        
        &:focus {
          border-color: ${theme.colors.luxury.darkGreen};
          box-shadow: 0 0 0 3px rgba(1, 68, 33, 0.1);
        }
      `;
      
    case 'error':
      return css`
        border: 1px solid #ef4444;
        
        &:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
      `;
      
    case 'success':
      return css`
        border: 1px solid #10b981;
        
        &:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
      `;
      
    default:
      return css``;
  }
};

export const StyledInputContainer = styled.div<StyledInputContainerProps>`
  position: relative;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin-bottom: ${theme.spacing.lg};
`;

export const StyledLabel = styled.label`
  display: block;
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.luxury.darkGreen};
  margin-bottom: ${theme.spacing.sm};
`;

export const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  padding: ${theme.spacing.md} ${props => props.hasIcon ? '40px' : theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md};
  font-family: ${theme.fonts.body};
  font-size: ${theme.fontSizes.base};
  color: ${theme.colors.luxury.charcoal};
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius.lg};
  transition: ${theme.transitions.default};
  
  ${props => getVariantStyles(props.variant)}
  
  &::placeholder {
    color: ${theme.colors.luxury.brown};
    opacity: 0.6;
  }
  
  &:disabled {
    background: ${theme.colors.luxury.cream};
    color: ${theme.colors.luxury.brown};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &:focus {
    outline: none;
  }
`;

export const StyledError = styled.div`
  color: #ef4444;
  font-size: ${theme.fontSizes.sm};
  margin-top: ${theme.spacing.sm};
  font-family: ${theme.fonts.body};
`; 