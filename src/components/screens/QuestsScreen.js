"use client";

import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { useAuth } from "@/context/AuthContext";
import { getQuests, completeQuest, getUserProfile } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";

export default function QuestsScreen({ active, showScreen }) {
  const { user, token } = useAuth();
  const { t } = useSettings();
  const [quests, setQuests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const displayName = user?.displayName || user?.email?.split("@")[0] || "traveler";

  useEffect(() => {
    if (active && token) {
      loadQuests();
    }
  }, [active, token]);

  async function loadQuests() {
    try {
      setLoading(true);
      const [res, prof] = await Promise.all([
        getQuests(token),
        getUserProfile(token)
      ]);
      setQuests(res.quests || []);
      setProfile(prof);
    } catch (err) {
      console.error("Failed to load quests/profile:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteQuest(questId) {
    if (!token) return;
    try {
      setCompletingId(questId);
      const res = await completeQuest(token, questId);
      alert(`Quest completed! You gained ${res.xpGained} XP. Check your profile.`);
      // Re-fetch to update completedQuests array
      await loadQuests();
    } catch (err) {
      alert("Failed to complete quest: " + err.message);
    } finally {
      setCompletingId(null);
    }
  }

  return (
    <div id="screen-quests" className={`screen ${active ? "active" : ""}`}>
      <div className="main-layout">
        <Sidebar activeItem="quests" userName={displayName} userRole={t("appRoleTripPlanner")} onNavigate={showScreen} />
        
        <div className="main-content">
          <div className="topbar">
            <h1>{t("questsTitle")}</h1>
          </div>
          
          <div className="quests-container" style={{ marginTop: 24, padding: "0 16px" }}>
            <p style={{ color: "var(--gray-600)", marginBottom: "24px" }}>{t("questsSubtitle")}</p>

            {loading ? (
              <p>{t("questsLoading")}</p>
            ) : quests.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", background: "var(--white)", borderRadius: "12px", border: "1px solid var(--gray-100)", boxShadow: "var(--shadow-sm)" }}>
                <p>{t("questsEmpty")}</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                {quests.map((q) => (
                  <div key={q.id} style={{ 
                    background: "var(--white)", 
                    padding: "20px", 
                    borderRadius: "12px", 
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid var(--gray-100)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {q.badgeImage && (
                          <img src={q.badgeImage} alt="badge" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
                        )}
                        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--text)" }}>{q.title}</h3>
                      </div>
                      <span style={{ 
                        background: "var(--teal-light)", 
                        color: "var(--teal-dark)", 
                        padding: "4px 12px", 
                        borderRadius: "16px",
                        fontSize: "0.85rem",
                        fontWeight: "600"
                      }}>
                        {q.reward}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: "var(--gray-600)", lineHeight: "1.5" }}>{q.description}</p>
                    <div style={{ marginTop: "12px" }}>
                      {profile?.completedQuests?.includes(q.id) ? (
                        <button className="btn-outline" style={{ fontSize: "0.9rem", padding: "6px 12px", border: "2px solid var(--gray-400)", color: "var(--gray-600)", background: "var(--gray-100)", cursor: "not-allowed" }} disabled>
                          {t("questsCompleted")}
                        </button>
                      ) : (
                        <button 
                          className="btn-outline" 
                          style={{ fontSize: "0.9rem", padding: "6px 12px", border: "2px solid var(--teal)", color: "var(--teal)", background: "transparent", cursor: completingId === q.id ? "not-allowed" : "pointer" }}
                          onClick={() => handleCompleteQuest(q.id)}
                          disabled={completingId === q.id}
                        >
                          {completingId === q.id ? t("questsCompleting") : t("questsCompleteQuest")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
