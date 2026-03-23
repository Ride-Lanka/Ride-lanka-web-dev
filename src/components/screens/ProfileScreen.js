"use client";

import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/lib/api";

function getLevelDetails(xp) {
  const x = xp || 0;
  if (x < 300) return { level: 1, currentMin: 0, nextMin: 300, color: "#94a3b8" };
  if (x < 500) return { level: 2, currentMin: 300, nextMin: 500, color: "#22c55e" };
  if (x < 700) return { level: 3, currentMin: 500, nextMin: 700, color: "#3b82f6" };
  if (x < 900) return { level: 4, currentMin: 700, nextMin: 900, color: "#8b5cf6" };
  if (x < 1100) return { level: 5, currentMin: 900, nextMin: 1100, color: "#ec4899" };
  if (x < 1300) return { level: 6, currentMin: 1100, nextMin: 1300, color: "#f97316" };
  if (x < 1500) return { level: 7, currentMin: 1300, nextMin: 1500, color: "#ef4444" };
  if (x < 1700) return { level: 8, currentMin: 1500, nextMin: 1700, color: "#eab308" };
  if (x < 1900) return { level: 9, currentMin: 1700, nextMin: 1900, color: "#06b6d4" };
  return { level: 10, currentMin: 1900, nextMin: 1900, color: "#facc15" };
}

export default function ProfileScreen({ active, showScreen }) {
  const { user, token, logOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";

  async function handleLogout() {
    await logOut();
    showScreen("screen-auth");
  }

  useEffect(() => {
    if (active && token) {
      getUserProfile(token).then(setProfile).catch(console.error);
    }
  }, [active, token]);

  return (
    <div id="screen-profile" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="profile" userName={displayName} userRole="Trip planner for Sri Lanka" onNavigate={showScreen} />
        <div className="main-content">
          <div className="topbar"><h1>Profile</h1></div>
          <div style={{ marginTop: 24 }}>
            <p><strong>Name:</strong> {displayName}</p>
            <p><strong>Email:</strong> {user?.email || "-"}</p>

            {profile && (
              <div style={{ 
                marginTop: 24, 
                padding: "24px", 
                background: "white", 
                borderRadius: 12, 
                boxShadow: "var(--shadow-sm)",
                border: `3px solid ${getLevelDetails(profile.xp).color}`
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h2 style={{ fontSize: "1.4rem", margin: 0, color: getLevelDetails(profile.xp).color, display: "flex", alignItems: "center", gap: "8px" }}>
                    Level {getLevelDetails(profile.xp).level} Traveler
                  </h2>
                  <div style={{ background: "var(--teal-light)", color: "var(--teal-dark)", padding: "6px 16px", borderRadius: 20, fontWeight: "bold", fontSize: "1.1rem" }}>
                    {profile.xp || 0} XP
                  </div>
                </div>

                {getLevelDetails(profile.xp).level < 10 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--gray-600)", marginBottom: 6 }}>
                      <span>Progress to Level {getLevelDetails(profile.xp).level + 1}</span>
                      <span>{profile.xp || 0} / {getLevelDetails(profile.xp).nextMin} XP</span>
                    </div>
                    <div style={{ width: "100%", height: "10px", background: "var(--gray-100)", borderRadius: "10px", overflow: "hidden" }}>
                      <div style={{ 
                        height: "100%", 
                        background: getLevelDetails(profile.xp).color, 
                        width: `${Math.min(100, Math.max(0, ((profile.xp || 0) - getLevelDetails(profile.xp).currentMin) / ((getLevelDetails(profile.xp).nextMin - getLevelDetails(profile.xp).currentMin) || 1) * 100))}%`,
                        transition: "width 0.5s ease"
                      }} />
                    </div>
                  </div>
                )}
                
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--gray-100)" }}>
                  <h3 style={{ fontSize: "1rem", color: "var(--gray-600)", marginBottom: 12 }}>Earned Badges</h3>
                  {(!profile.badges || profile.badges.length === 0) ? (
                    <p style={{ color: "var(--gray-400)", fontSize: "0.95rem" }}>No badges earned yet. Complete quests to collect them!</p>
                  ) : (
                    <div className="honeycomb">
                      {profile.badges.map(b => (
                        <div key={b.id} className="hexagon" title={b.name} style={{ border: `1px solid ${getLevelDetails(profile.xp).color}33` }}>
                          {b.url && <img src={b.url} alt={b.name} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ marginTop: 32, padding: 24, background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border-color)" }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: 8 }}>Traveler Quests</h2>
              <p style={{ color: "var(--text-light)", marginBottom: 16 }}>
                View and complete available quests to earn rewards!
              </p>
              <button className="btn-primary" onClick={() => showScreen("screen-quests")}>
                View Quests
              </button>
            </div>

            <button className="btn-teal" style={{ marginTop: 32 }} onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
