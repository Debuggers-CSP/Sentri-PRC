import { useState, useEffect } from 'react';

function SideNav({ navItems, activeView, setActiveView, getNavButtonStyle }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sideNavStyle = isMobile ? {
    // MOBILE: Optimized for iPhone "Safe Area"
    position: "fixed",
    bottom: "0", // Snap to bottom
    left: "0",
    right: "0",
    display: "flex",
    flexDirection: "row", 
    justifyContent: "space-around", // Spread icons evenly
    backgroundColor: "rgba(255, 255, 255, 0.95)", 
    backdropFilter: "blur(12px)",
    padding: "12px 10px 28px 10px", // Extra bottom padding (28px) for iPhone notch/home bar
    borderTop: "1px solid #DCEAD8",
    boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
    zIndex: 1000, // Very high to stay above everything
  } : {
    // DESKTOP: Floating on right
    position: "fixed", 
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    zIndex: 100
  };

  return (
    <div style={sideNavStyle}>
      {navItems.map((item) => (
        <button
          key={item.key}
          title={item.label}
          onClick={() => setActiveView(item.key)}
          style={{
            ...getNavButtonStyle(item.key),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Ensure touch target is at least 44px for iOS standards
            minWidth: isMobile ? "44px" : "auto",
            minHeight: isMobile ? "44px" : "auto",
            transition: "all 0.2s ease"
          }}
        >
          {item.icon}
          {/* Optional: Add tiny labels under icons for mobile */}
          {isMobile && <span style={{fontSize: '10px', marginTop: '4px'}}>{item.label}</span>}
        </button>
      ))}
    </div>
  );
}

export default SideNav;