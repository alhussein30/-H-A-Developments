import { useState, useEffect, useRef } from "react";

const DB_NAME = "ha-images";
const STORE = "images";

let dbPromise;
function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function loadImage(id) {
  const db = await openDB();
  return new Promise((resolve) => {
    const req = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result?.data || null);
    req.onerror = () => resolve(null);
  });
}

async function saveImage(id, data) {
  const db = await openDB();
  db.transaction(STORE, "readwrite").objectStore(STORE).put({ id, data });
}

export default function ImageSlot({ id, placeholder = "Drop image", radius = 12 }) {
  const [src, setSrc] = useState(null);
  const [over, setOver] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (id) loadImage(id).then((d) => d && setSrc(d));
  }, [id]);

  function handleFile(file) {
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(reader.result);
      if (id) saveImage(id, reader.result);
    };
    reader.readAsDataURL(file);
  }

  if (src) {
    return (
      <div
        style={{ width: "100%", height: "100%", borderRadius: radius, overflow: "hidden", cursor: "pointer", position: "relative" }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); handleFile(e.dataTransfer.files[0]); }}
      style={{
        width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: radius, border: `2px dashed ${over ? "#A3E635" : "#334155"}`,
        background: over ? "rgba(163,230,53,.1)" : "#1A2028", color: "#9CA3AF",
        fontSize: 13, cursor: "pointer", transition: "all .3s",
      }}
    >
      <span>{placeholder}</span>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  );
}
