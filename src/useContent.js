import { useState, useEffect, useCallback } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { DEFAULTS } from "./defaults";

const DOC = doc(db, "site", "content");
const LS_KEY = "ha-site-content";

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function uid(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2, 9);
}

function fromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function toLS(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {}
}

export function useContent() {
  const [data, setData] = useState(() => fromLS() || clone(DEFAULTS));

  useEffect(() => {
    const unsub = onSnapshot(
      DOC,
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setData(d);
          toLS(d);
        }
      },
      (err) => console.warn("[content] Firestore listener error:", err)
    );
    return unsub;
  }, []);

  const save = useCallback(async (next) => {
    setData(next);
    toLS(next);
    try {
      await setDoc(DOC, next);
    } catch (err) {
      console.warn("[content] Firebase write failed:", err);
    }
  }, []);

  const commit = useCallback(
    (mutate) => {
      const next = clone(data);
      mutate(next);
      save(next);
    },
    [data, save]
  );

  return { data, commit, clone, uid, DEFAULTS };
}
