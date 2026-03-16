function SideNav({ navItems, activeView, setActiveView, getNavButtonStyle }) {
  const sideNavStyle = {
    position: "absolute",
    right: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    zIndex: 2
  };

  return (
    <div style={sideNavStyle}>
      {navItems.map((item) => (
        <button
          key={item.key}
          title={item.label}
          onClick={() => setActiveView(item.key)}
          style={getNavButtonStyle(item.key)}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}

export default SideNav;