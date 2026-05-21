import { useState, useEffect } from 'react';

function SideNav({ navItems, activeView, setActiveView, getNavButtonStyle }) {
  // Check if we are on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sideNavStyle = isMobile ? {
    // MOBILE: Fixed at bottom
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "row", // Horizontal on mobile
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Glassmorphism
    backdropFilter: "blur(10px)",
    padding: "10px 20px",
    borderRadius: "40px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    gap: "24px",
    zIndex: 100
  } : {
    // DESKTOP: Floating on right (your original design)
    position: "fixed", // Changed to fixed so it stays when scrolling
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
            justifyContent: 'center'
          }}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}

export default SideNav;