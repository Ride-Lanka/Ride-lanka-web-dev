"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc,
  serverTimestamp 
} from "firebase/firestore";
import { guideDb as db } from "@/lib/firebase";

const GuideAuthContext = createContext(null);
const SESSION_KEY = "ride_lanka_guide_session_id";
const COLLECTION = "dyourguides";

export function GuideAuthProvider({ children }) {
  const [guide, setGuide] = useState(null);
  const [guideLoading, setGuideLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    async function restoreSession() {
      if (typeof window === "undefined") return;
      const storedId = localStorage.getItem(SESSION_KEY);
      if (storedId) {
        try {
          const snap = await getDoc(doc(db, COLLECTION, storedId));
          if (snap.exists()) {
            setGuide({ id: snap.id, ...snap.data(), uid: snap.id });
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
        } catch (e) {
          console.error("Session restore failed:", e);
        }
      }
      setGuideLoading(false);
    }
    restoreSession();
  }, []);

  async function guideSignIn(email, password) {
    try {
      const q = query(
        collection(db, COLLECTION), 
        where("email", "==", (email || "").trim().toLowerCase()),
        where("password", "==", password)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        throw new Error("Invalid email or password.");
      }
      const docData = snap.docs[0].data();
      const guideData = { id: snap.docs[0].id, ...docData, uid: snap.docs[0].id };
      
      setGuide(guideData);
      localStorage.setItem(SESSION_KEY, snap.docs[0].id);
      return guideData;
    } catch (error) {
      throw new Error(error.message || "Guide sign in failed.");
    }
  }

  async function guideSignUp(email, password) {
    try {
      // Check if already exists
      const q = query(collection(db, COLLECTION), where("email", "==", (email || "").trim().toLowerCase()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        throw new Error("Email already registered.");
      }

      const docRef = await addDoc(collection(db, COLLECTION), {
        email: (email || "").trim().toLowerCase(),
        password: password, // Note: In production, password should be hashed.
        createdAt: serverTimestamp(),
        active: true,
        displayName: (email || "").split("@")[0]
      });

      const guideData = { id: docRef.id, email, uid: docRef.id };
      setGuide(guideData);
      localStorage.setItem(SESSION_KEY, docRef.id);
      return guideData;
    } catch (error) {
      throw new Error(error.message || "Guide sign up failed.");
    }
  }

  async function guideLogOut() {
    setGuide(null);
    localStorage.removeItem(SESSION_KEY);
  }

  return (
    <GuideAuthContext.Provider
      value={{
        guide,
        guideLoading,
        guideSignIn,
        guideSignUp,
        guideLogOut,
      }}
    >
      {children}
    </GuideAuthContext.Provider>
  );
}

export function useGuideAuth() {
  const ctx = useContext(GuideAuthContext);
  if (!ctx) throw new Error("useGuideAuth must be used inside <GuideAuthProvider>");
  return ctx;
}

