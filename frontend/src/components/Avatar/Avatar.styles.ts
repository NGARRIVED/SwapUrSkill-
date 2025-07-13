import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface StyledAvatarProps {
  size: 'small' | 'medium' | 'large' | 'xlarge';
}

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'small':
      return css`
        width: 32px;
        height: 32px;
        font-size: ${theme.fontSizes.xs};
      `;
      
    case 'medium':
      return css`
        width: 48px;
        height: 48px;
        font-size: ${theme.fontSizes.sm};
      `;
      
    case 'large':
      return css`
        width: 64px;
        height: 64px;
        font-size: ${theme.fontSizes.base};
      `;
      
    case 'xlarge':
      return css`
        width: 96px;
        height: 96px;
        font-size: ${theme.fontSizes.lg};
      `;
      
    default:
      return css``;
  }
};

export const StyledAvatar = styled.div<StyledAvatarProps>`
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.luxury.cream};
  border: 2px solid ${theme.colors.luxury.gold};
  box-shadow: ${theme.shadows.luxury};
  transition: ${theme.transitions.default};
  
  ${props => getSizeStyles(props.size)}
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${theme.shadows.lg};
  }
`;

export const StyledAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

export const StyledAvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.gradients.gold};
  color: ${theme.colors.white};
  font-family: ${theme.fonts.display};
  font-weight: ${theme.fontWeights.semibold};
  text-transform: uppercase;
`; 