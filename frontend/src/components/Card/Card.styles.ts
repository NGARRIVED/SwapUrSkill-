import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface StyledCardProps {
  variant: 'default' | 'profile' | 'form' | 'gold';
  onClick?: () => void;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'default':
      return css`
        background: ${theme.colors.white};
        border: 1px solid ${theme.colors.luxury.cream};
        box-shadow: ${theme.shadows.luxury};
        
        &:hover {
          box-shadow: ${theme.shadows.lg};
          transform: translateY(-2px);
        }
      `;
      
    case 'profile':
      return css`
        background: ${theme.colors.white};
        border: 1px solid ${theme.colors.luxury.cream};
        box-shadow: ${theme.shadows.luxury};
        
        &:hover {
          border-color: ${theme.colors.luxury.gold};
          box-shadow: ${theme.shadows.lg};
          transform: translateY(-2px);
        }
      `;
      
    case 'form':
      return css`
        background: ${theme.colors.white};
        border: 1px solid ${theme.colors.luxury.sage};
        box-shadow: ${theme.shadows.luxury};
        max-width: 500px;
        margin: 0 auto;
      `;
      
    case 'gold':
      return css`
        background: ${theme.gradients.gold};
        color: ${theme.colors.white};
        border: none;
        box-shadow: ${theme.shadows.gold};
        
        &:hover {
          box-shadow: ${theme.shadows.lg};
          transform: translateY(-2px);
        }
      `;
      
    default:
      return css``;
  }
};

export const StyledCard = styled.div<StyledCardProps>`
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  transition: ${theme.transitions.default};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  
  ${props => getVariantStyles(props.variant)}
`;

export const StyledCardHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
  
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.display};
    color: ${theme.colors.luxury.darkGreen};
    margin-bottom: ${theme.spacing.sm};
  }
  
  p {
    color: ${theme.colors.luxury.brown};
    font-size: ${theme.fontSizes.sm};
  }
`;

export const StyledCardBody = styled.div`
  margin-bottom: ${theme.spacing.lg};
  
  p {
    color: ${theme.colors.luxury.charcoal};
    line-height: 1.6;
    margin-bottom: ${theme.spacing.md};
  }
`;

export const StyledCardFooter = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  align-items: center;
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.luxury.cream};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`; 