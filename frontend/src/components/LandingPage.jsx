import React from 'react';
import { Link } from 'react-router-dom';

// CSS animations for the animated logo
const logoAnimationStyles = `
  @keyframes draw-undraw-logo {
    0% {
      stroke-dashoffset: 3000;
      fill-opacity: 0;
      opacity: 1;
    }
    20% {
      stroke-dashoffset: 0;
      fill-opacity: 0;
      opacity: 1;
    }
    30% {
      stroke-dashoffset: 0;
      fill-opacity: 0.8;
      opacity: 1;
    }
    60% {
      stroke-dashoffset: 0;
      fill-opacity: 0.8;
      opacity: 1;
    }
    70% {
      stroke-dashoffset: 0;
      fill-opacity: 0;
      opacity: 1;
    }
    85% {
      stroke-dashoffset: 3000;
      fill-opacity: 0;
      opacity: 0.5;
    }
    100% {
      stroke-dashoffset: 3000;
      fill-opacity: 0;
      opacity: 0;
    }
  }

  @keyframes text-blur-to-clear {
    0% {
      opacity: 0;
      filter: blur(25px);
      transform: scale(0.7);
      letter-spacing: 0.5rem;
    }
    15% {
      opacity: 0.1;
      filter: blur(22px);
      transform: scale(0.75);
      letter-spacing: 0.4rem;
    }
    30% {
      opacity: 0.3;
      filter: blur(18px);
      transform: scale(0.8);
      letter-spacing: 0.3rem;
    }
    45% {
      opacity: 0.5;
      filter: blur(14px);
      transform: scale(0.85);
      letter-spacing: 0.2rem;
    }
    60% {
      opacity: 0.7;
      filter: blur(10px);
      transform: scale(0.9);
      letter-spacing: 0.15rem;
    }
    75% {
      opacity: 0.85;
      filter: blur(6px);
      transform: scale(0.95);
      letter-spacing: 0.1rem;
    }
    90% {
      opacity: 0.95;
      filter: blur(2px);
      transform: scale(0.98);
      letter-spacing: 0.05rem;
    }
    100% {
      opacity: 1;
      filter: blur(0px);
      transform: scale(1);
      letter-spacing: normal;
    }
  }

  @keyframes underline-draw {
    from {
      opacity: 0;
      width: 0;
    }
    to {
      opacity: 1;
      width: 6rem; /* w-24 equivalent */
    }
  }

  @keyframes text-wave {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-3px);
    }
  }

  /* Whole word text animation - only for main title */
  .logo-text-wrapper.main-title h1 {
    opacity: 0;
    filter: blur(25px);
    animation: text-blur-to-clear 2s ease-out 7.2s forwards;
  }

  .animate-draw-logo {
    stroke: #000;
    stroke-width: 2.5;
    stroke-dasharray: 3000;
    stroke-dashoffset: 3000;
    fill: #000;
    fill-opacity: 0;
    animation: draw-undraw-logo 8s ease-in-out forwards;
  }

  .logo-text-wrapper .absolute {
    opacity: 0;
    width: 0;
    animation: underline-draw 1s ease-out 9.5s forwards;
  }

  @media (min-width: 640px) {
    .logo-text-wrapper .absolute {
      width: 8rem; /* w-32 equivalent for sm */
    }
  }

  @media (min-width: 1024px) {
    .logo-text-wrapper .absolute {
      width: 10rem; /* w-40 equivalent for lg */
    }
  }

  .logo-text-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 2.5rem;
    width: 100%;
  }

  .logo-svg-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .logo-text-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Inject CSS animations */}
      <style>{logoAnimationStyles}</style>
      {/* Simple Header Navigation */}
      <header className="absolute top-0 left-0 right-0 z-20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-light text-black tracking-tight">
              attendee
            </Link>
            <Link
              to="/login"
              className="px-6 py-2 text-sm font-medium text-black border border-gray-300 hover:border-gray-400 transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        </nav>
      </header>

      {/* Geometric Background Elements - Responsive */}
      <div className="absolute inset-0 z-0">
        {/* Large geometric shapes - Hidden on mobile to reduce clutter */}
        <div className="hidden sm:block absolute top-20 right-10 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 border border-gray-100 transform rotate-45 animate-pulse"></div>
        <div className="hidden md:block absolute top-40 right-32 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-gray-50 transform rotate-12"></div>
        <div className="hidden sm:block absolute bottom-20 left-10 w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 border-2 border-gray-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-40 left-32 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 bg-black transform rotate-45"></div>
        
        {/* Small decorative elements - Kept but smaller on mobile */}
        <div className="absolute top-1/2 left-1/4 w-1 sm:w-2 h-1 sm:h-2 bg-black rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-gray-400 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 sm:w-3 h-2 sm:h-3 border border-gray-300 transform rotate-45"></div>
        
        {/* Animated floating elements - Responsive sizes */}
        <div className="absolute top-20 left-1/4 w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 border border-gray-200 transform rotate-45 animate-bounce"></div>
        <div className="absolute top-1/4 right-20 w-3 sm:w-4 h-3 sm:h-4 bg-gray-300 rounded-full animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 lg:pb-32">
            <div className="text-center">
              {/* Geometric accent above title - Responsive */}
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 bg-black transform rotate-45"></div>
                  <div className="w-8 sm:w-12 lg:w-16 h-px bg-gray-300"></div>
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 border border-gray-400 rounded-full"></div>
                  <div className="w-8 sm:w-12 lg:w-16 h-px bg-gray-300"></div>
                  <div className="w-2 sm:w-3 h-2 sm:h-3 bg-black transform rotate-45"></div>
                </div>
              </div>
              
              {/* Main Title Logo Animation */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="logo-text-container" style={{width: '100%', maxWidth: '800px', height: '200px'}}>
                  {/* Animated Custom SVG Logo - Larger for title */}
                  <div className="logo-svg-wrapper w-28 sm:w-32 lg:w-36 h-28 sm:h-32 lg:h-36">
                    <svg 
                      viewBox="0 0 466 422" 
                      className="w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        className="animate-draw-logo"
                        d="M464.944,378.17c-0.009-0.073-0.022-0.144-0.033-0.216c-0.034-0.233-0.079-0.462-0.134-0.688  c-0.018-0.072-0.035-0.143-0.055-0.215c-0.073-0.265-0.159-0.525-0.26-0.777c-0.009-0.023-0.016-0.047-0.025-0.069  c-0.118-0.287-0.255-0.565-0.406-0.833c-0.008-0.014-0.013-0.03-0.021-0.044L268.158,33.188c-0.034-0.059-0.073-0.111-0.108-0.169  c-0.081-0.134-0.163-0.267-0.253-0.395c-0.066-0.094-0.136-0.184-0.205-0.275c-0.076-0.099-0.152-0.198-0.232-0.292  c-0.087-0.103-0.178-0.2-0.27-0.297c-0.073-0.077-0.145-0.153-0.22-0.226c-0.101-0.098-0.206-0.191-0.311-0.283  c-0.078-0.067-0.155-0.134-0.235-0.198c-0.105-0.084-0.213-0.163-0.322-0.241c-0.092-0.066-0.185-0.13-0.28-0.192  c-0.1-0.065-0.202-0.125-0.305-0.185c-0.112-0.065-0.225-0.129-0.341-0.188c-0.091-0.047-0.184-0.09-0.276-0.133  c-0.131-0.061-0.262-0.119-0.397-0.172c-0.086-0.034-0.174-0.065-0.261-0.095c-0.141-0.05-0.283-0.097-0.428-0.138  c-0.091-0.026-0.183-0.048-0.275-0.071c-0.14-0.034-0.28-0.067-0.423-0.094c-0.11-0.021-0.221-0.035-0.332-0.051  c-0.125-0.017-0.25-0.035-0.378-0.046c-0.14-0.012-0.28-0.017-0.42-0.021c-0.079-0.002-0.156-0.012-0.236-0.012h-56.616  c-0.035,0-0.069,0.006-0.104,0.007c-0.258,0.004-0.514,0.021-0.77,0.051c-0.066,0.008-0.131,0.014-0.196,0.023  c-0.593,0.086-1.172,0.242-1.728,0.466c-0.064,0.026-0.127,0.054-0.19,0.082c-0.227,0.098-0.448,0.208-0.664,0.328  c-0.047,0.026-0.095,0.05-0.141,0.077c-0.516,0.302-0.998,0.669-1.435,1.096c-0.049,0.048-0.096,0.098-0.144,0.147  c-0.164,0.169-0.319,0.346-0.468,0.532c-0.049,0.061-0.1,0.121-0.147,0.184c-0.177,0.236-0.345,0.481-0.497,0.742  c-0.003,0.005-0.007,0.01-0.01,0.015c-0.001,0.002-0.001,0.003-0.002,0.005L1.005,375.3c-1.34,2.32-1.34,5.179,0,7.5l28.306,49.034  c0.009,0.016,0.021,0.03,0.031,0.046c0.158,0.269,0.33,0.531,0.522,0.781c0.001,0.001,0.001,0.001,0.002,0.002  c0.182,0.236,0.382,0.459,0.594,0.674c0.044,0.045,0.089,0.088,0.134,0.131c0.178,0.172,0.366,0.336,0.563,0.492  c0.047,0.038,0.093,0.077,0.141,0.113c0.241,0.181,0.49,0.353,0.758,0.508c0.265,0.153,0.536,0.281,0.81,0.398  c0.021,0.009,0.041,0.021,0.062,0.03c0.931,0.388,1.906,0.577,2.872,0.577c0.015,0,0.03-0.003,0.045-0.003h393.347  c2.68,0,5.155-1.43,6.495-3.75l28.309-49.031c0.01-0.018,0.017-0.038,0.028-0.056c0.151-0.267,0.289-0.541,0.407-0.827  c0.005-0.013,0.009-0.027,0.015-0.04c0.106-0.26,0.194-0.528,0.271-0.802c0.021-0.073,0.038-0.146,0.057-0.22  c0.055-0.221,0.099-0.445,0.133-0.673c0.012-0.078,0.026-0.155,0.036-0.233c0.033-0.279,0.054-0.561,0.056-0.848  c0-0.014,0.002-0.028,0.002-0.042c0-0.003,0-0.006,0-0.009C465,378.753,464.978,378.46,464.944,378.17z M35.807,413.084  L16.16,379.05L205.032,51.913l156.234,270.607H321.97L211.527,131.229c-0.014-0.024-0.03-0.045-0.044-0.068  c-0.081-0.137-0.169-0.269-0.259-0.401c-0.052-0.076-0.101-0.155-0.156-0.228c-0.085-0.116-0.178-0.226-0.27-0.338  c-0.069-0.083-0.135-0.168-0.207-0.247c-0.079-0.088-0.166-0.17-0.25-0.255c-0.094-0.094-0.186-0.19-0.284-0.278  c-0.071-0.064-0.146-0.123-0.22-0.184c-0.12-0.1-0.239-0.2-0.364-0.292c-0.068-0.05-0.14-0.095-0.21-0.143  c-0.136-0.093-0.273-0.185-0.415-0.268c-0.023-0.014-0.043-0.03-0.067-0.043c-0.06-0.035-0.122-0.061-0.183-0.094  c-0.132-0.071-0.263-0.141-0.399-0.204c-0.107-0.05-0.214-0.094-0.322-0.138c-0.113-0.046-0.225-0.092-0.34-0.133  c-0.128-0.046-0.258-0.085-0.387-0.124c-0.099-0.029-0.197-0.058-0.296-0.083c-0.141-0.035-0.282-0.065-0.423-0.092  c-0.095-0.018-0.191-0.036-0.287-0.05c-0.14-0.021-0.28-0.037-0.421-0.05c-0.104-0.01-0.208-0.018-0.313-0.023  c-0.13-0.007-0.26-0.009-0.389-0.009c-0.118,0-0.236,0.002-0.354,0.008c-0.117,0.006-0.232,0.015-0.348,0.026  c-0.129,0.012-0.258,0.027-0.386,0.046c-0.108,0.016-0.214,0.035-0.321,0.056c-0.131,0.025-0.262,0.053-0.392,0.085  c-0.109,0.027-0.217,0.059-0.325,0.091c-0.121,0.036-0.241,0.073-0.36,0.115c-0.124,0.044-0.245,0.093-0.366,0.143  c-0.1,0.041-0.199,0.082-0.298,0.128c-0.143,0.066-0.283,0.14-0.422,0.216c-0.055,0.03-0.112,0.054-0.166,0.085  c-0.021,0.012-0.04,0.027-0.061,0.039c-0.148,0.087-0.292,0.183-0.435,0.281c-0.064,0.044-0.13,0.086-0.193,0.132  c-0.13,0.095-0.254,0.198-0.377,0.302c-0.069,0.058-0.141,0.114-0.208,0.174c-0.1,0.091-0.195,0.189-0.291,0.286  c-0.082,0.082-0.166,0.163-0.243,0.248c-0.073,0.081-0.141,0.167-0.21,0.252c-0.091,0.11-0.183,0.219-0.267,0.334  c-0.054,0.074-0.104,0.153-0.156,0.229c-0.089,0.132-0.178,0.263-0.259,0.4c-0.014,0.023-0.03,0.044-0.044,0.068L35.807,413.084z   M304.649,322.521H162.031l71.309-123.51L304.649,322.521z M424.861,420.584H48.797l156.235-270.606l19.648,34.032L114.239,375.3  c-0.658,1.141-1.005,2.437-1.005,3.753c0,4.143,3.357,7.5,7.5,7.5h49.636c4.143,0,7.5-3.357,7.5-7.5s-3.357-7.5-7.5-7.5h-36.647  l19.649-34.032h164.26c0.005,0,0.01,0.001,0.015,0.001s0.01-0.001,0.015-0.001h52.265l19.648,34.032H200.37  c-4.143,0-7.5,3.357-7.5,7.5s3.357,7.5,7.5,7.5h202.187c0.005,0,0.01,0.001,0.015,0.001s0.01-0.001,0.015-0.001h41.922  L424.861,420.584z M406.896,371.553L218.022,44.413h39.278l187.264,327.14H406.896z"  
                      />
                    </svg>
                  </div>

                  {/* Animated Text - Larger for title */}
                  <div className="logo-text-wrapper main-title">
                    <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight text-black tracking-tight whitespace-nowrap text-center">
                      attendee
                    </h1>
                    {/* Decorative underline - Responsive */}
                    <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 lg:w-40 h-px bg-black"></div>
                  </div>
                </div>
              </div>
              
              <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-500 font-light leading-relaxed mb-4 sm:mb-6 px-2">
                  Next-generation RFID attendance tracking
                </p>
                <p className="text-base sm:text-lg text-gray-400 leading-relaxed px-2">
                  Real-time monitoring • Offline capabilities • Modern ESP8266 integration
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
                <Link
                  to="/login"
                  className="group relative w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-black text-white text-sm font-medium tracking-wider uppercase overflow-hidden transition-all duration-300 hover:px-10 sm:hover:px-16"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
                <a
                  href="#features"
                  className="group w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 border border-gray-300 text-black text-sm font-medium tracking-wider uppercase hover:border-gray-400 transition-all duration-300 relative overflow-hidden"
                >
                  <span className="relative z-10">Explore</span>
                  <div className="absolute inset-0 bg-gray-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Architecture */}
      <div className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
        {/* Enhanced background geometric pattern - Mobile optimized */}
        <div className="absolute inset-0 opacity-10 sm:opacity-20">
          {/* Large background shapes - Hidden on mobile */}
          <div className="hidden sm:block absolute top-20 left-10 w-32 sm:w-40 lg:w-48 h-32 sm:h-40 lg:h-48 border border-gray-200 transform rotate-12 animate-pulse"></div>
          <div className="hidden md:block absolute top-40 right-20 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 transform rotate-45"></div>
          <div className="hidden sm:block absolute bottom-20 left-1/4 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 border-2 border-gray-300 rounded-full"></div>
          <div className="hidden md:block absolute bottom-40 right-1/3 w-24 sm:w-30 lg:w-36 h-24 sm:h-30 lg:h-36 border-2 border-gray-200 transform rotate-45"></div>
          <div className="hidden sm:block absolute top-1/2 left-10 w-12 sm:w-16 h-12 sm:h-16 bg-gray-100 transform rotate-12"></div>
          <div className="hidden md:block absolute top-1/3 right-10 w-16 sm:w-20 h-16 sm:h-20 border border-gray-300 rounded-full"></div>
          
          {/* Floating geometric elements - Smaller on mobile */}
          <div className="absolute top-32 left-1/3 w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 bg-black transform rotate-45 animate-bounce"></div>
          <div className="absolute top-1/4 right-1/4 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 border border-gray-400 transform rotate-45 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="hidden sm:block absolute bottom-1/3 right-1/2 w-6 lg:w-8 h-6 lg:h-8 border border-gray-300 transform rotate-12"></div>
          
          {/* Small decorative dots - Minimal on mobile */}
          <div className="absolute top-24 left-1/2 w-1 sm:w-2 h-1 sm:h-2 bg-gray-300 rounded-full"></div>
          <div className="hidden sm:block absolute top-40 left-2/3 w-1 h-1 bg-black rounded-full"></div>
          <div className="absolute bottom-32 left-1/3 w-1 sm:w-2 h-1 sm:h-2 bg-gray-400 transform rotate-45"></div>
          <div className="hidden sm:block absolute bottom-48 right-1/4 w-1 h-1 bg-gray-500 rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20 lg:mb-24">
            <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-black transform rotate-45"></div>
                <div className="w-6 sm:w-8 lg:w-12 h-px bg-gray-300"></div>
                <div className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 border border-black transform rotate-45 flex items-center justify-center">
                  <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full"></div>
                </div>
                <div className="w-6 sm:w-8 lg:w-12 h-px bg-gray-300"></div>
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-black transform rotate-45"></div>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-black tracking-tight mb-4 sm:mb-6 lg:mb-8">
              System Architecture
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 tracking-widest uppercase mb-6 sm:mb-8 lg:mb-12 px-4">
              Four integrated components • Seamless harmony • Geometric precision
            </p>
            
            {/* Architectural diagram decorative element - Mobile responsive */}
            <div className="flex justify-center">
              <div className="relative w-48 sm:w-56 lg:w-64 h-12 sm:h-14 lg:h-16">
                <div className="absolute inset-0 flex items-center justify-between">
                  <div className="w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 border-2 border-gray-300 transform rotate-45"></div>
                  <div className="w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 bg-black transform rotate-45"></div>
                  <div className="w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 border border-gray-400 rounded-full"></div>
                </div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
            </div>
          </div>
          
          {/* Enhanced connection lines and geometric flows - Hidden on mobile/tablet */}
          <div className="hidden xl:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl">
            <svg className="w-full h-48" viewBox="0 0 900 192">
              {/* Main connection lines */}
              <line x1="100" y1="96" x2="800" y2="96" stroke="#e5e7eb" strokeWidth="2" strokeDasharray="8,4"/>
              <line x1="100" y1="96" x2="300" y2="48" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,2"/>
              <line x1="300" y1="48" x2="500" y2="96" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,2"/>
              <line x1="500" y1="96" x2="700" y2="144" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,2"/>
              <line x1="700" y1="144" x2="800" y2="96" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,2"/>
              
              {/* Geometric nodes */}
              <circle cx="100" cy="96" r="4" fill="#000"/>
              <circle cx="300" cy="48" r="3" fill="#666"/>
              <circle cx="500" cy="96" r="4" fill="#000"/>
              <circle cx="700" cy="144" r="3" fill="#666"/>
              <circle cx="800" cy="96" r="4" fill="#000"/>
              
              {/* Decorative geometric elements */}
              <rect x="96" y="92" width="8" height="8" fill="none" stroke="#ccc" strokeWidth="1" transform="rotate(45 100 96)"/>
              <rect x="496" y="92" width="8" height="8" fill="none" stroke="#ccc" strokeWidth="1" transform="rotate(45 500 96)"/>
              <rect x="796" y="92" width="8" height="8" fill="none" stroke="#ccc" strokeWidth="1" transform="rotate(45 800 96)"/>
            </svg>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16">
            {/* Hardware Terminal */}
            <div className="group relative text-center">
              {/* Enhanced geometric icon container - Mobile responsive */}
              <div className="relative w-24 sm:w-28 lg:w-32 h-24 sm:h-28 lg:h-32 mx-auto mb-6 sm:mb-8">
                {/* Outer geometric frame */}
                <div className="absolute inset-0 border-2 border-gray-200 transform group-hover:rotate-45 transition-all duration-700"></div>
                <div className="absolute inset-1 sm:inset-2 border border-gray-300 transform group-hover:-rotate-45 transition-all duration-500"></div>
                
                {/* Main icon design - RFID Terminal inspired */}
                <div className="absolute inset-2 sm:inset-4 bg-black flex items-center justify-center transform group-hover:scale-110 transition-all duration-500">
                  <div className="relative w-full h-full">
                    {/* RFID reader base */}
                    <div className="absolute inset-1 sm:inset-2 bg-white border border-gray-300"></div>
                    
                    {/* RFID antenna coil pattern */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 border-2 border-black rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 border border-black rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 border border-black rounded-full"></div>
                    </div>
                    
                    {/* Terminal connection points */}
                    <div className="absolute top-0.5 sm:top-1 left-1/4 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-black"></div>
                    <div className="absolute top-0.5 sm:top-1 right-1/4 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-black"></div>
                    <div className="absolute bottom-0.5 sm:bottom-1 left-1/3 w-1 sm:w-2 h-0.5 sm:h-1 bg-black"></div>
                    <div className="absolute bottom-0.5 sm:bottom-1 right-1/3 w-1 sm:w-2 h-0.5 sm:h-1 bg-black"></div>
                    
                    {/* LCD display indicator */}
                    <div className="absolute top-0.5 sm:top-1 left-1/2 transform -translate-x-1/2 w-2 sm:w-3 lg:w-4 h-0.5 sm:h-1 bg-gray-400"></div>
                  </div>
                </div>
                
                {/* Floating decorative elements - Mobile responsive */}
                <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-2 sm:w-3 h-2 sm:h-3 border border-gray-400 transform rotate-45 group-hover:rotate-90 transition-transform duration-300"></div>
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-300 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 transform rotate-45 group-hover:rotate-90 transition-transform duration-300"></div>
                <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-2 sm:w-3 h-2 sm:h-3 border border-gray-300 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-light text-black mb-2 sm:mb-3">Hardware Terminal</h3>
              <p className="text-xs text-gray-400 tracking-wider uppercase mb-4 sm:mb-6 px-2">Physical Interface • RFID Gateway</p>
              <div className="space-y-1 sm:space-y-2 text-sm text-gray-600 px-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 transform rotate-45"></div>
                  <span>MFRC522 RFID Reader</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 transform rotate-45"></div>
                  <span>16x2 LCD Display</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 transform rotate-45"></div>
                  <span>LED Indicators</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 transform rotate-45"></div>
                  <span>DS3231 RTC Module</span>
                </div>
              </div>
            </div>
            
            {/* Firmware */}
            <div className="group relative text-center">
              <div className="relative w-24 sm:w-28 lg:w-32 h-24 sm:h-28 lg:h-32 mx-auto mb-6 sm:mb-8">
                {/* Outer geometric frame */}
                <div className="absolute inset-0 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-all duration-700"></div>
                <div className="absolute inset-2 sm:inset-3 border border-gray-300 transform group-hover:rotate-180 transition-all duration-1000"></div>
                
                {/* Main icon design - ESP8266 WiFi Microcontroller inspired */}
                <div className="absolute inset-4 sm:inset-6 bg-black flex items-center justify-center transform group-hover:rotate-45 transition-all duration-500">
                  <div className="relative w-full h-full bg-white">
                    {/* ESP8266 chip body */}
                    <div className="absolute inset-0.5 sm:inset-1 border-2 border-black bg-gray-50"></div>
                    
                    {/* Central processing unit */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 bg-black flex items-center justify-center">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white"></div>
                    </div>
                    
                    {/* WiFi antenna pattern */}
                    <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-1.5 sm:w-2 h-0.5 sm:h-1 border-l border-t border-black"></div>
                    <div className="absolute top-0.5 sm:top-1 right-1 sm:right-2 w-0.5 sm:w-1 h-px bg-black"></div>
                    <div className="absolute top-1 sm:top-2 right-0.5 sm:right-1 w-px h-0.5 sm:h-1 bg-black"></div>
                    
                    {/* GPIO pins representation - Responsive */}
                    <div className="absolute top-0 left-1/4 w-px h-0.5 sm:h-1 bg-black"></div>
                    <div className="absolute top-0 left-2/4 w-px h-0.5 sm:h-1 bg-black"></div>
                    <div className="absolute top-0 right-1/4 w-px h-0.5 sm:h-1 bg-black"></div>
                    <div className="absolute bottom-0 left-1/4 w-px h-0.5 sm:h-1 bg-black"></div>
                    <div className="absolute bottom-0 left-2/4 w-px h-0.5 sm:h-1 bg-black"></div>
                    <div className="absolute bottom-0 right-1/4 w-px h-0.5 sm:h-1 bg-black"></div>
                    <div className="absolute left-0 top-1/4 h-px w-0.5 sm:w-1 bg-black"></div>
                    <div className="absolute left-0 top-2/4 h-px w-0.5 sm:w-1 bg-black"></div>
                    <div className="absolute left-0 bottom-1/4 h-px w-0.5 sm:w-1 bg-black"></div>
                    <div className="absolute right-0 top-1/4 h-px w-0.5 sm:w-1 bg-black"></div>
                    <div className="absolute right-0 top-2/4 h-px w-0.5 sm:w-1 bg-black"></div>
                    <div className="absolute right-0 bottom-1/4 h-px w-0.5 sm:w-1 bg-black"></div>
                  </div>
                </div>
                
                {/* Floating decorative elements - Mobile responsive */}
                <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 w-3 sm:w-4 h-3 sm:h-4 border border-gray-400 rounded-full group-hover:rotate-180 transition-transform duration-500"></div>
                <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 transform rotate-45 group-hover:rotate-90 transition-transform duration-400"></div>
                <div className="absolute top-1/2 -left-2 sm:-left-3 transform -translate-y-1/2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute top-1/2 -right-2 sm:-right-3 transform -translate-y-1/2 w-2 sm:w-3 h-2 sm:h-3 border border-gray-300 transform rotate-45 group-hover:rotate-135 transition-transform duration-400"></div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-light text-black mb-2 sm:mb-3">Firmware</h3>
              <p className="text-xs text-gray-400 tracking-wider uppercase mb-4 sm:mb-6 px-2">ESP8266 Brain • Intelligence Layer</p>
              <div className="space-y-1 sm:space-y-2 text-sm text-gray-600 px-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>WiFi Connectivity</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>RFID Processing</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Offline Storage</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>OTA Updates</span>
                </div>
              </div>
            </div>
            
            {/* Backend */}
            <div className="group relative text-center">
              <div className="relative w-24 sm:w-28 lg:w-32 h-24 sm:h-28 lg:h-32 mx-auto mb-6 sm:mb-8">
                {/* Outer geometric frame */}
                <div className="absolute inset-0 border-2 border-gray-200 transform group-hover:rotate-45 transition-all duration-700"></div>
                <div className="absolute inset-1 sm:inset-2 bg-gradient-to-br from-gray-100 to-gray-200 transform group-hover:-rotate-45 transition-all duration-500"></div>
                
                {/* Main icon design - Server/Database inspired */}
                <div className="absolute inset-2 sm:inset-4 bg-white border-2 border-black flex flex-col items-center justify-center transform group-hover:scale-105 transition-all duration-500">
                  {/* Server stack representation */}
                  <div className="w-full h-1.5 sm:h-2 bg-black mb-0.5 sm:mb-1"></div>
                  <div className="w-3/4 h-0.5 sm:h-1 bg-gray-400 mb-0.5 sm:mb-1"></div>
                  <div className="w-full h-1.5 sm:h-2 bg-black mb-0.5 sm:mb-1"></div>
                  <div className="w-1/2 h-0.5 sm:h-1 bg-gray-400 mb-0.5 sm:mb-1"></div>
                  <div className="w-full h-1.5 sm:h-2 bg-black"></div>
                  
                  {/* API endpoint dots */}
                  <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-white rounded-full"></div>
                  <div className="absolute top-0.5 sm:top-1 right-1.5 sm:right-3 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-white rounded-full"></div>
                </div>
                
                {/* Floating decorative elements - Mobile responsive */}
                <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-3 sm:w-4 h-3 sm:h-4 border border-gray-400 transform rotate-45 group-hover:rotate-90 transition-transform duration-400"></div>
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 transform rotate-45 group-hover:rotate-180 transition-transform duration-500"></div>
                <div className="absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-3 sm:w-4 h-3 sm:h-4 border border-gray-300 transform rotate-45 group-hover:rotate-135 transition-transform duration-400"></div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-light text-black mb-2 sm:mb-3">Backend</h3>
              <p className="text-xs text-gray-400 tracking-wider uppercase mb-4 sm:mb-6 px-2">Node.js API • Data Engine</p>
              <div className="space-y-1 sm:space-y-2 text-sm text-gray-600 px-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 transform rotate-45"></div>
                  <span>REST API</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 transform rotate-45"></div>
                  <span>MongoDB Database</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 transform rotate-45"></div>
                  <span>JWT Authentication</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 transform rotate-45"></div>
                  <span>WebSocket Real-time</span>
                </div>
              </div>
            </div>
            
            {/* Frontend */}
            <div className="group relative text-center">
              <div className="relative w-24 sm:w-28 lg:w-32 h-24 sm:h-28 lg:h-32 mx-auto mb-6 sm:mb-8">
                {/* Outer geometric frame */}
                <div className="absolute inset-0 border-2 border-gray-200 transform group-hover:scale-110 transition-all duration-700"></div>
                <div className="absolute inset-0.5 sm:inset-1 border border-gray-300 rounded transform group-hover:rotate-180 transition-all duration-1000"></div>
                
                {/* Main icon design - Interface/Browser inspired */}
                <div className="absolute inset-2 sm:inset-3 bg-black flex items-center justify-center transform group-hover:-rotate-12 transition-all duration-500">
                  <div className="relative w-full h-full bg-white border border-gray-300">
                    {/* Browser window representation */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 sm:h-2 bg-gray-200 flex items-center px-0.5 sm:px-1">
                      <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-gray-400 rounded-full mr-0.5 sm:mr-1"></div>
                      <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-gray-400 rounded-full mr-0.5 sm:mr-1"></div>
                      <div className="w-0.5 sm:w-1 h-0.5 sm:h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    
                    {/* Interface elements */}
                    <div className="absolute top-2 sm:top-3 left-0.5 sm:left-1 right-0.5 sm:right-1 bottom-0.5 sm:bottom-1">
                      <div className="w-full h-0.5 sm:h-1 bg-black mb-0.5 sm:mb-1"></div>
                      <div className="w-2/3 h-px bg-gray-400 mb-0.5 sm:mb-1"></div>
                      <div className="w-1/2 h-px bg-gray-400 mb-0.5 sm:mb-1"></div>
                      <div className="w-3/4 h-px bg-gray-400 mb-0.5 sm:mb-1"></div>
                      <div className="absolute bottom-0.5 sm:bottom-1 right-0.5 sm:right-1 w-1.5 sm:w-2 h-0.5 sm:h-1 bg-black"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating decorative elements - Mobile responsive */}
                <div className="absolute -top-2 sm:-top-3 -left-0.5 sm:-left-1 w-4 sm:w-5 h-4 sm:h-5 border border-gray-400 rounded transform rotate-45 group-hover:rotate-90 transition-transform duration-400"></div>
                <div className="absolute -top-0.5 sm:-top-1 -right-2 sm:-right-3 w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 transform rotate-45 group-hover:rotate-135 transition-transform duration-500"></div>
                <div className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute -bottom-0.5 sm:-bottom-1 -right-2 sm:-right-3 w-3 sm:w-4 h-3 sm:h-4 border border-gray-300 rounded-full group-hover:scale-125 transition-transform duration-400"></div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-light text-black mb-2 sm:mb-3">Frontend</h3>
              <p className="text-xs text-gray-400 tracking-wider uppercase mb-4 sm:mb-6 px-2">React Interface • User Experience</p>
              <div className="space-y-1 sm:space-y-2 text-sm text-gray-600 px-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Real-time Dashboard</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>User Management</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Data Visualization</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Mobile Responsive</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional decorative geometric flow at bottom - Mobile responsive */}
          <div className="flex justify-center mt-12 sm:mt-16">
            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
              <div className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 border-2 border-gray-300 transform rotate-45"></div>
              <div className="w-16 sm:w-20 lg:w-24 h-px bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200"></div>
              <div className="w-3 sm:w-4 h-3 sm:h-4 bg-black rounded-full"></div>
              <div className="w-16 sm:w-20 lg:w-24 h-px bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200"></div>
              <div className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 border-2 border-gray-300 transform rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative py-16 sm:py-20 lg:py-24">
        {/* Floating geometric elements - Mobile optimized */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-5 w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 border border-gray-300 transform rotate-45 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-gray-100 rounded-full animate-bounce"></div>
          <div className="hidden sm:block absolute bottom-32 left-1/3 w-6 lg:w-8 h-6 lg:h-8 border-2 border-gray-200 transform rotate-12"></div>
          <div className="absolute bottom-20 right-1/4 w-2 sm:w-3 h-2 sm:h-3 bg-black transform rotate-45"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-6 sm:w-8 h-px bg-gray-300"></div>
                <div className="w-2 sm:w-3 h-2 sm:h-3 border border-black rounded-full"></div>
                <div className="w-6 sm:w-8 h-px bg-gray-300"></div>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extralight text-black tracking-tight mb-4 sm:mb-6">
              Key Features
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 tracking-widest uppercase px-4">
              Everything you need • Modern attendance tracking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            <div className="group relative">
              {/* Feature number - Mobile responsive */}
              <div className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-400 transform group-hover:rotate-45 transition-transform duration-500">
                01
              </div>
              <div className="border-l-2 border-gray-100 pl-6 sm:pl-8 group-hover:border-black transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-light text-black mb-3 sm:mb-4">Real-time Monitoring</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  Track attendance in real-time with instant updates across all connected devices. 
                  WebSocket integration ensures immediate data synchronization.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Live Dashboard</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Instant Updates</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">WebSocket</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-400 transform group-hover:rotate-45 transition-transform duration-500">
                02
              </div>
              <div className="border-l-2 border-gray-100 pl-6 sm:pl-8 group-hover:border-black transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-light text-black mb-3 sm:mb-4">Offline Capabilities</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  Hardware terminals continue working even without internet connection. 
                  Data is stored locally and synchronized when connectivity is restored.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Local Storage</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Auto Sync</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Reliability</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-400 transform group-hover:rotate-45 transition-transform duration-500">
                03
              </div>
              <div className="border-l-2 border-gray-100 pl-6 sm:pl-8 group-hover:border-black transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-light text-black mb-3 sm:mb-4">RFID Integration</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  13.56MHz RFID technology with MFRC522 reader for fast, reliable card scanning. 
                  Supports multiple card types and formats.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Fast Scanning</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Multiple Formats</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Reliable</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-400 transform group-hover:rotate-45 transition-transform duration-500">
                04
              </div>
              <div className="border-l-2 border-gray-100 pl-6 sm:pl-8 group-hover:border-black transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-light text-black mb-3 sm:mb-4">User Management</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  Comprehensive user management with role-based access control. 
                  Admin, mentor, and member roles with different permission levels.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Role-based Access</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Permissions</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Security</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-400 transform group-hover:rotate-45 transition-transform duration-500">
                05
              </div>
              <div className="border-l-2 border-gray-100 pl-6 sm:pl-8 group-hover:border-black transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-light text-black mb-3 sm:mb-4">Data Analytics</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  Detailed attendance reports, statistics, and data export capabilities. 
                  Track patterns and generate insights from attendance data.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Reports</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Statistics</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Export</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-400 transform group-hover:rotate-45 transition-transform duration-500">
                06
              </div>
              <div className="border-l-2 border-gray-100 pl-6 sm:pl-8 group-hover:border-black transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-light text-black mb-3 sm:mb-4">Modern Technology</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  Built with modern web technologies including React frontend, 
                  Node.js backend, and ESP8266 firmware with OTA update support.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">React</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">Node.js</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">ESP8266</span>
                  <span className="px-2 sm:px-3 py-1 text-xs text-gray-500 bg-gray-50 tracking-wider uppercase">OTA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-light text-black tracking-tight mb-3 sm:mb-4">
              Technical Specifications
            </h2>
            <p className="text-xs text-gray-400 tracking-wider uppercase">
              Hardware and software requirements
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h3 className="text-lg font-medium text-black mb-4 sm:mb-6">Hardware Components</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 mb-1 sm:mb-0">Microcontroller</span>
                  <span className="text-sm font-medium text-black">ESP8266 NodeMCU</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 mb-1 sm:mb-0">RFID Reader</span>
                  <span className="text-sm font-medium text-black">MFRC522 (13.56MHz)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 mb-1 sm:mb-0">Display</span>
                  <span className="text-sm font-medium text-black">16x2 I2C LCD</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 mb-1 sm:mb-0">Real-time Clock</span>
                  <span className="text-sm font-medium text-black">DS3231 RTC Module</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 mb-1 sm:mb-0">Indicators</span>
                  <span className="text-sm font-medium text-black">LED + Buzzer</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-black mb-4 sm:mb-6">Software Stack</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 mb-1 sm:mb-0">Frontend</span>
                  <span className="text-sm font-medium text-black">React + Tailwind CSS</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 mb-1 sm:mb-0">Backend</span>
                  <span className="text-sm font-medium text-black">Node.js + Express</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 mb-1 sm:mb-0">Database</span>
                  <span className="text-sm font-medium text-black">MongoDB</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 mb-1 sm:mb-0">Firmware</span>
                  <span className="text-sm font-medium text-black">C++ (Arduino IDE)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-200">
                  <span className="text-sm text-gray-600 mb-1 sm:mb-0">Communication</span>
                  <span className="text-sm font-medium text-black">WiFi + HTTP + WebSocket</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        {/* Background pattern - Mobile optimized */}
        <div className="absolute inset-0 opacity-10 sm:opacity-20">
          <div className="hidden sm:block absolute top-20 left-20 w-32 lg:w-40 h-32 lg:h-40 border border-gray-200 transform rotate-45"></div>
          <div className="hidden sm:block absolute bottom-20 right-20 w-24 lg:w-32 h-24 lg:h-32 border-2 border-gray-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 sm:w-6 h-4 sm:h-6 bg-black rotate-45"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Decorative element - Mobile responsive */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <div className="w-8 sm:w-12 lg:w-16 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
              <div className="w-3 sm:w-4 h-3 sm:h-4 border border-black transform rotate-45"></div>
              <div className="w-8 sm:w-12 lg:w-16 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-black tracking-tight mb-6 sm:mb-8">
            Ready to get started?
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 font-light max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
            Access the system to manage users, monitor attendance, and view detailed reports. 
            Administrator credentials required for initial setup and configuration.
          </p>
          
          <div className="relative inline-block">
            {/* Geometric decoration around button - Mobile responsive */}
            <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 w-2 sm:w-3 h-2 sm:h-3 border border-gray-300 transform rotate-45"></div>
            <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-300 rounded-full"></div>
            <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-400"></div>
            <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 w-2 sm:w-3 h-2 sm:h-3 border border-gray-400 transform rotate-45"></div>
            
            <Link
              to="/login"
              className="group relative inline-block w-full sm:w-auto px-12 sm:px-16 py-4 sm:py-5 bg-black text-white text-sm font-medium tracking-widest uppercase overflow-hidden transition-all duration-500 hover:px-16 sm:hover:px-20"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              {/* Button decorative elements - Hidden on mobile */}
              <div className="hidden sm:block absolute top-1/2 right-4 transform -translate-y-1/2 w-2 h-2 border border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-400 mt-6 sm:mt-8 tracking-wider uppercase px-4">
            Secure login • Role-based access • Admin setup required
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative border-t border-gray-100 py-12 sm:py-16">
        {/* Subtle background elements - Mobile optimized */}
        <div className="absolute inset-0 opacity-5 sm:opacity-10">
          <div className="absolute top-8 left-1/4 w-6 sm:w-8 h-6 sm:h-8 border border-gray-300 transform rotate-45"></div>
          <div className="absolute bottom-8 right-1/4 w-4 sm:w-6 h-4 sm:h-6 bg-gray-200 rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo section - Mobile responsive - No animations */}
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-2xl sm:text-3xl font-light text-black tracking-tight mb-3">
                attendee
              </h3>
              <div className="flex justify-center">
                <svg 
                  viewBox="0 0 466 422" 
                  className="w-6 sm:w-7 h-6 sm:h-7"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fill="black"
                    d="M464.944,378.17c-0.009-0.073-0.022-0.144-0.033-0.216c-0.034-0.233-0.079-0.462-0.134-0.688  c-0.018-0.072-0.035-0.143-0.055-0.215c-0.073-0.265-0.159-0.525-0.26-0.777c-0.009-0.023-0.016-0.047-0.025-0.069  c-0.118-0.287-0.255-0.565-0.406-0.833c-0.008-0.014-0.013-0.03-0.021-0.044L268.158,33.188c-0.034-0.059-0.073-0.111-0.108-0.169  c-0.081-0.134-0.163-0.267-0.253-0.395c-0.066-0.094-0.136-0.184-0.205-0.275c-0.076-0.099-0.152-0.198-0.232-0.292  c-0.087-0.103-0.178-0.2-0.27-0.297c-0.073-0.077-0.145-0.153-0.22-0.226c-0.101-0.098-0.206-0.191-0.311-0.283  c-0.078-0.067-0.155-0.134-0.235-0.198c-0.105-0.084-0.213-0.163-0.322-0.241c-0.092-0.066-0.185-0.13-0.28-0.192  c-0.1-0.065-0.202-0.125-0.305-0.185c-0.112-0.065-0.225-0.129-0.341-0.188c-0.091-0.047-0.184-0.09-0.276-0.133  c-0.131-0.061-0.262-0.119-0.397-0.172c-0.086-0.034-0.174-0.065-0.261-0.095c-0.141-0.05-0.283-0.097-0.428-0.138  c-0.091-0.026-0.183-0.048-0.275-0.071c-0.14-0.034-0.28-0.067-0.423-0.094c-0.11-0.021-0.221-0.035-0.332-0.051  c-0.125-0.017-0.25-0.035-0.378-0.046c-0.14-0.012-0.28-0.017-0.42-0.021c-0.079-0.002-0.156-0.012-0.236-0.012h-56.616  c-0.035,0-0.069,0.006-0.104,0.007c-0.258,0.004-0.514,0.021-0.77,0.051c-0.066,0.008-0.131,0.014-0.196,0.023  c-0.593,0.086-1.172,0.242-1.728,0.466c-0.064,0.026-0.127,0.054-0.19,0.082c-0.227,0.098-0.448,0.208-0.664,0.328  c-0.047,0.026-0.095,0.05-0.141,0.077c-0.516,0.302-0.998,0.669-1.435,1.096c-0.049,0.048-0.096,0.098-0.144,0.147  c-0.164,0.169-0.319,0.346-0.468,0.532c-0.049,0.061-0.1,0.121-0.147,0.184c-0.177,0.236-0.345,0.481-0.497,0.742  c-0.003,0.005-0.007,0.01-0.01,0.015c-0.001,0.002-0.001,0.003-0.002,0.005L1.005,375.3c-1.34,2.32-1.34,5.179,0,7.5l28.306,49.034  c0.009,0.016,0.021,0.03,0.031,0.046c0.158,0.269,0.33,0.531,0.522,0.781c0.001,0.001,0.001,0.001,0.002,0.002  c0.182,0.236,0.382,0.459,0.594,0.674c0.044,0.045,0.089,0.088,0.134,0.131c0.178,0.172,0.366,0.336,0.563,0.492  c0.047,0.038,0.093,0.077,0.141,0.113c0.241,0.181,0.49,0.353,0.758,0.508c0.265,0.153,0.536,0.281,0.81,0.398  c0.021,0.009,0.041,0.021,0.062,0.03c0.931,0.388,1.906,0.577,2.872,0.577c0.015,0,0.03-0.003,0.045-0.003h393.347  c2.68,0,5.155-1.43,6.495-3.75l28.309-49.031c0.01-0.018,0.017-0.038,0.028-0.056c0.151-0.267,0.289-0.541,0.407-0.827  c0.005-0.013,0.009-0.027,0.015-0.04c0.106-0.26,0.194-0.528,0.271-0.802c0.021-0.073,0.038-0.146,0.057-0.22  c0.055-0.221,0.099-0.445,0.133-0.673c0.012-0.078,0.026-0.155,0.036-0.233c0.033-0.279,0.054-0.561,0.056-0.848  c0-0.014,0.002-0.028,0.002-0.042c0-0.003,0-0.006,0-0.009C465,378.753,464.978,378.46,464.944,378.17z M35.807,413.084  L16.16,379.05L205.032,51.913l156.234,270.607H321.97L211.527,131.229c-0.014-0.024-0.03-0.045-0.044-0.068  c-0.081-0.137-0.169-0.269-0.259-0.401c-0.052-0.076-0.101-0.155-0.156-0.228c-0.085-0.116-0.178-0.226-0.27-0.338  c-0.069-0.083-0.135-0.168-0.207-0.247c-0.079-0.088-0.166-0.17-0.25-0.255c-0.094-0.094-0.186-0.19-0.284-0.278  c-0.071-0.064-0.146-0.123-0.22-0.184c-0.12-0.1-0.239-0.2-0.364-0.292c-0.068-0.05-0.14-0.095-0.21-0.143  c-0.136-0.093-0.273-0.185-0.415-0.268c-0.023-0.014-0.043-0.03-0.067-0.043c-0.06-0.035-0.122-0.061-0.183-0.094  c-0.132-0.071-0.263-0.141-0.399-0.204c-0.107-0.05-0.214-0.094-0.322-0.138c-0.113-0.046-0.225-0.092-0.34-0.133  c-0.128-0.046-0.258-0.085-0.387-0.124c-0.099-0.029-0.197-0.058-0.296-0.083c-0.141-0.035-0.282-0.065-0.423-0.092  c-0.095-0.018-0.191-0.036-0.287-0.05c-0.14-0.021-0.28-0.037-0.421-0.05c-0.104-0.01-0.208-0.018-0.313-0.023  c-0.13-0.007-0.26-0.009-0.389-0.009c-0.118,0-0.236,0.002-0.354,0.008c-0.117,0.006-0.232,0.015-0.348,0.026  c-0.129,0.012-0.258,0.027-0.386,0.046c-0.108,0.016-0.214,0.035-0.321,0.056c-0.131,0.025-0.262,0.053-0.392,0.085  c-0.109,0.027-0.217,0.059-0.325,0.091c-0.121,0.036-0.241,0.073-0.36,0.115c-0.124,0.044-0.245,0.093-0.366,0.143  c-0.1,0.041-0.199,0.082-0.298,0.128c-0.143,0.066-0.283,0.14-0.422,0.216c-0.055,0.03-0.112,0.054-0.166,0.085  c-0.021,0.012-0.04,0.027-0.061,0.039c-0.148,0.087-0.292,0.183-0.435,0.281c-0.064,0.044-0.13,0.086-0.193,0.132  c-0.13,0.095-0.254,0.198-0.377,0.302c-0.069,0.058-0.141,0.114-0.208,0.174c-0.1,0.091-0.195,0.189-0.291,0.286  c-0.082,0.082-0.166,0.163-0.243,0.248c-0.073,0.081-0.141,0.167-0.21,0.252c-0.091,0.11-0.183,0.219-0.267,0.334  c-0.054,0.074-0.104,0.153-0.156,0.229c-0.089,0.132-0.178,0.263-0.259,0.4c-0.014,0.023-0.03,0.044-0.044,0.068L35.807,413.084z   M304.649,322.521H162.031l71.309-123.51L304.649,322.521z M424.861,420.584H48.797l156.235-270.606l19.648,34.032L114.239,375.3  c-0.658,1.141-1.005,2.437-1.005,3.753c0,4.143,3.357,7.5,7.5,7.5h49.636c4.143,0,7.5-3.357,7.5-7.5s-3.357-7.5-7.5-7.5h-36.647  l19.649-34.032h164.26c0.005,0,0.01,0.001,0.015,0.001s0.01-0.001,0.015-0.001h52.265l19.648,34.032H200.37  c-4.143,0-7.5,3.357-7.5,7.5s3.357,7.5,7.5,7.5h202.187c0.005,0,0.01,0.001,0.015,0.001s0.01-0.001,0.015-0.001h41.922  L424.861,420.584z M406.896,371.553L218.022,44.413h39.278l187.264,327.14H406.896z"  
                  />
                </svg>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-4 sm:mb-6">
              RFID-based Attendance Tracking System
            </p>
            
            {/* Divider - Mobile responsive */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-16 sm:w-20 lg:w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
            
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed px-4">
              Built with modern web technologies for reliable, real-time attendance management. 
              Combining hardware innovation with software excellence.
            </p>
            
            {/* Tech stack indicators - Mobile responsive */}
            <div className="flex justify-center mt-6 sm:mt-8 space-x-4 sm:space-x-6">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full"></div>
                <span className="text-xs text-gray-500 tracking-wider uppercase">React</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full"></div>
                <span className="text-xs text-gray-500 tracking-wider uppercase">Node.js</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-black rounded-full"></div>
                <span className="text-xs text-gray-500 tracking-wider uppercase">ESP8266</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
