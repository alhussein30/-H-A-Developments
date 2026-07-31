import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Site from "./site/Site";
import Dashboard from "./dashboard/Dashboard";

const globalCSS = `
  html { scroll-behavior: smooth; }
  body { margin:0; background:#101418; color:#F9FAFB; font-family:'Inter',system-ui,sans-serif; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
  *, *::before, *::after { box-sizing:border-box; }
  a { color:#A3E635; text-decoration:none; }
  a:hover { color:#D9F99D; }
  ::selection { background:rgba(156,163,175,.4); }
  input, textarea, select, button { font-family:inherit; }
  select option { background:#1A2028; color:#F9FAFB; }
  ::-webkit-scrollbar { width:10px; height:10px; }
  ::-webkit-scrollbar-track { background:#101418; }
  ::-webkit-scrollbar-thumb { background:rgba(249,250,251,.16); border-radius:99px; }
  @keyframes marq { from { transform:translateX(0) } to { transform:translateX(-50%) } }
  @keyframes floaty { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-14px) } }
  @keyframes floaty2 { 0%,100% { transform:translateY(0) } 50% { transform:translateY(12px) } }
  @keyframes barGrow { from { transform:scaleY(0) } to { transform:scaleY(1) } }
  @keyframes pop { from { opacity:0; transform:translateY(20px) scale(.97) } to { opacity:1; transform:none } }
  @keyframes fadein { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
  @media (prefers-reduced-motion: reduce) { * { animation:none !important; transition:none !important } }
`;

function App() {
  return (
    <>
      <style>{globalCSS}</style>
      <Routes>
        <Route path="/" element={<Site />} />
        <Route path="/admin" element={<Dashboard />} />
      </Routes>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
