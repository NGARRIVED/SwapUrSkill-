import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'small' | 'medium' | 'large';
  fullWidth: boolean;
  disabled: boolean;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return css`
        background: ${theme.colors.luxury.darkGreen};
        color: ${theme.colors.white};
        border: 2px solid ${theme.colors.luxury.darkGreen};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.luxury.navy};
          border-color: ${theme.colors.luxury.navy};
          box-shadow: ${theme.shadows.luxury};
        }
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(1, 68, 33, 0.3);
        }
      `;
      
    case 'secondary':
      return css`
        background: ${theme.colors.luxury.gold};
        color: ${theme.colors.luxury.charcoal};
        border: 2px solid ${theme.colors.luxury.gold};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.luxury.brown};
          color: ${theme.colors.white};
          border-color: ${theme.colors.luxury.brown};
          box-shadow: ${theme.shadows.gold};
        }
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(191, 167, 106, 0.3);
        }
      `;
      
    case 'outline':
      return css`
        background: transparent;
        color: ${theme.colors.luxury.darkGreen};
        border: 2px solid ${theme.colors.luxury.darkGreen};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.luxury.darkGreen};
          color: ${theme.colors.white};
        }
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(1, 68, 33, 0.3);
        }
      `;
      
    case 'ghost':
      return css`
        background: transparent;
        color: ${theme.colors.luxury.charcoal};
        border: 2px solid transparent;
        
        &:hover:not(:disabled) {
          background: ${theme.colors.luxury.cream};
          color: ${theme.colors.luxury.darkGreen};
        }
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(1, 68, 33, 0.3);
        }
      `;
      
    default:
      return css``;
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return css`
        padding: 0.5rem 1rem;
        font-size: ${theme.fontSizes.sm};
        border-radius: ${theme.borderRadius.md};
      `;
      
    case 'medium':
      return css`
        padding: 0.75rem 1.5rem;
        font-size: ${theme.fontSizes.base};
        border-radius: ${theme.borderRadius.lg};
      `;
      
    case 'large':
      return css`
        padding: 1rem 2rem;
        font-size: ${theme.fontSizes.lg};
        border-radius: ${theme.borderRadius.xl};
      `;
      
    default:
      return css``;
  }
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.fonts.body};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  min-width: 120px;
  
  ${props => getVariantStyles(props.variant)}
  ${props => getSizeStyles(props.size)}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`; 