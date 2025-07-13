import React from 'react';
import { StyledAvatar, StyledAvatarImage, StyledAvatarFallback } from './Avatar.styles';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  fallback?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'medium',
  fallback,
  className,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const fallbackText = fallback ? getInitials(fallback) : '?';

  return (
    <StyledAvatar size={size} className={className}>
      {src ? (
        <StyledAvatarImage src={src} alt={alt || 'User avatar'} />
      ) : (
        <StyledAvatarFallback>
          {fallbackText}
        </StyledAvatarFallback>
      )}
    </StyledAvatar>
  );
}; 