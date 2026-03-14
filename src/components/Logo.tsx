interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

const Logo = ({ size = 'md', showText = true, variant = 'light' }: LogoProps) => {
  const dimensions = {
    sm: { circle: 32, icon: 18 },
    md: { circle: 40, icon: 24 },
    lg: { circle: 48, icon: 28 },
  };

  const { circle, icon } = dimensions[size];
  
  // Color del círculo: usar el verde del logo (#2d7a4f)
  const circleColor = '#2d7a4f';
  
  // Colores de texto según variante
  const textColor = variant === 'dark' ? '#ffffff' : '#1a1a1a';
  const taglineColor = variant === 'dark' ? '#d1d5db' : '#6b7280';

  // Tamaños de texto según tamaño del logo
  const textSizes = {
    sm: { name: 16, tagline: 10 },
    md: { name: 18, tagline: 11 },
    lg: { name: 20, tagline: 12 },
  };

  const { name: nameSize, tagline: taglineSize } = textSizes[size];

  return (
    <div className="flex items-center gap-3">
      {/* Círculo con hoja */}
      <div 
        className="flex items-center justify-center rounded-full flex-shrink-0"
        style={{ 
          width: circle, 
          height: circle, 
          backgroundColor: circleColor 
        }}
      >
        <svg 
          width={icon} 
          height={icon} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2C12 2 8 6 8 12C8 15.314 10.686 18 14 18C17.314 18 20 15.314 20 12C20 6 16 2 16 2C16 2 14 4 12 6C10 4 12 2 12 2Z" 
            fill="white" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M12 6C10.5 7.5 8 10 8 12C8 14 9 16 10 17" 
            stroke="#2d7a4f" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Texto */}
      {showText && (
        <div className="flex flex-col">
          <span 
            className="font-semibold leading-tight tracking-tight"
            style={{ 
              fontSize: nameSize, 
              color: textColor 
            }}
          >
            Kamps Py
          </span>
          <span 
            className="font-normal leading-tight"
            style={{ 
              fontSize: taglineSize, 
              color: taglineColor 
            }}
          >
            Mercado Agrícola Digital
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
