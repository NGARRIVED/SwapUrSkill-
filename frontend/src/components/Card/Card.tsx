import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export interface CardProps {
  variant?: 'default' | 'profile' | 'form' | 'gold';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const StyledCard = styled.div<{ variant: string; onClick?: () => void }>`
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  transition: ${theme.transitions.default};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  background: ${props => props.variant === 'gold' ? theme.gradients.gold : theme.colors.white};
  color: ${props => props.variant === 'gold' ? theme.colors.white : theme.colors.luxury.charcoal};
  border: 1px solid ${props => props.variant === 'gold' ? 'transparent' : theme.colors.luxury.cream};
  box-shadow: ${theme.shadows.luxury};
  
  &:hover {
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const StyledCardHeader = styled.div`
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

const StyledCardBody = styled.div`
  margin-bottom: ${theme.spacing.lg};
  
  p {
    color: ${theme.colors.luxury.charcoal};
    line-height: 1.6;
    margin-bottom: ${theme.spacing.md};
  }
`;

const StyledCardFooter = styled.div`
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

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className,
  onClick,
}) => {
  return (
    <StyledCard variant={variant} className={className} onClick={onClick}>
      {children}
    </StyledCard>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <StyledCardHeader className={className}>
      {children}
    </StyledCardHeader>
  );
};

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return (
    <StyledCardBody className={className}>
      {children}
    </StyledCardBody>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <StyledCardFooter className={className}>
      {children}
    </StyledCardFooter>
  );
}; 