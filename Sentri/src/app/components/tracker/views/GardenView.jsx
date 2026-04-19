import React, { useState, useEffect } from "react";
import sproutGif from "../../../../assets/garden/sprout.gif";
import pottedPlantGif from "../../../../assets/garden/potted-plant.gif";
import leavesGif from "../../../../assets/garden/leaves.gif";
import flowersGif from "../../../../assets/garden/flowers.gif";
import treeGif from "../../../../assets/garden/tree.gif";
import watercanGif from "../../../../assets/garden/watercan.gif";

function GardenView({ dashboardData, pillStyle, smallCardStyle, onOpenCheckin }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // Keyboard shortcut listener: Just press "R"
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key.toLowerCase() === "r") {
        setIsAdmin((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleResetDemo = () => {
    if (
      window.confirm(
        "ADMIN: Reset tracker progress? This wipes check-ins and points but KEEPS you logged in."
      )
    ) {
      // List of keywords that indicate a key is related to login/identity
      const authKeywords = ["auth", "user", "session", "token", "sb-", "profile"];

      // Get all keys currently in localStorage
      const allKeys = Object.keys(localStorage);

      allKeys.forEach((key) => {
        // Check if the key contains any of our auth keywords
        const isAuthKey = authKeywords.some((keyword) =>
          key.toLowerCase().includes(keyword)
        );

        // ONLY remove the key if it is NOT related to authentication
        if (!isAuthKey) {
          localStorage.removeItem(key);
        }
      });

      // Also clear specific keys that might not match the filter but need to go
      localStorage.removeItem("checkins");
      localStorage.removeItem("recent_checkins");
      localStorage.removeItem("garden_data");

      // Reload to show the fresh, empty state
      window.location.reload();
    }
  };

  const garden = dashboardData?.garden || {};
  const gardenLabel = garden.label || "Young Sprout";
  const gardenLevel = garden.level ?? 1;
  const xp = garden.xp ?? 0;
  const xpToNextLevel = garden.xp_to_next_level ?? 40;

  const progressPercent =
    xpToNextLevel > 0 ? Math.min((xp / xpToNextLevel) * 100, 100) : 0;

  const getGardenGif = (level) => {
    if (level >= 5) return treeGif;
    if (level === 4) return flowersGif;
    if (level === 3) return leavesGif;
    if (level === 2) return pottedPlantGif;
    return sproutGif;
  };

  const nextUnlockLabel =
    gardenLevel >= 5
      ? "Sanctuary complete"
      : gardenLevel >= 4
      ? "Tree form"
      : gardenLevel >= 3
      ? "Flower bloom"
      : gardenLevel >= 2
      ? "Leaf growth"
      : "Potted plant";

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <div style={pillStyle}>Garden Sanctuary</div>
        
        {/* Secret Admin Button - Toggled by 'R' */}
        {isAdmin && (
          <button
            onClick={handleResetDemo}
            className="rounded-md bg-red-600 px-3 py-1 font-mono text-[10px] font-bold uppercase text-white shadow-lg hover:bg-red-700 transition-all active:scale-95"
          >
            ⚠️ Reset Demo Data
          </button>
        )}
      </div>

      <div
        style={{
          ...smallCardStyle,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "3px solid #93B87E",
          borderRadius: "12px",
          background:
            "linear-gradient(180deg, rgba(243,249,238,0.95) 0%, rgba(232,245,233,0.95) 70%, rgba(221,240,216,0.95) 100%)",
          boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.7), 0 10px 24px rgba(0,90,44,0.12)",
          padding: "16px",
          imageRendering: "pixelated",
          minHeight: 0,
        }}
      >
        <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[10px] border-2 border-dashed border-[#BFD4B4] bg-white/70 p-4">
          <img
            src={getGardenGif(gardenLevel)}
            alt={gardenLabel}
            className="h-[min(62vh,460px)] w-[min(62vh,460px)] object-contain"
            style={{ imageRendering: "pixelated" }}
          />

          <button
            type="button"
            onClick={onOpenCheckin}
            className="absolute bottom-4 right-4 rounded-[10px] border-2 border-[#6E944F] bg-[#F3F9EE] px-3 py-2 shadow-[0_6px_0_#6E944F] transition hover:translate-y-[1px] hover:shadow-[0_4px_0_#6E944F]"
            title="Water your garden"
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#1F3B2B]">
              <img
                src={watercanGif}
                alt="Watering can"
                className="h-10 w-10 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              Water & Check-In
            </div>
          </button>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-[8px] border border-[#DCEAD8] bg-white px-3 py-2 font-mono text-xs text-[#355844]">
            <span className="font-bold">Stage:</span> {gardenLabel}
          </div>

          <div className="rounded-[8px] border border-[#DCEAD8] bg-white px-3 py-2 font-mono text-xs text-[#355844]">
            <span className="font-bold">Progress:</span> {xp}/{xpToNextLevel}
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#E8F5E9]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#76B82A_0%,#005A2C_100%)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="rounded-[8px] border border-[#DCEAD8] bg-white px-3 py-2 font-mono text-xs text-[#355844]">
            <span className="font-bold">Next:</span> {nextUnlockLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GardenView;