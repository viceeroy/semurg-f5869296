import React from 'react';

interface AvatarFallbackProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AvatarFallback: React.FC<AvatarFallbackProps> = ({ 
  src, 
  alt = 'User avatar', 
  name = 'User', 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-20 h-20 text-2xl'
  };

  const getInitial = (name: string) => {
    if (!name || name.trim() === '') return 'U';
    return name.trim().charAt(0).toUpperCase();
  };

  const getNameFromProfile = (profile: any) => {
    if (profile?.first_name) return profile.first_name;
    if (profile?.username) return profile.username;
    return name;
  };

  // If we have a valid image source, show the image
  if (src && src.trim() !== '') {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 ${className}`}
        onError={(e) => {
          // If image fails to load, hide it and show fallback
          e.currentTarget.style.display = 'none';
          if (e.currentTarget.nextSibling) {
            (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
          }
        }}
      />
    );
  }

  // Fallback: show initial letter
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold border-2 border-gray-200 ${className}`}
    >
      {getInitial(name)}
    </div>
  );
};

export default AvatarFallback;