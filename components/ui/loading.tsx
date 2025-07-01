import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'nothing';
  color?: 'white' | 'purple' | 'blue';
  text?: string;
  className?: string;
  fullscreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'white',
  text = 'Loading...',
  className = '',
  fullscreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const colorClasses = {
    white: 'border-white border-t-transparent',
    purple: 'border-purple-400 border-t-transparent',
    blue: 'border-blue-400 border-t-transparent'
  };

  // Modern animated spinner with glowing border, shadow, and float
  const renderSpinner = () => (
    <div className="relative flex items-center justify-center">
      <div
        className={`animate-spin-slow animate-float ${sizeClasses[size]} border-4 border-t-4 border-b-4 border-transparent rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 border-t-purple-400 border-b-blue-400 shadow-2xl shadow-purple-400/30`}
        style={{ boxShadow: '0 0 32px 8px rgba(168,85,247,0.25), 0 4px 32px 0 rgba(168,85,247,0.10)' }}
      />
      <div className={`absolute ${size === 'xl' ? 'w-16 h-16' : size === 'lg' ? 'w-10 h-10' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4'} bg-gray-950 rounded-full opacity-80`}></div>
    </div>
  );

  // Animated dots
  const renderDots = () => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`rounded-full ${size === 'xl' ? 'w-6 h-6' : size === 'lg' ? 'w-4 h-4' : size === 'md' ? 'w-3 h-3' : 'w-2 h-2'} bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 animate-bounce`}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );

  // Animated pulse
  const renderPulse = () => (
    <div className={`rounded-full ${sizeClasses[size]} bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 animate-pulse`} />
  );

  const renderLoader = () => {
    switch (variant) {
      case 'nothing':
        return;
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  const loaderContent = (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      {renderLoader()}
      <span className="text-sm md:text-sm font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse drop-shadow-xl">
        {text === "none" ? "" : text}
      </span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center min-h-screen min-w-full bg-gradient-to-br from-gray-950/90 via-gray-900/80 to-purple-950/90 backdrop-blur-xl animate-fade-in">
        <div className="flex flex-col items-center justify-center w-full h-full">
          {loaderContent}
        </div>
        <style jsx global>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.7s cubic-bezier(0.4,0,0.2,1) both;
          }
          @keyframes spin-slow {
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 1.2s linear infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
          .animate-float {
            animation: float 2.2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return loaderContent;
};

export default Loading; 