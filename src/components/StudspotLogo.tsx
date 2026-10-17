import React from 'react';

interface StudspotLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full' | 'app-icon' | 'badge';
  theme?: 'dark' | 'light' | 'auto';
  showTagline?: boolean;
}

export const StudspotLogo: React.FC<StudspotLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'icon',
  theme = 'auto',
  showTagline = false,
}) => {
  // Dimension presets
  const sizeMap = {
    xs: { icon: 'w-6 h-6', text: 'text-xs', mark: 24 },
    sm: { icon: 'w-8 h-8', text: 'text-sm', mark: 32 },
    md: { icon: 'w-10 h-10', text: 'text-base', mark: 40 },
    lg: { icon: 'w-14 h-14', text: 'text-xl', mark: 56 },
    xl: { icon: 'w-20 h-20', text: 'text-2xl', mark: 80 },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // The official gold and dark STUDSPOT logo
  const logoImgSrc = '/src/assets/images/studspot_gold_icon_1792275165524.jpg';

  // Crisp representation of the gold & dark official logo
  const SvgMark = (
    <div className={`relative ${currentSize.icon} shrink-0 rounded-2xl overflow-hidden shadow-sm bg-neutral-950 p-0.5 border border-[#F3B71B]/50 flex items-center justify-center`}>
      <img
        src={logoImgSrc}
        alt="STUDSPOT Logo"
        className="w-full h-full object-cover rounded-xl"
        loading="eager"
      />
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {SvgMark}
      </div>
    );
  }

  if (variant === 'app-icon') {
    return (
      <div className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
        <div className="relative rounded-2xl overflow-hidden shadow-2xl p-1 bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-neutral-700/80 hover:border-cyan-400/50 transition-all group">
          <img
            src={logoImgSrc}
            alt="STUDSPOT App Icon"
            className={`${currentSize.icon} object-cover rounded-xl group-hover:scale-105 transition-transform`}
          />
        </div>
        <span className="font-heading font-black tracking-tight text-white uppercase text-xs">
          STUDSPOT
        </span>
      </div>
    );
  }

  // Full variant: Logo mark + bold STUDSPOT typography
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {SvgMark}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-heading font-black tracking-tight text-white ${currentSize.text}`}>
            STUDSPOT
          </span>
          <span className="text-[9px] font-bold text-black bg-[#F3B71B] px-1.5 py-0.2 rounded font-mono">
            KENYA
          </span>
        </div>
        {showTagline ? (
          <span className="text-[10px] text-neutral-400 font-medium tracking-normal mt-0.5">
            Campus Marketplace & Community
          </span>
        ) : null}
      </div>
    </div>
  );
};
