"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSettings } from "@/context/SettingsContext";

const INTEREST_OPTIONS = [
  { id: "culture", label: "Culture" },
  { id: "hiking", label: "Hiking" },
  { id: "beach", label: "Beach" },
  { id: "wildlife", label: "Wildlife" },
  { id: "nature", label: "Nature" },
  { id: "food", label: "Food" },
  { id: "adventure", label: "Adventure" },
  { id: "dance", label: "Dance" },
];

export default function SignUpForm({ onSignUp }) {
  const { signUp } = useAuth();
  const { t } = useSettings();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleInterest(id) {
    setInterests((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  async function handleSubmit() {
    if (interests.length === 0) {
      setError(t("signupErrorSelectInterest"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signUp(email, password, name, interests);
      onSignUp();
    } catch (e) {
      setError(e.message || t("signupErrorFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="tab-signup" className="auth-form">
      {step === 1 && (
        <>
          <h3>{t("signupTitle")}</h3>
          <p className="subtitle">{t("signupSubtitle")}</p>
          <div className="form-group">
            <label>{t("signupFullName")}</label>
            <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button
            className="btn-teal"
            onClick={() => {
              if (!name || !email || !password) {
                setError(t("signupErrorFillAll"));
                return;
              }
              if (password.length < 6) {
                setError(t("signupErrorPasswordLen"));
                return;
              }
              setError("");
              setStep(2);
            }}
          >
            {t("signupNext")}
          </button>
          {error && <p style={{ color: "red", marginTop: 8, fontSize: 13 }}>{error}</p>}
        </>
      )}

      {step === 2 && (
        <>
          <h3>{t("signupInterestsTitle")}</h3>
          <p className="subtitle">{t("signupInterestsSubtitle")}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, margin: "16px 0" }}>
            {INTEREST_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleInterest(opt.id)}
                style={{
                  padding: "10px 6px",
                  borderRadius: 10,
                  border: interests.includes(opt.id) ? "2px solid var(--teal)" : "2px solid #e0e0e0",
                  background: interests.includes(opt.id) ? "#e6f7f5" : "#fafafa",
                  cursor: "pointer",
                  fontSize: 12,
                  color: interests.includes(opt.id) ? "var(--teal)" : "#555",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {error && <p style={{ color: "red", marginBottom: 8, fontSize: 13 }}>{error}</p>}

          <button className="btn-teal" onClick={handleSubmit} disabled={loading}>
            {loading ? t("signupCreating") : t("signupCreateAccount")}
          </button>
          <button
            type="button"
            style={{ marginTop: 10, fontSize: 13, color: "#888", cursor: "pointer", background: "none", border: "none" }}
            onClick={() => setStep(1)}
          >
            {t("signupBack")}
          </button>
        </>
      )}
    </div>
  );
}
