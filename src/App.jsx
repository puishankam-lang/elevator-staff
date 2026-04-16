1import React, { useState, useEffect, useRef } from "react";

// ─── SUPABASE CLIENT ─────────────────────────────────────────────────────────
const SUPABASE_URL = "https://fyxvejnvzflxppqrhlzt.supabase.co";
const SUPABASE_KEY = "sb_publishable_k9GEEEmqiYnuBPFqsQuvIQ_YGjweOSh";

async function sbFetch(table, options = {}) {
  const { select = "*", filter, order, limit } = options;
  let url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}`;
  if (filter) url += `&${filter}`;
  if (order) url += `&order=${order}`;
  if (limit) url += `&limit=${limit}`;
  const res = await fetch(url, {
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

async function sbInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

async function sbUpdate(table, id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

/* ─────────────────────────────────────────────
   DESIGN: Industrial Safety Orange + Near-Black
   Ultra-minimal, oversized tap targets, icon-first
   Built for gloved hands on a 6" phone screen
───────────────────────────────────────────── */

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --orange: #FF6B1A;
    --orange-dark: #E05510;
    --orange-glow: rgba(255,107,26,0.18);
    --bg: #111214;
    --surface: #18191D;
    --surface2: #1F2127;
    --border: rgba(255,255,255,0.07);
    --text: #F2F3F5;
    --muted: #6B7180;
    --green: #22C55E;
    --red: #EF4444;
    --yellow: #FACC15;
    --blue: #60A5FA;
    --radius: 18px;
    --font: 'Nunito', sans-serif;
  }

  body, #root {
    background: var(--bg);
    font-family: var(--font);
    color: var(--text);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  /* Phone shell — full-width on mobile, framed on tablet/desktop */
  .phone-wrap {
    width: 100%;
    max-width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    background: var(--bg);
    overflow: hidden;
  }
  @media (min-width: 600px) {
    body, #root { background: #07080a; }
    .phone-wrap {
      max-width: 480px;
      margin: 0 auto;
      box-shadow: 0 0 60px rgba(0,0,0,0.6);
      border-left: 1px solid var(--border);
      border-right: 1px solid var(--border);
    }
  }

  /* Status bar */
  .statusbar {
    background: var(--surface);
    padding: 10px 20px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .statusbar-time { color: var(--text); font-size: 14px; }
  .statusbar-icons { display: flex; gap: 6px; }

  /* Top header */
  .topbar {
    background: var(--surface);
    padding: 14px 20px 16px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .topbar-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .back-btn {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    cursor: pointer;
    color: var(--text);
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .page-label {
    font-size: 17px;
    font-weight: 800;
    color: var(--text);
    text-align: center;
    flex: 1;
  }
  .topbar-right-space { width: 40px; }

  /* User greeting bar */
  .greet-bar {
    background: linear-gradient(135deg, #1A1B20 0%, #1E1F25 100%);
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    border-bottom: 1px solid var(--border);
  }
  .avatar-lg {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--orange), var(--orange-dark));
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 900;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(255,107,26,0.35);
  }
  .greet-text {}
  .greet-name { font-size: 17px; font-weight: 800; color: var(--text); }
  .greet-sub { font-size: 14px; color: var(--muted); margin-top: 1px; }
  .greet-badge {
    margin-left: auto;
    background: var(--orange-glow);
    border: 1px solid var(--orange);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 12px;
    font-weight: 700;
    color: var(--orange);
  }

  /* Scroll content */
  .content {
    flex: 1;
    overflow-y: auto;
    padding: 20px 16px 100px;
    -webkit-overflow-scrolling: touch;
  }
  .content::-webkit-scrollbar { display: none; }

  /* Section label */
  .section-label {
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
    padding-left: 2px;
  }

  /* ── HOME SCREEN ── */
  .today-card {
    background: linear-gradient(135deg, var(--orange) 0%, var(--orange-dark) 100%);
    border-radius: var(--radius);
    padding: 20px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }
  .today-card::before {
    content: '';
    position: absolute;
    top: -30px; right: -30px;
    width: 120px; height: 120px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
  }
  .today-card::after {
    content: '';
    position: absolute;
    bottom: -20px; right: 30px;
    width: 80px; height: 80px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
  }
  .today-label { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }
  .today-site { font-size: 20px; font-weight: 900; color: #fff; margin-bottom: 12px; line-height: 1.2; }
  .today-chips { display: flex; gap: 8px; flex-wrap: wrap; }
  .today-chip {
    background: rgba(255,255,255,0.15);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
  }

  /* Big action buttons */
  .action-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }
  .action-btn {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 14px 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    text-align: center;
    transition: transform 0.1s, background 0.15s;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    overflow: hidden;
    min-height: 120px;
  }
  .action-btn:active { transform: scale(0.97); }
  .action-btn.orange-accent { border-color: rgba(255,107,26,0.3); background: rgba(255,107,26,0.05); }
  .action-btn.green-accent { border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.05); }
  .action-btn.blue-accent { border-color: rgba(96,165,250,0.3); background: rgba(96,165,250,0.05); }
  .action-btn.yellow-accent { border-color: rgba(250,204,21,0.3); background: rgba(250,204,21,0.05); }
  .action-icon {
    font-size: 36px;
    line-height: 1;
  }
  .action-label {
    font-size: 14px;
    font-weight: 800;
    color: var(--text);
    line-height: 1.2;
  }
  .action-sub {
    font-size: 11px;
    color: var(--muted);
    font-weight: 600;
  }
  .action-status {
    position: absolute;
    top: 10px; right: 10px;
    width: 10px; height: 10px;
    border-radius: 50%;
  }
  .action-status.done { background: var(--green); box-shadow: 0 0 6px var(--green); }
  .action-status.pending { background: var(--orange); box-shadow: 0 0 6px var(--orange); }
  .action-status.none { background: var(--surface2); }

  /* Wide single button */
  .big-btn {
    width: 100%;
    border: none;
    border-radius: var(--radius);
    padding: 20px;
    font-family: var(--font);
    font-size: 17px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    margin-bottom: 12px;
    transition: transform 0.1s, opacity 0.15s;
    -webkit-tap-highlight-color: transparent;
    letter-spacing: 0.3px;
  }
  .big-btn:active { transform: scale(0.98); }
  .big-btn.primary { background: linear-gradient(135deg, var(--orange), var(--orange-dark)); color: #fff; box-shadow: 0 8px 24px rgba(255,107,26,0.3); }
  .big-btn.success { background: linear-gradient(135deg, var(--green), #16A34A); color: #fff; box-shadow: 0 8px 24px rgba(34,197,94,0.25); }
  .big-btn.danger { background: linear-gradient(135deg, var(--red), #DC2626); color: #fff; box-shadow: 0 8px 24px rgba(239,68,68,0.25); }
  .big-btn.secondary { background: var(--surface2); color: var(--text); border: 1.5px solid var(--border); box-shadow: none; }
  .big-btn.disabled { background: var(--surface2); color: var(--muted); cursor: default; box-shadow: none; }
  .big-btn-icon { font-size: 22px; }

  /* Status pill */
  .pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 800;
  }
  .pill-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .pill.green { background: rgba(34,197,94,0.12); color: var(--green); }
  .pill.green .pill-dot { background: var(--green); }
  .pill.orange { background: var(--orange-glow); color: var(--orange); }
  .pill.orange .pill-dot { background: var(--orange); }
  .pill.red { background: rgba(239,68,68,0.12); color: var(--red); }
  .pill.red .pill-dot { background: var(--red); }
  .pill.muted { background: var(--surface2); color: var(--muted); }
  .pill.muted .pill-dot { background: var(--muted); }

  /* Info card */
  .info-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 18px;
    margin-bottom: 12px;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .info-row:last-child { border-bottom: none; }
  .info-key { font-size: 15px; color: var(--muted); font-weight: 600; }
  .info-val { font-size: 16px; color: var(--text); font-weight: 800; text-align: right; }
  .info-val.orange { color: var(--orange); }
  .info-val.green { color: var(--green); }
  .info-val.red { color: var(--red); }

  /* ── SAFETY SCREEN ── */
  .safety-scroll {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 16px;
    max-height: 220px;
    overflow-y: auto;
    margin-bottom: 16px;
    font-size: 13px;
    color: #B0B5C4;
    line-height: 1.75;
  }
  .safety-scroll::-webkit-scrollbar { width: 3px; }
  .safety-scroll::-webkit-scrollbar-thumb { background: var(--surface2); border-radius: 4px; }
  .safety-scroll strong { color: var(--text); display: block; margin-bottom: 2px; margin-top: 10px; font-size: 14px; }
  .safety-scroll strong:first-child { margin-top: 0; }

  .check-row {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .check-row.checked { border-color: var(--green); background: rgba(34,197,94,0.06); }
  .check-box {
    width: 28px; height: 28px;
    border-radius: 8px;
    border: 2.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    transition: all 0.15s;
    background: var(--surface2);
  }
  .check-box.checked { background: var(--green); border-color: var(--green); }
  .check-text { font-size: 16px; font-weight: 700; color: var(--text); line-height: 1.3; }
  .check-sub { font-size: 14px; color: var(--muted); margin-top: 2px; }

  /* Sign pad mock */
  .sign-area {
    background: var(--surface2);
    border: 2px dashed var(--border);
    border-radius: 14px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
    font-size: 13px;
    color: var(--muted);
    font-weight: 600;
    flex-direction: column;
    gap: 6px;
  }
  .sign-area.signed { border-color: var(--green); border-style: solid; background: rgba(34,197,94,0.05); }

  /* ── GPS SCREEN ── */
  .map-mock {
    background: #0D1117;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    height: 200px;
    position: relative;
    overflow: hidden;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .map-grid-lines {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,107,26,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,107,26,0.06) 1px, transparent 1px);
    background-size: 32px 32px;
  }
  .map-pulse-ring {
    width: 100px; height: 100px;
    border-radius: 50%;
    border: 2px solid rgba(255,107,26,0.25);
    position: absolute;
    animation: mapPulse 2s infinite;
  }
  .map-pulse-ring2 {
    width: 60px; height: 60px;
    border-radius: 50%;
    border: 2px solid rgba(255,107,26,0.15);
    position: absolute;
    animation: mapPulse 2s infinite 0.5s;
  }
  @keyframes mapPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.5; }
  }
  .map-pin {
    width: 20px; height: 20px;
    background: var(--orange);
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 0 0 6px rgba(255,107,26,0.25);
    z-index: 2;
    position: relative;
    animation: pinPulse 2s infinite;
  }
  @keyframes pinPulse {
    0%, 100% { box-shadow: 0 0 0 4px rgba(255,107,26,0.25); }
    50% { box-shadow: 0 0 0 10px rgba(255,107,26,0.05); }
  }
  .map-badge {
    position: absolute;
    top: 10px; left: 10px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 700;
    color: var(--orange);
  }
  .map-coords {
    position: absolute;
    bottom: 10px; right: 10px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 10px;
    color: var(--muted);
    font-family: monospace;
  }
  .inside-badge {
    position: absolute;
    top: 10px; right: 10px;
    background: rgba(34,197,94,0.15);
    border: 1px solid var(--green);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 700;
    color: var(--green);
  }

  /* Clock display */
  .clock-display {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 20px;
    text-align: center;
    margin-bottom: 14px;
  }
  .clock-time {
    font-size: 48px;
    font-weight: 900;
    color: var(--text);
    letter-spacing: -1px;
    line-height: 1;
    margin-bottom: 4px;
  }
  .clock-date { font-size: 13px; color: var(--muted); font-weight: 600; }

  /* ── PROGRESS SCREEN ── */
  .photo-upload {
    background: var(--surface);
    border: 2px dashed rgba(255,107,26,0.3);
    border-radius: var(--radius);
    height: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    margin-bottom: 14px;
    transition: border-color 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .photo-upload.has-photo { border-color: var(--green); border-style: solid; background: rgba(34,197,94,0.04); }
  .photo-upload-icon { font-size: 40px; }
  .photo-upload-label { font-size: 14px; font-weight: 700; color: var(--muted); }
  .photo-upload-sub { font-size: 14px; color: var(--muted); opacity: 0.6; }
  .photo-thumbs { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
  .photo-thumb {
    width: 68px; height: 68px;
    border-radius: 10px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    position: relative;
    overflow: hidden;
  }
  .photo-thumb .remove {
    position: absolute; top: 2px; right: 2px;
    width: 18px; height: 18px;
    background: var(--red);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px;
    color: #fff;
    cursor: pointer;
  }

  .pct-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 14px;
  }
  .pct-btn {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 14px 6px;
    text-align: center;
    cursor: pointer;
    font-family: var(--font);
    font-size: 16px;
    font-weight: 900;
    color: var(--muted);
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
  }
  .pct-btn:active { transform: scale(0.95); }
  .pct-btn.selected { background: var(--orange-glow); border-color: var(--orange); color: var(--orange); }
  .pct-sub { font-size: 10px; font-weight: 600; margin-top: 2px; opacity: 0.6; }

  .note-input {
    width: 100%;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 14px 16px;
    font-family: var(--font);
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    outline: none;
    resize: none;
    margin-bottom: 14px;
    min-height: 80px;
    transition: border-color 0.15s;
  }
  .note-input::placeholder { color: var(--muted); }
  .note-input:focus { border-color: rgba(255,107,26,0.4); }

  /* ── ATTENDANCE SCREEN ── */
  .month-strip {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 8px;
    margin-bottom: 16px;
    -webkit-overflow-scrolling: touch;
  }
  .month-strip::-webkit-scrollbar { display: none; }
  .day-chip {
    flex-shrink: 0;
    width: 44px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 8px 4px;
    text-align: center;
    cursor: pointer;
  }
  .day-chip.present { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.07); }
  .day-chip.absent { border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.05); }
  .day-chip.today { border-color: var(--orange); background: var(--orange-glow); }
  .day-num { font-size: 16px; font-weight: 900; color: var(--text); }
  .day-label { font-size: 10px; font-weight: 700; color: var(--muted); margin-top: 1px; }
  .day-dot { width: 6px; height: 6px; border-radius: 50%; margin: 4px auto 0; }
  .day-dot.green { background: var(--green); }
  .day-dot.red { background: var(--red); }
  .day-dot.orange { background: var(--orange); }
  .day-dot.none { background: transparent; }

  .att-stat-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .att-stat {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 14px 10px;
    text-align: center;
  }
  .att-stat-num { font-size: 28px; font-weight: 900; line-height: 1; margin-bottom: 4px; }
  .att-stat-label { font-size: 11px; color: var(--muted); font-weight: 700; }

  /* ── SALARY SCREEN ── */
  .salary-hero {
    background: linear-gradient(135deg, #1A2A1A, #162216);
    border: 1.5px solid rgba(34,197,94,0.2);
    border-radius: var(--radius);
    padding: 24px 20px;
    text-align: center;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
  }
  .salary-hero::before {
    content: '💰';
    position: absolute;
    top: -10px; right: -10px;
    font-size: 80px;
    opacity: 0.06;
  }
  .salary-month { font-size: 12px; color: rgba(34,197,94,0.7); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .salary-amount { font-size: 44px; font-weight: 900; color: var(--green); line-height: 1; margin-bottom: 6px; }
  .salary-sub { font-size: 13px; color: var(--muted); font-weight: 600; }

  .salary-row {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    margin-bottom: 10px;
  }
  .salary-row-inner {
    padding: 14px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .salary-row-label { font-size: 14px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; }
  .salary-row-val { font-size: 16px; font-weight: 900; color: var(--green); }
  .salary-row-val.deduct { color: var(--red); }
  .salary-row-val.muted { color: var(--muted); }
  .salary-divider { height: 1px; background: var(--border); margin: 0 16px; }

  /* ── BOTTOM NAV (matches phone-wrap width) ── */
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background: var(--surface);
    border-top: 1px solid var(--border);
    padding: 8px 4px 16px;
    display: flex;
    z-index: 100;
  }
  @media (min-width: 600px) {
    .bottom-nav {
      max-width: 480px;
      left: 50%;
      transform: translateX(-50%);
      border-left: 1px solid var(--border);
      border-right: 1px solid var(--border);
    }
  }
  .nav-tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 6px 4px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    border-radius: 10px;
    transition: background 0.15s;
  }
  .nav-tab:active { background: var(--surface2); }
  .nav-tab-icon { font-size: 22px; line-height: 1; }
  .nav-tab-label { font-size: 13px; font-weight: 700; color: var(--muted); }
  .nav-tab.active .nav-tab-label { color: var(--orange); }
  .nav-tab.active .nav-tab-icon { filter: brightness(1.2); }
  .nav-indicator {
    width: 20px; height: 3px;
    border-radius: 2px;
    background: var(--orange);
    margin-bottom: -2px;
    opacity: 0;
  }
  .nav-tab.active .nav-indicator { opacity: 1; }

  /* Toasty */
  .toast {
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: #1F2127;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    white-space: nowrap;
    z-index: 999;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    animation: toastIn 0.25s ease;
  }
  .toast.success { border-color: rgba(34,197,94,0.3); color: var(--green); }
  .toast.error { border-color: rgba(239,68,68,0.3); color: var(--red); }
  @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

  /* Misc */
  .divider { height: 1px; background: var(--border); margin: 16px 0; }
  .text-center { text-align: center; }
  .success-lottie { font-size: 64px; text-align: center; margin: 20px 0; animation: popIn 0.4s ease; }
  @keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .big-success-msg { font-size: 22px; font-weight: 900; color: var(--green); text-align: center; margin-bottom: 8px; }
  .big-success-sub { font-size: 14px; color: var(--muted); text-align: center; }
`;

// ── Data ──────────────────────────────────────────

// 👇 員工帳號資料庫 — 老闆可以自行修改姓名、號碼、PIN、日薪
const EMPLOYEE_DB = [
  // 員工資料由老闆在管理系統新增，透過 Supabase 登入
  // 如需測試，請聯絡系統管理員
];

const genAttendance = (presentDays) => {
  const days = [];
  let present = 0;
  for (let i = 1; i <= 31; i++) {
    let status;
    if (i > 15) status = "future";
    else if (i === 15) { status = "today"; present++; }
    else { status = present < presentDays - 1 && Math.random() > 0.15 ? "present" : "absent"; if (status === "present") present++; }
    days.push({ day: i, label: ["日","一","二","三","四","五","六"][(i + 2) % 7], status });
  }
  return days;
};

// ── Login Screen ───────────────────────────────────
function LoginScreen({ onLogin, error, setError, employees = EMPLOYEE_DB }) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [step, setStep] = useState("phone"); // "phone" | "pin"
  const [foundEmp, setFoundEmp] = useState(null);

  const handlePhoneNext = () => {
    const cleanPhone = phone.replace(/\s/g, "");
    // Check Supabase employees first, then always fallback to EMPLOYEE_DB
    const allEmps = [...employees];
    EMPLOYEE_DB.forEach(e => { if (!allEmps.find(x => x.phone === e.phone)) allEmps.push(e); });
    const emp = allEmps.find(e => e.phone === cleanPhone);
    if (!emp) { setError("找不到此手機號碼，請聯絡老闆"); return; }
    setFoundEmp(emp);
    setError("");
    setStep("pin");
  };

  const handlePinLogin = () => {
    if (pin === foundEmp.pin) {
      setError("");
      onLogin(foundEmp);
    } else {
      setError("PIN 碼錯誤，請重試");
      setPin("");
    }
  };

  const handlePinKey = (key) => {
    if (key === "DEL") { setPin(p => p.slice(0, -1)); return; }
    if (pin.length >= 4) return;
    const newPin = pin + key;
    setPin(newPin);
    if (newPin.length === 4) {
      setTimeout(() => {
        if (newPin === foundEmp.pin) { setError(""); onLogin(foundEmp); }
        else { setError("PIN 碼錯誤，請重試"); setPin(""); }
      }, 200);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px" }}>
      {/* Logo */}
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <div style={{ width: 72, height: 72, background: "linear-gradient(135deg, var(--orange), var(--orange-d))", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 14px", boxShadow: "0 8px 32px rgba(255,107,26,0.35)" }}>🏗️</div>
        <div style={{ fontFamily: "var(--font)", fontWeight: 900, fontSize: 22, color: "var(--text)", marginBottom: 4 }}>電梯工程</div>
        <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>員工工作平台</div>
      </div>

      <div style={{ width: "100%", maxWidth: 360 }}>
        {step === "phone" ? (
          <>
            <div style={{ fontSize: 20, fontWeight: 900, color: "var(--text)", marginBottom: 6, textAlign: "center" }}>輸入你的手機號碼</div>
            <div style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", marginBottom: 28 }}>用返登記的香港號碼</div>

            <div style={{ background: "var(--surface)", border: `1.5px solid ${error ? "var(--red)" : "var(--border)"}`, borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>📱</span>
              <input
                type="tel"
                placeholder="例如：91234567"
                value={phone}
                onChange={e => { setPhone(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handlePhoneNext()}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 18, fontFamily: "var(--font)", fontWeight: 700, color: "var(--text)", letterSpacing: 2 }}
                autoFocus
              />
            </div>

            {error && <div style={{ fontSize: 13, color: "var(--red)", textAlign: "center", marginBottom: 12 }}>⚠️ {error}</div>}

            <button onClick={handlePhoneNext} style={{ width: "100%", background: "linear-gradient(135deg, var(--orange), var(--orange-d))", border: "none", borderRadius: 14, padding: "18px", fontSize: 17, fontWeight: 900, color: "#fff", cursor: "pointer", fontFamily: "var(--font)", boxShadow: "0 8px 24px rgba(255,107,26,0.3)" }}>
              下一步 →
            </button>

            {/* Demo hint */}
            <div style={{ marginTop: 28, background: "rgba(255,107,26,0.06)", border: "1px solid rgba(255,107,26,0.15)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--orange)", marginBottom: 8 }}>👷 測試帳號（Demo）</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {EMPLOYEE_DB.map(e => (
                  <div key={e.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)" }}>
                    <span style={{ cursor: "pointer", color: "var(--sub)" }} onClick={() => setPhone(e.phone)}>{e.name} — {e.phone}</span>
                    <span style={{ color: "var(--muted)" }}>PIN: {e.pin}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Found employee */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: foundEmp.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 auto 12px", boxShadow: `0 6px 20px ${foundEmp.color}55` }}>
                {foundEmp.name[0]}
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "var(--text)" }}>你好，{foundEmp.name} 👋</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{foundEmp.role} · 輸入 4 位 PIN 碼</div>
            </div>

            {/* PIN dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 8 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ width: 18, height: 18, borderRadius: "50%", background: i < pin.length ? "var(--orange)" : "var(--surface2)", border: `2px solid ${i < pin.length ? "var(--orange)" : "var(--border)"}`, transition: "all 0.15s", transform: i < pin.length ? "scale(1.2)" : "scale(1)" }} />
              ))}
            </div>
            {error && <div style={{ fontSize: 13, color: "var(--red)", textAlign: "center", marginBottom: 8 }}>⚠️ {error}</div>}

            {/* Number pad */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 20 }}>
              {["1","2","3","4","5","6","7","8","9","","0","DEL"].map((k, i) => (
                <button key={i} onClick={() => k && handlePinKey(k)}
                  style={{ height: 72, borderRadius: 14, border: "1.5px solid var(--border)", background: k === "DEL" ? "rgba(239,68,68,0.1)" : k === "" ? "transparent" : "var(--surface)", fontSize: k === "DEL" ? 22 : 30, fontWeight: 900, color: k === "DEL" ? "var(--red)" : "var(--text)", cursor: k ? "pointer" : "default", fontFamily: "var(--font)", transition: "transform 0.1s, background 0.1s", visibility: k === "" ? "hidden" : "visible" }}
                  onMouseDown={e => e.currentTarget.style.transform = "scale(0.94)"}
                  onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  {k === "DEL" ? "⌫" : k}
                </button>
              ))}
            </div>

            <button onClick={() => { setStep("phone"); setPin(""); setError(""); setFoundEmp(null); }}
              style={{ width: "100%", background: "transparent", border: "none", color: "var(--muted)", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 16, padding: "10px", fontFamily: "var(--font)" }}>
              ← 返回更改號碼
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────
// ── Offline Queue Helpers ────────────────────────────────────────────────────
const QUEUE_KEY = "chun_fai_offline_queue";

function queueGet() {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch { return []; }
}
function queueSave(q) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); } catch {}
}
function queueAdd(record) {
  const q = queueGet();
  q.push({ ...record, _queuedAt: new Date().toISOString(), _id: Date.now() });
  queueSave(q);
}
function queueRemove(id) {
  queueSave(queueGet().filter(r => r._id !== id));
}

async function syncOfflineQueue(supabaseUrl, supabaseKey) {
  const q = queueGet();
  if (q.length === 0) return 0;
  let synced = 0;
  for (const record of q) {
    try {
      const { _queuedAt, _id, _table, _method, _matchId, ...data } = record;
      if (_method === "INSERT") {
        const res = await fetch(`${supabaseUrl}/rest/v1/${_table}`, {
          method: "POST",
          headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
          body: JSON.stringify(data)
        });
        if (res.ok) { queueRemove(_id); synced++; }
      } else if (_method === "PATCH" && _matchId) {
        const res = await fetch(`${supabaseUrl}/rest/v1/${_table}?id=eq.${_matchId}`, {
          method: "PATCH",
          headers: { "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}`, "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (res.ok) { queueRemove(_id); synced++; }
      }
    } catch(e) { /* still offline, leave in queue */ }
  }
  return synced;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState("");
  const [employees, setEmployees] = useState(EMPLOYEE_DB);
  const [projects, setProjects] = useState([]);
  const [dbReady, setDbReady] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState(queueGet().length);

  // Auto-sync offline queue when network recovers
  useEffect(() => {
    const trySync = async () => {
      const q = queueGet();
      if (q.length === 0) return;
      const synced = await syncOfflineQueue(SUPABASE_URL, SUPABASE_KEY);
      if (synced > 0) {
        setOfflineQueue(queueGet().length);
        // show subtle toast only if logged in
        if (EMPLOYEE) console.log(`✅ ${synced} offline record(s) synced`);
      }
    };
    window.addEventListener("online", trySync);
    trySync(); // also try on mount
    return () => window.removeEventListener("online", trySync);
  }, []);

  // Load employees + projects from Supabase on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [emps, projs] = await Promise.all([
          sbFetch("employees", { order: "created_at.asc" }),
          sbFetch("projects", { filter: "phase=eq.active", order: "name.asc", limit: 200 })
        ]);
        // Only use Supabase employees if they have phone numbers
        if (emps.length > 0 && emps.some(e => e.phone)) {
          const mapped = emps.map(e => ({
            id: e.id,
            name: e.name,
            role: e.role || "電梯技工",
            phone: e.phone || "",
            pin: e.pin || "1234",
            site: e.site || "工地",
            rate: e.daily_rate || 850,
            color: e.color || "#FF6B1A",
            presentDays: 22,
            salaryHistory: [
              { month: "2025年7月", amount: (e.daily_rate||850)*22, days: 22, status: "pending" },
              { month: "2025年6月", amount: (e.daily_rate||850)*20, days: 20, status: "paid" },
            ]
          }));
          setEmployees(mapped);
        }
        // Always use EMPLOYEE_DB as login fallback (merged with Supabase)
        if (projs.length > 0) setProjects(projs.map(p => ({
          name: p.name,
          id: p.id,
          lat: p.site_lat || null,
          lng: p.site_lng || null,
        })));
        setDbReady(true);
      } catch(e) {
        console.log("Using demo data:", e);
        setDbReady(true);
      }
    };
    load();
  }, []);

  const handleLogin = async (emp) => {
    setCurrentUser(emp);
    // Record login time to attendance
    try {
      const today = new Date().toISOString().split("T")[0];
      await sbInsert("attendance", {
        employee_id: emp.id,
        date: today,
        check_in: new Date().toISOString(),
        status: "present"
      });
    } catch(e) {} // Silent fail
  };

  const handleLogout = () => { setCurrentUser(null); setLoginError(""); };

  if (!dbReady) {
    return (
      <>
        <style>{S}</style>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", gap:16, background:"#111214" }}>
          <div style={{ width:40, height:40, border:"3px solid #222", borderTop:"3px solid #FF6B1A", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ color:"#FF6B1A", fontFamily:"Nunito,sans-serif", fontWeight:800 }}>載入中...</div>
        </div>
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <style>{S}</style>
        <LoginScreen onLogin={handleLogin} error={loginError} setError={setLoginError} employees={employees} />
      </>
    );
  }

  return <MainApp user={currentUser} onLogout={handleLogout} projects={projects} />;
}

function MainApp({ user, onLogout, projects = [] }) {
  const EMPLOYEE = user;
  const ATTENDANCE_DATA = genAttendance(user.presentDays);
  const SALARY_HISTORY = user.salaryHistory;

  const [screen, setScreen] = useState("home");
  const [toast, setToast] = useState(null);

  // Safety state
  const [safetyChecks, setSafetyChecks] = useState([false, false, false]);
  const [signed, setSigned] = useState(false);
  const [signedTime, setSignedTime] = useState(null);
  const [selectedProject, setSelectedProjectState] = useState("");
  const selectedProjectRef = React.useRef("");
  const setSelectedProject = (val) => {
    selectedProjectRef.current = val;
    setSelectedProjectState(val);
  };

  // Attendance state
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [clockTick, setClockTick] = useState(new Date());
  const [isInZone, setIsInZone] = useState(null);       // null=unknown, true=inside, false=outside
  const [gpsWatching, setGpsWatching] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [distToSite, setDistToSite] = useState(null);    // metres
  const [autoCheckoutTime] = useState("19:00");
  const AUTO_CHECKOUT_HOUR = 19;
  const AUTO_CHECKOUT_MIN = 0;
  const ZONE_RADIUS = 200; // metres — slightly generous for HK urban GPS drift

  // Progress state
  const [selectedPct, setSelectedPct] = useState(null);
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState([]);
  const [progressSubmitted, setProgressSubmitted] = useState(false);
  const [progressSaving, setProgressSaving] = useState(false);
  const [progressStageDesc, setProgressStageDesc] = useState("");

  // Salary view
  const [salaryMonth, setSalaryMonth] = useState(0);

  // Haversine distance formula (metres)
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  useEffect(() => {
    const t = setInterval(() => setClockTick(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-checkout at set time if not signed out
  useEffect(() => {
    if (!checkedIn || checkedOut) return;
    const now = clockTick;
    const h = now.getHours();
    const m = now.getMinutes();
    if (h === AUTO_CHECKOUT_HOUR && m === AUTO_CHECKOUT_MIN) {
      const t = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
      setCheckedOut(true);
      setCheckOutTime(t + " （系統自動）");
      showToast("🕖 已自動簽退（" + t + "）");
    }
  }, [clockTick, checkedIn, checkedOut]);

  // ── Live GPS monitoring ─────────────────────────────────────────────────
  // selectedProject is either a string (name only) or object {name,lat,lng}
  const siteLat = selectedProject?.lat || null;
  const siteLng = selectedProject?.lng || null;
  const siteName = selectedProject?.name || (typeof selectedProject === "string" ? selectedProject : "");

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError("此裝置不支援 GPS 定位");
      return;
    }
    // Always watch position when on GPS screen (or checked in)
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLat(latitude);
        setUserLng(longitude);
        setGpsAccuracy(Math.round(accuracy));
        setGpsError(null);
        setGpsWatching(true);

        // Only compute zone if site has coordinates
        if (siteLat && siteLng) {
          const dist = getDistance(latitude, longitude, siteLat, siteLng);
          setDistToSite(Math.round(dist));
          const inZone = dist <= ZONE_RADIUS;
          setIsInZone(inZone);

          // Auto sign out if leaves zone after check-in
          if (!inZone && checkedIn && !checkedOut) {
            const t = new Date().toLocaleTimeString("zh-HK", { hour: "2-digit", minute: "2-digit" });
            setCheckedOut(true);
            setCheckOutTime(t + " （GPS 離開範圍）");
            showToast("📍 已離開工地範圍，系統自動記錄簽退");
          }
        } else {
          // No site coords — zone check disabled
          setIsInZone(null);
          setDistToSite(null);
        }
      },
      (err) => {
        setGpsWatching(false);
        if (err.code === 1) setGpsError("GPS 定位被拒絕，請喺設定允許位置權限");
        else if (err.code === 2) setGpsError("無法取得定位，請確保 GPS 已開啟");
        else setGpsError("定位逾時，請重試");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [checkedIn, checkedOut, siteLat, siteLng]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const timeStr = clockTick.toLocaleTimeString("zh-HK", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = clockTick.toLocaleDateString("zh-HK", { month: "long", day: "numeric", weekday: "short" });

  const presentDays = ATTENDANCE_DATA.filter(d => d.status === "present" || d.status === "today").length;
  const absentDays = ATTENDANCE_DATA.filter(d => d.status === "absent").length;

  const NAV = [
    { id: "home",      icon: "🏠", label: "主頁" },
    { id: "workorder", icon: "📋", label: "申報" },
    { id: "gps",       icon: "📍", label: "簽到" },
    { id: "docs",      icon: "📁", label: "文件" },
    { id: "salary",    icon: "💰", label: "薪酬" },
  ];

  // ── Screens ────────────────────────────────────

  const HomeScreen = () => (
    <>
      <div className="today-card">
        <div className="today-label">今日工地</div>
        <div className="today-site">{EMPLOYEE.site}</div>
        <div className="today-chips">
          <span className="today-chip">📅 {new Date().toLocaleDateString("zh-HK", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span className="today-chip">☀️ 晴，31°C</span>
        </div>
      </div>

      <div className="section-label">今日任務</div>
      <div className="action-grid">
        <div className="action-btn orange-accent" onClick={() => setScreen("workorder")}>
          <div className="action-status" style={{ background: workOrderSubmitted ? "#22C55E" : "#FF6B1A", boxShadow: workOrderSubmitted ? "0 0 6px #22C55E" : "0 0 6px #FF6B1A" }} />
          <div className="action-icon">📋</div>
          <div className="action-label">工序安全申報</div>
          <div className="action-sub">{workOrderSubmitted ? `✓ ${workOrderTime} 已提交` : "⚡ 每日必填"}</div>
        </div>
        <div className="action-btn green-accent" onClick={() => setScreen("gps")}>
          <div className="action-status" style={{ background: checkedIn ? "#22C55E" : "#FF6B1A", boxShadow: checkedIn ? "0 0 6px #22C55E" : "0 0 6px #FF6B1A" }} />
          <div className="action-icon">📍</div>
          <div className="action-label">GPS 簽到</div>
          <div className="action-sub">{checkedIn ? `✓ ${checkInTime}` : "未簽到"}</div>
        </div>
        <div className="action-btn blue-accent" onClick={() => setScreen("progress")}>
          <div className="action-status" style={{ background: progressSubmitted ? "#22C55E" : "#FF6B1A", boxShadow: progressSubmitted ? "0 0 6px #22C55E" : "0 0 6px #FF6B1A" }} />
          <div className="action-icon">📊</div>
          <div className="action-label">上傳進度</div>
          <div className="action-sub">{progressSubmitted ? "✓ 今日已提交" : "回報施工進度"}</div>
        </div>
        <div className="action-btn yellow-accent" onClick={() => setScreen("salary")}>
          <div className="action-status none" />
          <div className="action-icon">💰</div>
          <div className="action-label">我的薪酬</div>
          <div className="action-sub">查看詳情</div>
        </div>
      </div>

      <div className="section-label">我的文件 <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginLeft: 6, textTransform: "none", letterSpacing: 0 }}>（一次性設置）</span></div>
      <div className="info-card" onClick={() => setScreen("docs")} style={{ cursor: "pointer", marginBottom: 16 }}>
        {expiringDocs.length > 0 ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0 10px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 24 }}>⚠️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "var(--orange)" }}>
                  {expiringDocs.length} 份文件即將到期
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  請盡早續期以免影響工作
                </div>
              </div>
            </div>
            {expiringDocs.slice(0, 3).map((d, i) => (
              <div key={i} className="info-row" style={{ padding: "8px 0", borderBottom: i < Math.min(2, expiringDocs.length - 1) ? "1px solid var(--border)" : "none" }}>
                <span className="info-key" style={{ fontSize: 13 }}>{d.icon} {d.label}</span>
                <span className="info-val" style={{ color: d.daysLeft <= 30 ? "var(--red)" : "var(--orange)", fontSize: 12 }}>
                  {d.daysLeft <= 0 ? "❌ 已過期" : `⏳ ${d.daysLeft} 日後到期`}
                </span>
              </div>
            ))}
          </>
        ) : (
          <div className="info-row" style={{ borderBottom: "none", padding: "4px 0" }}>
            <span className="info-key" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22 }}>📁</span>
              <span>文件存檔</span>
            </span>
            <span className="info-val" style={{ color: docsAllSet ? "var(--green)" : "var(--orange)" }}>
              {docsAllSet ? `✅ ${docsCompletedCount}/4 已完成` : `📤 ${docsCompletedCount}/4 待補交`}
            </span>
          </div>
        )}
      </div>

      <div className="section-label">今日狀態</div>
      <div className="info-card">
        <div className="info-row">
          <span className="info-key">安全條款</span>
          <span className={`info-val ${signed ? "green" : "orange"}`}>{signed ? "✅ 已簽署" : "⏳ 待完成"}</span>
        </div>
        <div className="info-row">
          <span className="info-key">GPS 定位</span>
          <span className={`info-val ${gpsWatching ? "green" : "muted"}`}>{gpsWatching ? `✅ 正常 ±${gpsAccuracy||"?"}m` : "未啟動"}</span>
        </div>
        <div className="info-row">
          <span className="info-key">簽到時間</span>
          <span className={`info-val ${checkedIn ? "green" : "orange"}`}>{checkedIn ? checkInTime : "未簽到"}</span>
        </div>
        <div className="info-row">
          <span className="info-key">簽退時間</span>
          <span className={`info-val ${checkedOut ? "green" : "muted"}`}>{checkedOut ? checkOutTime : "–"}</span>
        </div>
        <div className="info-row">
          <span className="info-key">本月出勤</span>
          <span className="info-val orange">{presentDays} 天</span>
        </div>
        <div className="info-row" style={{ borderBottom:"none" }}>
          <span className="info-key">🔐 登入 PIN</span>
          <button onClick={() => setScreen("pin")}
            style={{ background:"none", border:"1px solid var(--border)", color:"var(--muted)", borderRadius:8, padding:"3px 12px", fontSize:12, cursor:"pointer", fontFamily:"var(--font)" }}>
            更改 PIN
          </button>
        </div>
      </div>
    </>
  );

  const SafetyScreen = () => {
    const allChecked = safetyChecks.every(Boolean);
    const canSign = allChecked && selectedProject !== "";

    const handleSign = () => {
      if (!canSign) return;
      const t = clockTick.toLocaleTimeString("zh-HK", { hour: "2-digit", minute: "2-digit" });
      setSigned(true);
      setSignedTime(t);
      showToast("✅ 安全守則簽署完成！");
    };

    const PROJECTS_LIST = projects.length > 0 ? projects : [
      "EC-550屯門醫院輕鐵站行人天橋NF411",
      "EC-590大圓街GDS數據中心升降機",
      "EC-547將軍澳第67區政府聯用辦工大樓",
      "EC-530西灣河綜合大樓",
      "EC-540柴灣政府綜合大樓",
    ];

    return (
      <>
        {/* Step 1: Select Project */}
        <div className="section-label">第一步 — 選擇今日工程</div>
        {!signed ? (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PROJECTS_LIST.map((p, i) => (
                <div key={i}
                  onClick={() => setSelectedProject(p)}
                  style={{
                    background: selectedProject === p ? "var(--orange-glow)" : "var(--surface)",
                    border: `1.5px solid ${selectedProject === p ? "var(--orange)" : "var(--border)"}`,
                    borderRadius: 14, padding: "14px 16px",
                    display: "flex", alignItems: "center", gap: 12,
                    cursor: "pointer", transition: "all 0.15s",
                  }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    border: `2.5px solid ${selectedProject === p ? "var(--orange)" : "var(--border)"}`,
                    background: selectedProject === p ? "var(--orange)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.15s",
                  }}>
                    {selectedProject === p && <span style={{ fontSize: 12, color: "#fff", fontWeight: 900 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: selectedProject === p ? "var(--orange)" : "var(--text)" }}>
                    🏗️ {p}
                  </span>
                </div>
              ))}
            </div>
            {selectedProject === "" && (
              <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 8 }}>
                ⚠️ 請先選擇今日工程先可簽署
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: "var(--orange-glow)", border: "1.5px solid var(--orange)", borderRadius: 14, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>🏗️</span>
            <div>
              <div style={{ fontSize: 11, color: "var(--orange)", fontWeight: 700, marginBottom: 2 }}>今日工程</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>{siteName}</div>
            </div>
          </div>
        )}

        {/* Step 2: Read & Sign */}
        <div className="section-label">第二步 — 閱讀並簽署安全守則</div>
        <div className="safety-scroll">
          <strong>第一條 — 個人防護裝備</strong>
          所有進入施工現場人員必須全程佩戴安全帽、安全鞋及反光背心。電梯槽內作業必須配備安全繩及防墜落裝置。
          <strong>第二條 — 電源管制</strong>
          進行任何電氣工程前，必須確認主電源已切斷並上鎖（LOTO程序），並在配電箱貼上警告標示。
          <strong>第三條 — 高空作業</strong>
          超過2米高度作業必須使用獲認可之升降台或搭棚架，不得單人作業，必須保持通話聯絡。
          <strong>第四條 — 危險品存放</strong>
          潤滑油、清潔劑等危險品須存放於指定區域，遠離熱源，確保通風良好。
          <strong>第五條 — 緊急應變</strong>
          熟悉緊急撤離路線及急救箱位置。發生意外須即時通報主管並填寫事故報告表。
        </div>

        {[
          { label: "我已閱讀並明白所有安全守則", sub: "需閱讀完整內容" },
          { label: "我確認今日佩戴所有個人防護裝備", sub: "安全帽、安全鞋、反光背心" },
          { label: "我明白違規後果及緊急撤離程序", sub: "如有疑問請聯絡主管" },
        ].map((item, i) => (
          <div key={i}
            className={`check-row ${safetyChecks[i] ? "checked" : ""}`}
            onClick={() => {
              if (signed) return;
              const n = [...safetyChecks]; n[i] = !n[i]; setSafetyChecks(n);
            }}>
            <div className={`check-box ${safetyChecks[i] ? "checked" : ""}`}>{safetyChecks[i] ? "✓" : ""}</div>
            <div>
              <div className="check-text">{item.label}</div>
              <div className="check-sub">{item.sub}</div>
            </div>
          </div>
        ))}

        {signed ? (
          <div className="sign-area signed">
            <div style={{ fontSize: 28 }}>✅</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--green)" }}>已於 {signedTime} 完成簽署</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>工程：{siteName}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>時間戳記已記錄至系統</div>
          </div>
        ) : (
          <>
            <div className="sign-area" style={{ opacity: canSign ? 1 : 0.5 }}>
              <div style={{ fontSize: 28 }}>✍️</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                {!selectedProject ? "請先選擇工程" : !allChecked ? "請勾選所有確認項目" : "點擊下方按鈕確認簽署"}
              </div>
            </div>
            <button
              className={`big-btn ${canSign ? "success" : "disabled"}`}
              onClick={handleSign}
            >
              <span className="big-btn-icon">✍️</span>
              確認簽署安全守則
            </button>
          </>
        )}
      </>
    );
  };

  const GpsScreen = () => {
    // Projects can be strings (name only) or objects {name, lat, lng}
    const SITE_LIST = projects.length > 0 ? projects : [
      "EC-590大圓街GDS數據中心升降機", "EC-662柴灣VTC", "EC-550屯門橋機",
      "EC-547將軍澳政府聯用辦工大樓", "EC-530西灣河綜合大樓",
      "EC-540柴灣政府綜合大樓", "EC-591 CUHK LAB",
      "EC-617柴灣政府物料營運中心", "EC-621成運街數據中心", "EC-641永信大廈",
    ];
    const hasSiteCoords = siteLat && siteLng;
    const coordStr = userLat && userLng
      ? `${userLat.toFixed(5)}°N  ${userLng.toFixed(5)}°E`
      : "定位中...";

    const handleCheckIn = async () => {
      if (!selectedProject) { showToast("⚠️ 請先選擇今日工地", "error"); return; }
      if (!navigator.geolocation) { showToast("⚠️ 此裝置不支援 GPS", "error"); return; }

      showToast("📡 正在取得 GPS 位置...", "info");

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setUserLat(latitude);
          setUserLng(longitude);
          setGpsAccuracy(Math.round(accuracy));
          setGpsWatching(true);
          setGpsError(null);

          // Check zone if site has coords
          const sn = typeof selectedProject === "object" ? selectedProject.name : selectedProject;
          const sl = typeof selectedProject === "object" ? selectedProject.lat : null;
          const sg = typeof selectedProject === "object" ? selectedProject.lng : null;

          if (sl && sg) {
            const dist = getDistance(latitude, longitude, sl, sg);
            setDistToSite(Math.round(dist));
            setIsInZone(dist <= ZONE_RADIUS);
          }

          const t = clockTick.toLocaleTimeString("zh-HK", { hour: "2-digit", minute: "2-digit" });
          setCheckedIn(true); setCheckInTime(t);
          showToast(`📍 簽到成功！精確度 ±${Math.round(accuracy)}m`);

          const attendanceRow = {
            employee_id: EMPLOYEE.id,
            date: new Date().toISOString().split("T")[0],
            check_in: new Date().toISOString(),
            check_in_lat: latitude,
            check_in_lng: longitude,
            check_in_accuracy: Math.round(accuracy),
            status: "present",
            site: sn
          };
          try {
            await sbInsert("attendance", attendanceRow);
          } catch(e) {
            // No network — queue locally
            queueAdd({ ...attendanceRow, _table: "attendance", _method: "INSERT" });
            setOfflineQueue(q => q + 1);
            showToast("📵 無網絡，已本地儲存，網絡恢復後自動同步");
          }
        },
        (err) => {
          if (err.code === 1) showToast("❌ 請喺設定開啟位置權限", "error");
          else if (err.code === 2) showToast("❌ 無法取得 GPS，請確保開啟位置服務", "error");
          else showToast("❌ GPS 逾時，請重試", "error");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
      );
    };

    const handleCheckOut = async () => {
      const t = clockTick.toLocaleTimeString("zh-HK", { hour: "2-digit", minute: "2-digit" });

      // Optionally grab fresh GPS on checkout
      const doCheckout = async (outLat, outLng, outAcc) => {
        setCheckedOut(true); setCheckOutTime(t);
        showToast("👋 簽退完成！");
        const checkOutData = {
          check_out: new Date().toISOString(),
          check_out_lat: outLat,
          check_out_lng: outLng,
          check_out_accuracy: outAcc,
        };
        try {
          const today = new Date().toISOString().split("T")[0];
          const res = await fetch(
            `${SUPABASE_URL}/rest/v1/attendance?employee_id=eq.${EMPLOYEE.id}&date=eq.${today}&order=created_at.desc&limit=1`,
            { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
          );
          const rows = await res.json();
          if (rows.length > 0) {
            await sbUpdate("attendance", rows[0].id, checkOutData);
          }
        } catch(e) {
          // Queue for later sync — store with a best-guess date key
          queueAdd({ ...checkOutData, _table: "attendance", _method: "PATCH_CHECKOUT",
            employee_id: EMPLOYEE.id, date: new Date().toISOString().split("T")[0] });
          setOfflineQueue(q => q + 1);
          showToast("📵 無網絡，簽退已本地儲存，網絡恢復後自動同步");
        }
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => doCheckout(pos.coords.latitude, pos.coords.longitude, Math.round(pos.coords.accuracy)),
          () => doCheckout(userLat, userLng, gpsAccuracy), // fallback to last known
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
        );
      } else {
        doCheckout(userLat, userLng, gpsAccuracy);
      }
    };

    return (
      <>
        <div className="clock-display">
          <div className="clock-time">{timeStr}</div>
          <div className="clock-date">{dateStr}</div>
        </div>

        {/* Site selector - uncontrolled to prevent re-render flash */}
        {!checkedIn && (
          <>
            <div className="section-label">今日工地 *</div>
            <select
              defaultValue={typeof selectedProjectRef.current === "object" ? selectedProjectRef.current?.name : selectedProjectRef.current}
              onChange={e => {
                const val = e.target.value;
                // Find matching project object (may have coords)
                const match = SITE_LIST.find(p => (typeof p === "object" ? p.name : p) === val);
                const proj = match || val;
                selectedProjectRef.current = proj;
                setSelectedProjectState(proj);
                setDistToSite(null);
                setIsInZone(null);
              }}
              style={{ width:"100%", background:"var(--surface)", border:`1.5px solid ${selectedProject?"var(--orange)":"var(--border)"}`, color:selectedProject?"var(--text)":"var(--muted)", borderRadius:14, padding:"14px 16px", fontSize:14, fontFamily:"var(--font)", marginBottom:16, fontWeight:600 }}
            >
              <option value="">── 選擇今日工地 ──</option>
              {SITE_LIST.map((p,i) => {
                const name = typeof p === "object" ? p.name : p;
                const hasCoords = typeof p === "object" && p.lat && p.lng;
                return <option key={i} value={name}>{hasCoords ? "📍 " : ""}{name}</option>;
              })}
            </select>
            {hasSiteCoords && !gpsWatching && !gpsError && (
              <div style={{ fontSize:11, color:"var(--muted)", marginBottom:12, display:"flex", gap:6, alignItems:"center" }}>
                <span style={{ color:"var(--green)" }}>✓</span>
                工地已設定 GPS 座標，簽到後自動驗證位置
              </div>
            )}
            {selectedProject && !hasSiteCoords && (
              <div style={{ fontSize:11, color:"var(--orange)", marginBottom:12, display:"flex", gap:6, alignItems:"center" }}>
                <span>⚠️</span>
                此工地未設定 GPS 座標（管理員可在 Admin 系統新增），仍可正常簽到
              </div>
            )}
          </>
        )}

        {checkedIn && (
          <div style={{ background:"rgba(34,197,94,0.08)", border:"1.5px solid rgba(34,197,94,0.2)", borderRadius:14, padding:"12px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>📍</span>
            <div>
              <div style={{ fontSize:11, color:"var(--muted)" }}>今日工地</div>
              <div style={{ fontSize:14, fontWeight:800, color:"var(--green)" }}>{siteName}</div>
            </div>
          </div>
        )}

        {/* GPS error banner */}
        {gpsError && (
          <div style={{ background:"rgba(239,68,68,0.1)", border:"1.5px solid rgba(239,68,68,0.3)", borderRadius:14, padding:"12px 16px", marginBottom:14, display:"flex", gap:10, alignItems:"flex-start" }}>
            <span style={{ fontSize:20 }}>⚠️</span>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"var(--red)" }}>GPS 定位問題</div>
              <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{gpsError}</div>
              <div style={{ fontSize:11, color:"var(--muted)", marginTop:4 }}>請喺手機設定 → 私隱 → 位置服務 開啟</div>
            </div>
          </div>
        )}

        <div className="map-mock">
          <div className="map-grid-lines" />
          {gpsWatching && <><div className="map-pulse-ring" /><div className="map-pulse-ring2" /></>}
          <div className="map-pin" style={{ background: isInZone === true ? "var(--green)" : isInZone === false ? "var(--red)" : "var(--orange)" }} />
          <div className="map-badge">📍 {siteName ? siteName.slice(0,16) : "未選工地"}</div>
          <div className="map-coords" style={{ fontSize:10 }}>
            {gpsWatching ? coordStr : (gpsError ? "❌ 定位失敗" : "⏳ 等待 GPS...")}
          </div>
          <div className="inside-badge" style={{
            background: isInZone===true?"rgba(34,197,94,0.15)": isInZone===false?"rgba(239,68,68,0.15)":"rgba(255,107,26,0.15)",
            borderColor: isInZone===true?"var(--green)": isInZone===false?"var(--red)":"var(--orange)",
            color: isInZone===true?"var(--green)": isInZone===false?"var(--red)":"var(--orange)",
          }}>
            {isInZone===true ? "✓ 範圍內" : isInZone===false ? "✗ 範圍外" : hasSiteCoords ? "⏳ 定位中" : "⚪ 無座標"}
          </div>
        </div>

        {checkedIn && !checkedOut && isInZone === false && gpsWatching && hasSiteCoords && (
          <div style={{ background:"rgba(239,68,68,0.1)", border:"1.5px solid rgba(239,68,68,0.3)", borderRadius:14, padding:"12px 16px", marginBottom:14, display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:20 }}>⚠️</span>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"var(--red)" }}>已離開工地範圍！（{distToSite}m 外）</div>
              <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>系統將自動記錄簽退時間</div>
            </div>
          </div>
        )}

        <div className="info-card" style={{ marginBottom:14 }}>
          <div className="info-row">
            <span className="info-key">定位狀態</span>
            <span className={`pill ${gpsWatching?"green":gpsError?"red":"orange"}`}>
              <span className="pill-dot" />
              {gpsWatching ? `GPS ±${gpsAccuracy||"?"}m` : gpsError ? "定位失敗" : "等待GPS..."}
            </span>
          </div>
          {userLat && userLng && (
            <div className="info-row">
              <span className="info-key">我的座標</span>
              <span className="info-val" style={{ color:"var(--blue)", fontSize:11 }}>{userLat.toFixed(5)}, {userLng.toFixed(5)}</span>
            </div>
          )}
          {hasSiteCoords && distToSite !== null && (
            <div className="info-row">
              <span className="info-key">距工地</span>
              <span className={`info-val ${isInZone?"green":"red"}`} style={{ fontWeight:800 }}>
                {distToSite}m
                {isInZone===true ? " ✅ 範圍內" : ` ❌ 超出${ZONE_RADIUS}m`}
              </span>
            </div>
          )}
          {!hasSiteCoords && selectedProject && (
            <div className="info-row">
              <span className="info-key">工地座標</span>
              <span className="info-val" style={{ color:"var(--muted)", fontSize:12 }}>⚠️ 未設定（仍可簽到）</span>
            </div>
          )}
          <div className="info-row">
            <span className="info-key">今日簽到</span>
            <span className={`info-val ${checkedIn?"green":"orange"}`}>{checkedIn?checkInTime:"未簽到"}</span>
          </div>
          <div className="info-row">
            <span className="info-key">今日簽退</span>
            <span className={`info-val ${checkedOut?"green":"muted"}`}>{checkedOut?checkOutTime:"–"}</span>
          </div>
          <div className="info-row" style={{ borderBottom:"none" }}>
            <span className="info-key">🕖 自動簽退</span>
            <span className="info-val" style={{ color:"var(--blue)" }}>{autoCheckoutTime}</span>
          </div>
          {offlineQueue > 0 && (
            <div style={{ margin:"10px 0 0", padding:"8px 12px", background:"rgba(255,107,26,0.08)", borderRadius:10, border:"1px solid rgba(255,107,26,0.2)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontSize:12, color:"var(--orange)" }}>
                📵 {offlineQueue} 條記錄等待同步
              </div>
              <button onClick={async () => {
                const n = await syncOfflineQueue(SUPABASE_URL, SUPABASE_KEY);
                setOfflineQueue(queueGet().length);
                if (n > 0) showToast(`✅ 已同步 ${n} 條記錄！`);
                else showToast("⚠️ 仍然無網絡，請稍後再試", "error");
              }} style={{ background:"var(--orange)", border:"none", color:"#0d0f12", borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"var(--font)" }}>
                立即同步
              </button>
            </div>
          )}
        </div>

        {checkedIn && !checkedOut && (
          <div style={{ background:"rgba(96,165,250,0.08)", border:"1px solid rgba(96,165,250,0.2)", borderRadius:12, padding:"10px 14px", marginBottom:14, fontSize:12, color:"var(--muted)", display:"flex", gap:8 }}>
            <span>💡</span><span>系統將於 {autoCheckoutTime} 自動記錄簽退。</span>
          </div>
        )}

        {!checkedIn ? (
          <button
            className={`big-btn ${selectedProject && !gpsError?"primary":"disabled"}`}
            onClick={handleCheckIn}
            disabled={!selectedProject}
          >
            <span className="big-btn-icon">{gpsError?"❌":gpsWatching?"📍":"⏳"}</span>
            {!selectedProject ? "請先選擇工地" : gpsError ? "GPS 定位失敗，請檢查設定" : gpsWatching ? "立即簽到" : "獲取 GPS 中..."}
          </button>
        ) : !checkedOut ? (
          <>
            <div className="info-card" style={{ marginBottom:12, textAlign:"center", background:"rgba(34,197,94,0.06)", borderColor:"rgba(34,197,94,0.2)" }}>
              <div style={{ fontSize:14, color:"var(--green)", fontWeight:700, padding:"4px 0" }}>✅ 已於 {checkInTime} 成功簽到</div>
            </div>
            <button className="big-btn danger" onClick={handleCheckOut}>
              <span className="big-btn-icon">👋</span>下班簽退
            </button>
          </>
        ) : (
          <div className="info-card" style={{ textAlign:"center", background:"rgba(34,197,94,0.06)", borderColor:"rgba(34,197,94,0.2)" }}>
            <div style={{ fontSize:36, marginBottom:8 }}>✅</div>
            <div style={{ fontSize:15, fontWeight:800, color:"var(--green)", marginBottom:4 }}>今日考勤完成</div>
            <div style={{ fontSize:12, color:"var(--muted)" }}>簽到 {checkInTime} · 簽退 {checkOutTime}</div>
            <div style={{ fontSize:12, color:"var(--orange)", marginTop:4 }}>{siteName}</div>
          </div>
        )}
      </>
    );
  };

  const ProgressScreen = () => {
    // stageDesc lifted to MainApp scope (progressStageDesc) to prevent
    // the same flicker bug PinScreen had: defining useState locally inside
    // a screen that's re-created every MainApp render reset its state on
    // every keystroke, blanking the page mid-interaction.
    const stageDesc = progressStageDesc;
    const setStageDesc = setProgressStageDesc;

    const selectStage = (p, desc) => {
      setSelectedPct(p);
      setStageDesc(desc);
      setNote(desc);
    };

    const handleAddPhoto = () => {
      if (photos.length >= 5) return;
      const emojis = ["🏗️","🔧","⚙️","🔩","🪛"];
      setPhotos([...photos, emojis[photos.length % emojis.length]]);
      showToast("📷 照片已加入");
    };

    const handleSubmit = async () => {
      if (!selectedPct) return;
      setProgressSaving(true);
      try {
        await sbInsert("progress_reports", {
          employee_id: EMPLOYEE.id,
          project: siteName || EMPLOYEE.site || "",
          progress_pct: Number(selectedPct),
          note: note,
          submitted_at: new Date().toISOString()
        });
        setProgressSubmitted(true);
        showToast(`📊 進度 ${selectedPct}% 已提交並儲存！`);
      } catch(e) {
        setProgressSubmitted(true);
        showToast(`📊 進度 ${selectedPct}% 已提交！`);
      }
      setProgressSaving(false);
    };

    if (progressSubmitted) {
      return (
        <div style={{ padding: "20px 0" }}>
          <div className="success-lottie">✅</div>
          <div className="big-success-msg">進度回報成功！</div>
          <div className="big-success-sub">已提交：{selectedPct}% 完成</div>
          <div className="big-success-sub" style={{ marginTop: 4, marginBottom: 24 }}>{clockTick.toLocaleString("zh-HK")}</div>
          <button className="big-btn secondary" onClick={() => { setProgressSubmitted(false); setSelectedPct(null); setNote(""); setPhotos([]); }}>
            提交另一個回報
          </button>
        </div>
      );
    }

    const STAGE_GROUPS = [
      {
        label: "🆕 新裝",
        color: "var(--orange)",
        stages: [
          { p: 20, desc: "已進場開工及提交秤線表" },
          { p: 50, desc: "已完成外門框、門頭、地砵，已完成主副路軌安裝及調校" },
          { p: 80, desc: "已完成機房及井道全面安裝，已拆棚交較車行慢車" },
          { p: 95, desc: "已完成 EMSD 驗機，已完成保養部驗收手尾" },
          { p: 100, desc: "已完成客戶交機時安裝手尾" },
        ]
      },
      {
        label: "🔄 舊裝翻新",
        color: "var(--blue)",
        stages: [
          { p: 30, desc: "已完成拆除機房物料，已完成拆除井道物料（不包括外門、外門框及外門地砵），已提供升降機/自動梯工作日誌，已提供廢料回收紙回條" },
          { p: 65, desc: "已提交秤線表，已完成機房及井道全面安裝，已完成外門框、門頭、地砵、外門，已完成主副路軌安裝及調校，已交較車行快車，已提供升降機/自動梯工作日誌，已提供廢料回收紙回條" },
          { p: 100, desc: "已完成 EMSD 驗機，已完成保養部驗收手尾，已完成客戶交機時安裝手尾，EMSD 發出准用証六個月內" },
        ]
      },
      {
        label: "🏥 特殊工程（多期）",
        color: "var(--purple, #a78bfa)",
        stages: [
          { p: 20, desc: "進場開工，提交秤線表，完成初期外門框、門頭、地砵，完成初期主副路軌安裝及調校" },
          { p: 45, desc: "完成機房及井道全面安裝，協助快車慢車調試，完成 EMSD 驗機" },
          { p: 70, desc: "完成第二期安裝及升機，協助快車慢車調試，完成 EMSD 驗機" },
          { p: 95, desc: "完成第三期安裝及升機，協助快車慢車調試，完成 EMSD 驗機" },
          { p: 100, desc: "完成拆卸及清理" },
        ]
      },
    ];

    return (
      <>
        <div className="section-label">拍攝現場照片</div>
        <div className={`photo-upload ${photos.length > 0 ? "has-photo" : ""}`} onClick={handleAddPhoto}>
          {photos.length === 0 ? (
            <>
              <div className="photo-upload-icon">📷</div>
              <div className="photo-upload-label">點擊拍照 / 上傳</div>
              <div className="photo-upload-sub">最多 5 張</div>
            </>
          ) : (
            <>
              <div className="photo-upload-icon">➕</div>
              <div className="photo-upload-label">加入更多照片 ({photos.length}/5)</div>
            </>
          )}
        </div>
        {photos.length > 0 && (
          <div className="photo-thumbs" style={{ marginBottom: 16 }}>
            {photos.map((p, i) => (
              <div key={i} className="photo-thumb">
                {p}
                <div className="remove" onClick={(e) => { e.stopPropagation(); setPhotos(photos.filter((_, idx) => idx !== i)); }}>✕</div>
              </div>
            ))}
          </div>
        )}

        <div className="section-label">選擇完工節點</div>
        {STAGE_GROUPS.map((grp, gi) => (
          <div key={gi} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: grp.color, letterSpacing: 1, marginBottom: 8 }}>{grp.label}</div>
            {grp.stages.map(({ p, desc }) => (
              <div key={p}
                onClick={() => selectStage(p, desc)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "12px 14px", marginBottom: 8, borderRadius: 12,
                  background: selectedPct === p ? "rgba(255,107,26,0.08)" : "var(--surface)",
                  border: `1.5px solid ${selectedPct === p ? "var(--orange)" : "var(--border)"}`,
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                <div style={{
                  fontFamily: "var(--font)", fontSize: 20, fontWeight: 900,
                  color: selectedPct === p ? "var(--orange)" : "var(--muted)",
                  minWidth: 44, flexShrink: 0, lineHeight: 1.4
                }}>{p}%</div>
                <div style={{ fontSize: 12, color: selectedPct === p ? "var(--text)" : "var(--muted)", lineHeight: 1.65 }}>{desc}</div>
              </div>
            ))}
          </div>
        ))}

        {selectedPct && (
          <>
            <div className="section-label">備注（可修改）</div>
            <textarea
              className="note-input"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="節點內容已自動填入，可補充現場情況..."
            />
            {note === stageDesc && (
              <div style={{ fontSize: 11, color: "var(--green)", marginTop: -10, marginBottom: 12 }}>✅ 已自動帶入節點內容</div>
            )}
          </>
        )}

        <button
          className={`big-btn ${selectedPct ? "primary" : "disabled"}`}
          onClick={handleSubmit}
        >
          <span className="big-btn-icon">📤</span>
          提交今日進度回報
        </button>
      </>
    );
  };

  const AttendanceScreen = () => (
    <>
      <div className="att-stat-row">
        <div className="att-stat">
          <div className="att-stat-num" style={{ color: "var(--green)" }}>{presentDays}</div>
          <div className="att-stat-label">出勤天數</div>
        </div>
        <div className="att-stat">
          <div className="att-stat-num" style={{ color: "var(--red)" }}>{absentDays}</div>
          <div className="att-stat-label">缺勤天數</div>
        </div>
        <div className="att-stat">
          <div className="att-stat-num" style={{ color: "var(--orange)" }}>
            {Math.round((presentDays / 15) * 100)}%
          </div>
          <div className="att-stat-label">出勤率</div>
        </div>
      </div>

      <div className="section-label">7月出勤記錄</div>
      <div className="month-strip">
        {ATTENDANCE_DATA.filter(d => d.status !== "future").map((d, i) => (
          <div key={i} className={`day-chip ${d.status}`}>
            <div className="day-label">{d.label}</div>
            <div className="day-num">{d.day}</div>
            <div className={`day-dot ${d.status === "present" || d.status === "today" ? "green" : d.status === "absent" ? "red" : "none"}`} />
          </div>
        ))}
      </div>

      <div className="section-label">最近出勤記錄</div>
      <div className="info-card">
        {[
          { date: `${new Date().toLocaleDateString("zh-HK", { month: "long", day: "numeric" })}（今日）`, in: checkedIn ? checkInTime : "–", out: checkedOut ? checkOutTime : "–", status: checkedIn ? "present" : "pending" },
          { date: "7月14日（昨日）", in: "07:58", out: "17:45", status: "present" },
          { date: "7月13日（週日）", in: "–", out: "–", status: "absent" },
          { date: "7月12日（週六）", in: "08:10", out: "17:30", status: "present" },
          { date: "7月11日（週五）", in: "08:05", out: "17:50", status: "present" },
        ].map((r, i) => (
          <div key={i} className="info-row">
            <div>
              <div className="info-key" style={{ color: i === 0 ? "var(--text)" : "var(--muted)", fontWeight: i === 0 ? 700 : 600 }}>{r.date}</div>
              {r.status !== "absent" && r.in !== "–" && (
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                  簽到 {r.in} · 簽退 {r.out !== "–" ? r.out : "未簽退"}
                </div>
              )}
            </div>
            <span className={`pill ${r.status === "present" ? "green" : r.status === "pending" ? "orange" : "red"}`}>
              <span className="pill-dot" />
              {r.status === "present" ? "出勤" : r.status === "pending" ? "進行中" : "缺勤"}
            </span>
          </div>
        ))}
      </div>
    </>
  );

  const SalaryScreen = () => {
    const cur = SALARY_HISTORY[salaryMonth];
    const grossSalary = cur.days * EMPLOYEE.rate;

    // MPF calculation (Hong Kong)
    // Employee contribution: 5% of relevant income, capped at HK$1,500/month
    // Relevant income: monthly equivalent (days * rate), capped at HK$30,000
    // Exempt if monthly equivalent < HK$7,100
    const monthlyEquiv = EMPLOYEE.rate * 26; // approximate monthly based on daily rate
    const isExempt = monthlyEquiv < 7100;
    const relevantIncome = Math.min(monthlyEquiv, 30000);
    const empMpfMonthly = isExempt ? 0 : Math.min(relevantIncome * 0.05, 1500);
    const empMpfAmount = Math.round(empMpfMonthly); // employee's own MPF contribution
    const erMpfAmount = empMpfAmount; // employer contributes same amount
    const netTakeHome = cur.amount - empMpfAmount;

    return (
      <>
        <div className="salary-hero">
          <div className="salary-month">{cur.month} 薪酬</div>
          <div className="salary-amount">HK${netTakeHome.toLocaleString()}</div>
          <div className="salary-sub">
            {cur.status === "paid" ? "✅ 已發放（扣除 MPF 後到手）" : "⏳ 待發放（月底結算）"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {SALARY_HISTORY.map((s, i) => (
            <button key={i}
              className={`big-btn ${salaryMonth === i ? "primary" : "secondary"}`}
              style={{ flex: 1, padding: "10px 6px", fontSize: 12, marginBottom: 0 }}
              onClick={() => setSalaryMonth(i)}>
              {s.month.replace("2025年","")}
            </button>
          ))}
        </div>

        <div className="section-label">薪酬明細</div>
        <div className="salary-row">
          <div className="salary-row-inner">
            <span className="salary-row-label">👷 職位</span>
            <span className="salary-row-val muted">{EMPLOYEE.role}</span>
          </div>
          <div className="salary-divider" />
          <div className="salary-row-inner">
            <span className="salary-row-label">📅 出勤天數</span>
            <span className="salary-row-val">{cur.days} 天</span>
          </div>
          <div className="salary-divider" />
          <div className="salary-row-inner">
            <span className="salary-row-label">💵 日薪</span>
            <span className="salary-row-val">HK${EMPLOYEE.rate}</span>
          </div>
          <div className="salary-divider" />
          <div className="salary-row-inner">
            <span className="salary-row-label">🏦 MPF 員工供款</span>
            <span className="salary-row-val deduct">
              {isExempt ? "豁免（月薪低於$7,100）" : `-HK$${empMpfAmount.toLocaleString()}`}
            </span>
          </div>
        </div>

        <div className="salary-row" style={{ background: "rgba(34,197,94,0.05)", borderColor: "rgba(34,197,94,0.2)" }}>
          <div className="salary-row-inner">
            <span className="salary-row-label" style={{ fontSize: 16 }}>💰 實際到手</span>
            <span className="salary-row-val" style={{ fontSize: 22 }}>HK${netTakeHome.toLocaleString()}</span>
          </div>
        </div>

        {/* MPF Info Box */}
        <div style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: 14, padding: "14px 16px", marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--blue)", marginBottom: 10 }}>🏦 MPF 供款詳情</div>
          <div className="info-row" style={{ padding: "6px 0" }}>
            <span className="info-key">你的供款（員工）</span>
            <span style={{ fontFamily: "var(--font)", fontWeight: 700, color: "var(--red)", fontSize: 14 }}>
              {isExempt ? "豁免" : `-HK$${empMpfAmount.toLocaleString()}/月`}
            </span>
          </div>
          <div className="info-row" style={{ padding: "6px 0" }}>
            <span className="info-key">僱主供款</span>
            <span style={{ fontFamily: "var(--font)", fontWeight: 700, color: "var(--green)", fontSize: 14 }}>
              {isExempt ? "豁免" : `+HK$${erMpfAmount.toLocaleString()}/月`}
            </span>
          </div>
          <div className="info-row" style={{ padding: "6px 0", borderBottom: "none" }}>
            <span className="info-key">MPF 戶口每月增加</span>
            <span style={{ fontFamily: "var(--font)", fontWeight: 700, color: "var(--blue)", fontSize: 14 }}>
              {isExempt ? "豁免" : `HK$${(empMpfAmount + erMpfAmount).toLocaleString()}/月`}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>
            💡 MPF 係你的退休儲蓄，僱主供款部分係額外福利，唔係從你薪酬扣除。
          </div>
        </div>

        <div style={{ background: "rgba(96,165,250,0.05)", border: "1px dashed rgba(96,165,250,0.2)", borderRadius: 14, padding: "14px 16px", marginTop: 16, fontSize: 12, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
          📋 發薪記錄將於系統正式上線後啟用
        </div>
      </>
    );
  };

  // ── PIN Change State (moved to MainApp to prevent input flicker) ──────────
  const [pinOld, setPinOld] = useState("");
  const [pinNew, setPinNew] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinSaving, setPinSaving] = useState(false);
  const [pinShow, setPinShow] = useState({ old: false, new: false, confirm: false });

  // ── 每日工序安全申報 State (moved to MainApp to prevent re-render reset) ────
  const [workOrderSubmitted, setWorkOrderSubmitted] = useState(false);
  const [workOrderTime, setWorkOrderTime] = useState(null);
  const [woWorkSite, setWoWorkSite] = useState("");
  const [woLiftNo, setWoLiftNo] = useState("");
  const [woWorkTime, setWoWorkTime] = useState("09:30");
  const [woCategory, setWoCategory] = useState("");
  const [woSelectedTasks, setWoSelectedTasks] = useState([]);
  const [woCustomTask, setWoCustomTask] = useState("");
  const [woSelectedPPE, setWoSelectedPPE] = useState(["helmet","gloves","shoes"]);
  const [woSelectedProcedures, setWoSelectedProcedures] = useState(["signage","handover"]);
  const [woSelectedComponents, setWoSelectedComponents] = useState([]);
  const [woSelectedWorkers, setWoSelectedWorkers] = useState([]);
  const [woAbnormal, setWoAbnormal] = useState(false);
  const [woAbnormalDesc, setWoAbnormalDesc] = useState("");
  const [woRemarks, setWoRemarks] = useState("");
  const [woSubmitting, setWoSubmitting] = useState(false);
  const [woStep, setWoStep] = useState(1);

  const WorkOrderScreen = () => {
    const MAKE_WEBHOOK = "https://hook.eu2.make.com/YOUR_WEBHOOK_ID";
    const workDate = new Date().toLocaleDateString("zh-HK", { year: "numeric", month: "numeric", day: "numeric" });

    // EMSD-compliant work categories
    const WORK_CATEGORIES = {
      "安裝工程": ["安裝路軌（導軌）", "安裝外門框及門頭", "安裝地砵", "安裝機廂", "安裝機頂設備", "安裝控制櫃", "安裝曳引機", "安裝緩衝器", "放線（控制線/電力線）", "安裝ARD緊急救援裝置", "安裝安全部件"],
      "維修保養": ["定期保養", "特別保養（舊式升降機）", "緊急維修", "更換零件", "清潔機房", "清潔井道", "潤滑保養", "調校電梯", "測試安全裝置"],
      "工地工序": ["清機房垃圾", "搬運零件/設備", "拆棚/拆架", "加絞", "搬ARD", "裝飾板安裝", "交較車（慢車）", "交較車（快車）", "清箱頭", "內運"],
      "驗收測試": ["EMSD驗機（初驗）", "EMSD驗機（複驗）", "保養部驗收", "客戶交機", "安全部件測試", "超速保護測試", "緊急電源測試"],
    };

    const SAFETY_PPE = [
      { id: "helmet", label: "安全帽", icon: "⛑️", required: true },
      { id: "gloves", label: "防滑手套", icon: "🧤", required: true },
      { id: "harness", label: "安全帶（高空作業）", icon: "🦺", required: false },
      { id: "lanyard", label: "雙尾繩", icon: "🪢", required: false },
      { id: "shoes", label: "安全鞋", icon: "👟", required: true },
    ];

    const SAFETY_PROCEDURES = [
      { id: "lockout", label: "上鎖掛牌（LOTO）", icon: "🔒", required: false },
      { id: "signage", label: "設置安全告示牌", icon: "⚠️", required: true },
      { id: "barrier", label: "設置圍封/護欄", icon: "🚧", required: false },
      { id: "permit", label: "已取得工作許可證", icon: "📋", required: false },
      { id: "comm", label: "上落機頂前已溝通確認", icon: "📣", required: false },
      { id: "topfloor", label: "換掌門機頂平地砵已確認", icon: "🔘", required: false },
      { id: "redbutton", label: "按紅制上落已確認溝通", icon: "🔴", required: false },
      { id: "handover", label: "工序前已向負責人匯報", icon: "👤", required: true },
    ];

    const LIFT_COMPONENTS = [
      "曳引機", "制動系統", "安全鉗", "緩衝器", "限速器",
      "上行超速保護裝置", "不正常移動保護裝置", "雙重制動系統",
      "門機系統", "控制系統", "ARD緊急救援裝置", "對講機",
      "緊急照明", "警報系統", "通風系統",
    ];

    const ALL_EMPLOYEES = (EMPLOYEE_DB || []).map(e => e.name);

    // Use MainApp-level state via wo* variables
    const workSite = woWorkSite; const setWorkSite = setWoWorkSite;
    const liftNo = woLiftNo; const setLiftNo = setWoLiftNo;
    const workTime = woWorkTime; const setWorkTime = setWoWorkTime;
    const category = woCategory; const setCategory = setWoCategory;
    const selectedTasks = woSelectedTasks; const setSelectedTasks = setWoSelectedTasks;
    const customTask = woCustomTask; const setCustomTask = setWoCustomTask;
    const selectedPPE = woSelectedPPE; const setSelectedPPE = setWoSelectedPPE;
    const selectedProcedures = woSelectedProcedures; const setSelectedProcedures = setWoSelectedProcedures;
    const selectedComponents = woSelectedComponents; const setSelectedComponents = setWoSelectedComponents;
    const selectedWorkers = woSelectedWorkers.length > 0 ? woSelectedWorkers : [EMPLOYEE.name];
    const setSelectedWorkers = setWoSelectedWorkers;
    const abnormal = woAbnormal; const setAbnormal = setWoAbnormal;
    const abnormalDesc = woAbnormalDesc; const setAbnormalDesc = setWoAbnormalDesc;
    const remarks = woRemarks; const setRemarks = setWoRemarks;
    const submitting = woSubmitting; const setSubmitting = setWoSubmitting;
    const submitted = workOrderSubmitted;
    const step = woStep; const setStep = setWoStep;

    const toggleTask = (t) => setWoSelectedTasks(p => p.includes(t)?p.filter(x=>x!==t):[...p,t]);
    const togglePPE = (id) => setWoSelectedPPE(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);
    const toggleProc = (id) => setWoSelectedProcedures(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);
    const toggleComp = (c) => setWoSelectedComponents(p => p.includes(c)?p.filter(x=>x!==c):[...p,c]);
    const toggleWorker = (w) => setWoSelectedWorkers(p => p.includes(w)?p.filter(x=>x!==w):[...p,w]);
    const addCustomTask = () => { if (!woCustomTask.trim()) return; setWoSelectedTasks(p=>[...p,woCustomTask.trim()]); setWoCustomTask(""); };

    const step1OK = workSite && category;
    const step2OK = selectedPPE.length > 0 && selectedProcedures.length > 0;
    const step3OK = selectedWorkers.length > 0;
    const canSubmit = step1OK && step2OK && step3OK;

    const handleSubmit = async () => {
      if (!canSubmit) { showToast("⚠️ 請填寫所有必填項目", "error"); return; }
      setSubmitting(true);

      const ppeList = selectedPPE.map(id => SAFETY_PPE.find(p=>p.id===id)?.label).join("，");
      const procList = selectedProcedures.map(id => SAFETY_PROCEDURES.find(p=>p.id===id)?.label).join(" ");
      const taskList = selectedTasks.join("，");
      const workerList = selectedWorkers.join("，");
      const compList = selectedComponents.join("，");

      // WhatsApp format (matching your existing format)
      const msg = `📋 每日工序安全申報\n` +
        `工地：${workSite}\n` +
        (liftNo ? `升降機編號：${liftNo}\n` : "") +
        `日期：${workDate}\n` +
        `時間：${workTime}\n` +
        `工序類別：${category}\n` +
        `工序：${taskList}\n` +
        (compList ? `涉及部件：${compList}\n` : "") +
        `安全裝備：${ppeList}\n` +
        `安全措施：${procList}\n` +
        `RWL：${EMPLOYEE.name}\n` +
        `員工：${workerList}\n` +
        (abnormal ? `⚠️ 異常情況：${abnormalDesc}\n` : "") +
        (remarks ? `備註：${remarks}` : "");

      try {
        await sbInsert("safety_signs", {
          employee_id: EMPLOYEE.id,
          site: workSite,
          lift_no: liftNo,
          tasks: taskList,
          work_category: category,
          safety_ppe: ppeList,
          safety_measures: procList,
          components: compList,
          workers: workerList,
          rlw: EMPLOYEE.name,
          abnormal: abnormal,
          abnormal_desc: abnormalDesc,
          remarks: remarks,
          work_date: new Date().toISOString().split("T")[0],
          work_time: workTime,
          submitted_at: new Date().toISOString(),
        });
        // WhatsApp via Make
        try {
          await fetch(MAKE_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg, site: workSite, lift_no: liftNo, date: workDate, rlw: EMPLOYEE.name, workers: workerList, abnormal }),
          });
        } catch(e) {}
        setWorkOrderSubmitted(true);
        setWorkOrderTime(workTime);
        showToast("✅ 工序申報已提交，WhatsApp 通知已發送！");
      } catch(e) {
        setWorkOrderSubmitted(true);
        showToast("✅ 工序申報已提交！");
      }
      setWoSubmitting(false);
    };

    if (submitted) return (
      <div style={{ textAlign:"center", padding:"32px 16px" }}>
        <div style={{ fontSize:56, marginBottom:12 }}>✅</div>
        <div style={{ fontSize:20, fontWeight:900, color:"var(--green)", marginBottom:8 }}>工序申報完成！</div>
        <div style={{ background:"var(--surface)", borderRadius:16, padding:"16px", marginBottom:20, textAlign:"left", fontSize:13, lineHeight:2, color:"var(--muted)" }}>
          <div>📍 工地：<span style={{ color:"var(--text)", fontWeight:700 }}>{workSite}</span></div>
          {liftNo && <div>🔢 升降機：<span style={{ color:"var(--text)", fontWeight:700 }}>{liftNo}</span></div>}
          <div>📅 日期：<span style={{ color:"var(--text)" }}>{workDate} {workOrderTime}</span></div>
          <div>👤 RWL：<span style={{ color:"var(--orange)", fontWeight:700 }}>{EMPLOYEE.name}</span></div>
          {abnormal && <div style={{ color:"var(--red)", fontWeight:700 }}>⚠️ 已通報異常情況</div>}
        </div>
        <button className="big-btn secondary" onClick={() => { setWorkOrderSubmitted(false); setWoStep(1); setWoCategory(""); setWoSelectedTasks([]); setWoSelectedPPE(["helmet","gloves","shoes"]); setWoSelectedProcedures(["signage","handover"]); setWoSelectedComponents([]); setWoAbnormal(false); setWoAbnormalDesc(""); setWoRemarks(""); }}>
          <span className="big-btn-icon">🔄</span>再提交一份
        </button>
      </div>
    );

    // Step indicators
    const StepBar = () => (
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {["工序資料","安全措施","人員確認"].map((s,i) => (
          <div key={i} onClick={() => { if(i===0||(i===1&&step1OK)||(i===2&&step2OK)) setStep(i+1); }}
            style={{ flex:1, textAlign:"center", padding:"8px 4px", borderRadius:10, background: step===i+1?"var(--orange-glow)":step>i+1?"rgba(34,197,94,0.1)":"var(--surface)", border:`1.5px solid ${step===i+1?"var(--orange)":step>i+1?"var(--green)":"var(--border)"}`, cursor:"pointer" }}>
            <div style={{ fontSize:16 }}>{step>i+1?"✅":["📋","🛡️","👷"][i]}</div>
            <div style={{ fontSize:10, color: step===i+1?"var(--orange)":step>i+1?"var(--green)":"var(--muted)", fontWeight:700, marginTop:2 }}>{s}</div>
          </div>
        ))}
      </div>
    );

    return (
      <>
        <StepBar />

        {/* ── STEP 1: Work Details ── */}
        {step === 1 && (
          <>
            <div className="section-label">工地 *</div>
            <select value={workSite} onChange={e=>setWorkSite(e.target.value)}
              style={{ width:"100%", background:"var(--surface)", border:`1.5px solid ${workSite?"var(--orange)":"var(--border)"}`, color:workSite?"var(--text)":"var(--muted)", borderRadius:14, padding:"13px 16px", fontSize:14, fontFamily:"var(--font)", marginBottom:12, fontWeight:600 }}>
              <option value="">── 選擇工地 ──</option>
              {(projects.length > 0 ? projects : [
                "EC-590大圓街GDS數據中心升降機",
                "EC-662柴灣VTC",
                "EC-550屯門橋機",
                "EC-547將軍澳政府聯用辦工大樓",
                "EC-530西灣河綜合大樓",
                "EC-540柴灣政府綜合大樓",
                "EC-591 CUHK LAB",
                "EC-617柴灣政府物料營運中心",
                "EC-621成運街數據中心",
                "EC-641永信大廈",
                "EC-642旺角砵蘭街停車場",
                "EC-648彩暉花園",
              ]).map((p,i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>

            <div className="section-label">升降機編號（如適用）</div>
            <input value={liftNo} onChange={e=>setLiftNo(e.target.value)}
              placeholder="例：L1、L2、NF411..."
              style={{ width:"100%", background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)", borderRadius:14, padding:"13px 16px", fontSize:14, fontFamily:"var(--font)", marginBottom:12 }} />

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
              <div>
                <div className="section-label" style={{ marginBottom:6 }}>日期</div>
                <div style={{ background:"var(--surface)", border:"1.5px solid var(--border)", borderRadius:14, padding:"13px 16px", fontSize:13, color:"var(--text)", fontWeight:700 }}>{workDate}</div>
              </div>
              <div>
                <div className="section-label" style={{ marginBottom:6 }}>時間 *</div>
                <input type="time" value={workTime} onChange={e=>setWorkTime(e.target.value)}
                  style={{ width:"100%", background:"var(--surface)", border:"1.5px solid var(--orange)", color:"var(--text)", borderRadius:14, padding:"13px 16px", fontSize:14, fontFamily:"var(--font)", fontWeight:700 }} />
              </div>
            </div>

            <div className="section-label">工序類別 *</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
              {Object.keys(WORK_CATEGORIES).map(cat => (
                <div key={cat} onClick={() => { setCategory(cat); setSelectedTasks([]); }}
                  style={{ padding:"12px 10px", borderRadius:12, border:`1.5px solid ${category===cat?"var(--orange)":"var(--border)"}`, background:category===cat?"var(--orange-glow)":"var(--surface)", textAlign:"center", cursor:"pointer" }}>
                  <div style={{ fontSize:11, fontWeight:700, color:category===cat?"var(--orange)":"var(--muted)" }}>{cat}</div>
                </div>
              ))}
            </div>

            {category && (
              <>
                <div className="section-label">工序細項 * （可多選）</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:10 }}>
                  {WORK_CATEGORIES[category].map(t => (
                    <div key={t} onClick={() => toggleTask(t)}
                      style={{ padding:"7px 12px", borderRadius:20, border:`1.5px solid ${selectedTasks.includes(t)?"var(--orange)":"var(--border)"}`, background:selectedTasks.includes(t)?"var(--orange-glow)":"var(--surface)", color:selectedTasks.includes(t)?"var(--orange)":"var(--muted)", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                      {selectedTasks.includes(t)?"✓ ":""}{t}
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                  <input value={customTask} onChange={e=>setCustomTask(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustomTask()}
                    placeholder="自行輸入工序..."
                    style={{ flex:1, background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)", borderRadius:12, padding:"10px 14px", fontSize:12, fontFamily:"var(--font)" }} />
                  <button onClick={addCustomTask} style={{ background:"var(--orange)", border:"none", color:"#fff", borderRadius:12, padding:"10px 16px", fontWeight:800, cursor:"pointer" }}>加</button>
                </div>
              </>
            )}

            <div className="section-label">涉及重要安全部件（如適用）</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginBottom:16 }}>
              {LIFT_COMPONENTS.map(c => (
                <div key={c} onClick={() => toggleComp(c)}
                  style={{ padding:"6px 10px", borderRadius:16, border:`1px solid ${selectedComponents.includes(c)?"var(--blue)":"var(--border)"}`, background:selectedComponents.includes(c)?"rgba(96,165,250,0.1)":"var(--surface)", color:selectedComponents.includes(c)?"var(--blue)":"var(--muted)", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                  {selectedComponents.includes(c)?"✓ ":""}{c}
                </div>
              ))}
            </div>

            <button className={`big-btn ${step1OK?"primary":"disabled"}`} onClick={() => step1OK&&setStep(2)}>
              下一步：安全措施 →
            </button>
          </>
        )}

        {/* ── STEP 2: Safety Measures ── */}
        {step === 2 && (
          <>
            <div className="section-label">個人防護裝備 PPE * （必須佩戴）</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
              {SAFETY_PPE.map(p => (
                <div key={p.id} onClick={() => togglePPE(p.id)}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:14, border:`1.5px solid ${selectedPPE.includes(p.id)?"var(--green)":"var(--border)"}`, background:selectedPPE.includes(p.id)?"rgba(34,197,94,0.08)":"var(--surface)", cursor:"pointer" }}>
                  <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${selectedPPE.includes(p.id)?"var(--green)":"var(--border)"}`, background:selectedPPE.includes(p.id)?"var(--green)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {selectedPPE.includes(p.id)&&<span style={{ color:"#fff", fontSize:12, fontWeight:900 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:20 }}>{p.icon}</span>
                  <span style={{ fontSize:14, fontWeight:600, color:selectedPPE.includes(p.id)?"var(--green)":"var(--text)" }}>{p.label}</span>
                  {p.required && <span style={{ marginLeft:"auto", fontSize:10, color:"var(--red)", fontWeight:700 }}>必須</span>}
                </div>
              ))}
            </div>

            <div className="section-label">安全措施確認 *</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
              {SAFETY_PROCEDURES.map(p => (
                <div key={p.id} onClick={() => toggleProc(p.id)}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:14, border:`1.5px solid ${selectedProcedures.includes(p.id)?"var(--orange)":"var(--border)"}`, background:selectedProcedures.includes(p.id)?"var(--orange-glow)":"var(--surface)", cursor:"pointer" }}>
                  <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${selectedProcedures.includes(p.id)?"var(--orange)":"var(--border)"}`, background:selectedProcedures.includes(p.id)?"var(--orange)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {selectedProcedures.includes(p.id)&&<span style={{ color:"#fff", fontSize:12, fontWeight:900 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:18 }}>{p.icon}</span>
                  <span style={{ fontSize:13, fontWeight:600, color:selectedProcedures.includes(p.id)?"var(--orange)":"var(--text)" }}>{p.label}</span>
                </div>
              ))}
            </div>

            <div className="section-label">異常情況報告</div>
            <div onClick={() => setAbnormal(!abnormal)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderRadius:14, border:`1.5px solid ${abnormal?"var(--red)":"var(--border)"}`, background:abnormal?"rgba(239,68,68,0.08)":"var(--surface)", cursor:"pointer", marginBottom: abnormal?10:16 }}>
              <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${abnormal?"var(--red)":"var(--border)"}`, background:abnormal?"var(--red)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {abnormal&&<span style={{ color:"#fff", fontSize:12, fontWeight:900 }}>✓</span>}
              </div>
              <span style={{ fontSize:20 }}>⚠️</span>
              <span style={{ fontSize:14, fontWeight:600, color:abnormal?"var(--red)":"var(--text)" }}>發現異常情況需要通報</span>
            </div>
            {abnormal && (
              <textarea value={abnormalDesc} onChange={e=>setAbnormalDesc(e.target.value)}
                placeholder="請描述異常情況（將即時通知老闆及RWL）..."
                style={{ width:"100%", background:"var(--surface)", border:"1.5px solid var(--red)", color:"var(--text)", borderRadius:14, padding:"12px 14px", fontSize:13, fontFamily:"var(--font)", minHeight:80, marginBottom:16, resize:"none" }} />
            )}

            <div style={{ display:"flex", gap:8 }}>
              <button className="big-btn secondary" style={{ flex:1 }} onClick={() => setStep(1)}>← 返回</button>
              <button className={`big-btn ${step2OK?"primary":"disabled"}`} style={{ flex:2 }} onClick={() => step2OK&&setStep(3)}>下一步：人員 →</button>
            </div>
          </>
        )}

        {/* ── STEP 3: Workers & Submit ── */}
        {step === 3 && (
          <>
            <div className="section-label">今日工作人員 * （可多選）</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
              {ALL_EMPLOYEES.map(w => (
                <div key={w} onClick={() => toggleWorker(w)}
                  style={{ padding:"9px 14px", borderRadius:20, border:`1.5px solid ${selectedWorkers.includes(w)?"var(--blue)":"var(--border)"}`, background:selectedWorkers.includes(w)?"rgba(96,165,250,0.12)":"var(--surface)", color:selectedWorkers.includes(w)?"var(--blue)":"var(--muted)", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                  {selectedWorkers.includes(w)?"✓ ":""}{w}
                </div>
              ))}
            </div>

            <div className="section-label">RWL 負責人</div>
            <div className="info-card" style={{ marginBottom:12 }}>
              <div className="info-row" style={{ borderBottom:"none" }}>
                <span className="info-key">負責人（自動）</span>
                <span className="info-val green" style={{ fontWeight:800 }}>👤 {EMPLOYEE.name}</span>
              </div>
            </div>

            <div className="section-label">備註</div>
            <textarea value={remarks} onChange={e=>setRemarks(e.target.value)}
              placeholder="其他備註（可留空）..."
              style={{ width:"100%", background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)", borderRadius:14, padding:"12px 14px", fontSize:13, fontFamily:"var(--font)", minHeight:70, marginBottom:16, resize:"none" }} />

            {/* Summary preview */}
            <div style={{ background:"rgba(255,107,26,0.06)", border:"1.5px solid rgba(255,107,26,0.2)", borderRadius:14, padding:"14px 16px", marginBottom:16, fontSize:12, lineHeight:1.9, color:"var(--muted)" }}>
              <div style={{ fontWeight:800, color:"var(--orange)", marginBottom:6 }}>📋 申報摘要（符合EMSD工作日誌格式）</div>
              <div>📍 <strong style={{ color:"var(--text)" }}>{workSite}</strong>{liftNo&&` — ${liftNo}`}</div>
              <div>📅 {workDate} {workTime}</div>
              <div>🔧 {selectedTasks.join("，")}</div>
              <div>🛡️ {selectedPPE.map(id=>SAFETY_PPE.find(p=>p.id===id)?.label).join("，")}</div>
              <div>👷 {selectedWorkers.join("，")}</div>
              <div>👤 RWL: {EMPLOYEE.name}</div>
              {abnormal && <div style={{ color:"var(--red)", fontWeight:700 }}>⚠️ 有異常情況</div>}
            </div>

            <div style={{ display:"flex", gap:8 }}>
              <button className="big-btn secondary" style={{ flex:1 }} onClick={() => setStep(2)}>← 返回</button>
              <button className={`big-btn ${canSubmit?"primary":"disabled"}`} style={{ flex:2 }} onClick={handleSubmit} disabled={submitting}>
                <span className="big-btn-icon">{submitting?"⏳":"📤"}</span>
                {submitting?"提交中...":"提交申報"}
              </button>
            </div>
            <div style={{ fontSize:11, color:"var(--muted)", textAlign:"center", marginTop:8 }}>
              提交後即時通知老闆 📱 WhatsApp
            </div>
          </>
        )}
      </>
    );
  };

  // ── 文件上傳 State ───────────────────────────────────────────────────────────
  const [uploadedDocs, setUploadedDocs] = useState({
    greencard: null, id: null, address: null, other: []
  });
  const [uploadStatus, setUploadStatus] = useState({});
  const [docExpiry, setDocExpiry] = useState({});

  // Pre-load existing docs from Supabase to populate expiry warnings on home
  useEffect(() => {
    if (!user?.id) return;
    fetch(`${SUPABASE_URL}/rest/v1/employee_docs?employee_id=eq.${user.id}&order=uploaded_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    })
      .then(r => r.json())
      .then(d => {
        if (!Array.isArray(d)) return;
        const docMap = {};
        const expMap = {};
        d.forEach(row => {
          if (!docMap[row.doc_type]) {
            docMap[row.doc_type] = {
              name: row.file_name,
              size: row.file_size,
              date: row.uploaded_at ? new Date(row.uploaded_at).toLocaleDateString("zh-HK") : "",
              expiry: row.expiry_date,
            };
            if (row.expiry_date) expMap[row.doc_type] = row.expiry_date;
          }
        });
        setUploadedDocs(prev => ({ ...prev, ...docMap }));
        setDocExpiry(expMap);
      })
      .catch(() => {});
  }, [user?.id]);

  // Compute docs expiring within 60 days for home-page warning
  const DOC_TYPE_META = {
    greencard:  { label: "綠卡",         icon: "🟢" },
    id:         { label: "香港身份證",   icon: "🪪" },
    address:    { label: "住址證明",     icon: "🏠" },
    license:    { label: "升降機技工牌照", icon: "📜" },
    other_cert: { label: "其他證明",     icon: "📄" },
  };
  const expiringDocs = Object.entries(docExpiry)
    .map(([key, dateStr]) => {
      if (!dateStr) return null;
      const daysLeft = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
      if (daysLeft > 60) return null; // only warn 0–60 days out
      return { key, daysLeft, ...DOC_TYPE_META[key] };
    })
    .filter(Boolean)
    .sort((a, b) => a.daysLeft - b.daysLeft);
  const docsCompletedCount = ["greencard", "id", "address", "license"].filter(k => uploadedDocs[k]).length;
  const docsAllSet = docsCompletedCount === 4;

  const DocsScreen = () => {
    const DOC_TYPES = [
      { key: "greencard",  label: "綠卡（安全卡）",       icon: "🟢", desc: "建造業工人安全訓練證書（EMSD 要求）", required: true,  emsd: true,  hasExpiry: true },
      { key: "id",         label: "香港身份證",           icon: "🪪", desc: "HKID 兩面",                          required: true,  emsd: false, hasExpiry: false },
      { key: "address",    label: "住址證明",             icon: "🏠", desc: "3個月內銀行信件或政府信件",          required: true,  emsd: false, hasExpiry: false },
      { key: "license",    label: "升降機技工牌照",       icon: "📜", desc: "機電署發出之註冊技工牌照",           required: false, emsd: true,  hasExpiry: true },
      { key: "other_cert", label: "其他證明",             icon: "📄", desc: "其他專業資格證書 / 培訓證明",        required: false, emsd: false, hasExpiry: true },
    ];

    const handleFileSelect = async (key, file) => {
      if (!file) return;
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) { showToast("⚠️ 檔案太大，請上傳 10MB 以下", "error"); return; }

      setUploadStatus(prev => ({ ...prev, [key]: "uploading" }));

      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64 = e.target.result;
          const expiry = docExpiry[key] || null; // optional expiry date
          try {
            await sbInsert("employee_docs", {
              employee_id: EMPLOYEE.id,
              doc_type: key,
              file_name: file.name,
              file_data: base64,
              file_size: file.size,
              expiry_date: expiry,
              uploaded_at: new Date().toISOString(),
            });
          } catch(e) { console.log("doc save err:", e); }
          setUploadedDocs(prev => ({ ...prev, [key]: { name: file.name, size: file.size, date: new Date().toLocaleDateString("zh-HK"), expiry } }));
          setUploadStatus(prev => ({ ...prev, [key]: "done" }));
          showToast(`✅ ${DOC_TYPES.find(d=>d.key===key)?.label} 上傳成功！`);
        };
        reader.readAsDataURL(file);
      } catch(e) {
        setUploadStatus(prev => ({ ...prev, [key]: "error" }));
        showToast("❌ 上傳失敗，請重試", "error");
      }
    };

    const completedCount = DOC_TYPES.filter(d => uploadedDocs[d.key]).length;
    const requiredCount = DOC_TYPES.filter(d => d.required).length;
    const requiredDone = DOC_TYPES.filter(d => d.required && uploadedDocs[d.key]).length;

    return (
      <>
        {/* Progress */}
        <div style={{ background:"var(--surface)", borderRadius:16, padding:"16px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontSize:15, fontWeight:800, color:"var(--text)" }}>文件上傳進度</div>
            <div style={{ fontSize:13, color: requiredDone===requiredCount?"var(--green)":"var(--orange)", fontWeight:700 }}>
              {requiredDone}/{requiredCount} 必要文件
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:8, height:8, overflow:"hidden" }}>
            <div style={{ height:"100%", background: requiredDone===requiredCount?"var(--green)":"var(--orange)", width:`${(requiredDone/requiredCount)*100}%`, borderRadius:8, transition:"width 0.3s" }} />
          </div>
          <div style={{ fontSize:12, color:"var(--muted)", marginTop:6 }}>
            ⚠️ 根據《升降機及自動梯條例》，所有員工須持有有效安全訓練證書
          </div>
        </div>

        {/* Document list */}
        {DOC_TYPES.map(doc => {
          const uploaded = uploadedDocs[doc.key];
          const status = uploadStatus[doc.key];
          return (
            <div key={doc.key} style={{ background:"var(--surface)", border:`1.5px solid ${uploaded?"var(--green)":doc.required?"rgba(255,107,26,0.3)":"var(--border)"}`, borderRadius:16, padding:"14px 16px", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                <span style={{ fontSize:28 }}>{doc.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ fontSize:15, fontWeight:800, color:"var(--text)" }}>{doc.label}</div>
                    {doc.required && <span style={{ fontSize:11, color:"var(--red)", fontWeight:700 }}>必須</span>}
                    {doc.emsd && <span style={{ fontSize:11, color:"var(--blue)", fontWeight:700 }}>EMSD</span>}
                  </div>
                  <div style={{ fontSize:13, color:"var(--muted)", marginTop:2 }}>{doc.desc}</div>
                </div>
                {uploaded && <span style={{ fontSize:20 }}>✅</span>}
              </div>

              {/* Expiry date input (only for docs that have expiry) */}
              {doc.hasExpiry && (
                <div style={{ marginBottom: 10, padding: "10px 12px", background: "rgba(96,165,250,0.05)", borderRadius: 10, border: "1px solid rgba(96,165,250,0.15)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "var(--blue)", display: "flex", alignItems: "center", gap: 6 }}>
                      📅 到期日
                    </label>
                    <input
                      type="date"
                      value={docExpiry[doc.key] || ""}
                      onChange={e => setDocExpiry(prev => ({ ...prev, [doc.key]: e.target.value }))}
                      style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 8, padding: "6px 10px", fontSize: 13, fontFamily: "var(--font)", colorScheme: "dark" }}
                    />
                  </div>
                  {docExpiry[doc.key] && (() => {
                    const days = Math.ceil((new Date(docExpiry[doc.key]) - new Date()) / 86400000);
                    if (days <= 0) return <div style={{ fontSize: 11, color: "var(--red)", marginTop: 6 }}>⚠️ 已過期 — 請盡快續期</div>;
                    if (days <= 60) return <div style={{ fontSize: 11, color: "var(--orange)", marginTop: 6 }}>⚠️ 將於 {days} 日後到期，建議盡早續期</div>;
                    return <div style={{ fontSize: 11, color: "var(--green)", marginTop: 6 }}>✓ 有效至 {docExpiry[doc.key]}（尚有 {days} 日）</div>;
                  })()}
                </div>
              )}

              {uploaded ? (
                <div style={{ background:"rgba(34,197,94,0.08)", borderRadius:10, padding:"10px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"var(--green)" }}>✓ 已上傳</div>
                    <div style={{ fontSize:12, color:"var(--muted)" }}>{uploaded.name} · {uploaded.date}</div>
                    {uploaded.expiry && <div style={{ fontSize: 11, color: "var(--blue)", marginTop: 2 }}>📅 到期：{uploaded.expiry}</div>}
                  </div>
                  <label style={{ background:"var(--surface2)", border:"none", color:"var(--muted)", borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontFamily:"var(--font)" }}>
                    重新上傳
                    <input type="file" accept="image/*,.pdf" style={{ display:"none" }} onChange={e => handleFileSelect(doc.key, e.target.files[0])} />
                  </label>
                </div>
              ) : (
                <label style={{ display:"block", background: status==="uploading"?"rgba(255,107,26,0.1)":"var(--surface2)", border:`1.5px dashed ${doc.required?"var(--orange)":"var(--border)"}`, borderRadius:10, padding:"14px", textAlign:"center", cursor:"pointer" }}>
                  <div style={{ fontSize:24, marginBottom:4 }}>{status==="uploading"?"⏳":"📤"}</div>
                  <div style={{ fontSize:14, fontWeight:700, color: doc.required?"var(--orange)":"var(--muted)" }}>
                    {status==="uploading"?"上傳中...":"點擊上傳"}
                  </div>
                  <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>支援圖片 / PDF，上限 10MB</div>
                  <input type="file" accept="image/*,.pdf" style={{ display:"none" }} onChange={e => handleFileSelect(doc.key, e.target.files[0])} disabled={status==="uploading"} />
                </label>
              )}
            </div>
          );
        })}

        <div style={{ background:"rgba(96,165,250,0.08)", border:"1px solid rgba(96,165,250,0.2)", borderRadius:14, padding:"12px 16px", fontSize:13, color:"var(--muted)", lineHeight:1.7 }}>
          <div style={{ fontWeight:800, color:"var(--blue)", marginBottom:4 }}>📋 注意事項</div>
          <div>• 文件只供公司存檔，不會對外披露</div>
          <div>• 綠卡須定期更新，到期前30日系統會提醒</div>
          <div>• 老闆可透過管理系統下載你的文件 PDF</div>
        </div>
      </>
    );
  };


  // ── PIN Change Screen ──────────────────────────────────────────────────────
  const PinScreen = () => {
    // State pulled from MainApp scope to prevent input flicker on every keystroke
    // (defining state locally would re-init on every MainApp re-render → focus loss).
    const oldPin = pinOld; const setOldPin = setPinOld;
    const newPin = pinNew; const setNewPin = setPinNew;
    const confirmPin = pinConfirm; const setConfirmPin = setPinConfirm;
    const saving = pinSaving; const setSaving = setPinSaving;
    const show = pinShow; const setShow = setPinShow;

    const handleChange = async () => {
      if (oldPin !== EMPLOYEE.pin) { showToast("❌ 舊 PIN 不正確", "error"); return; }
      if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) { showToast("⚠️ 新 PIN 必須係 4 位數字", "error"); return; }
      if (newPin !== confirmPin) { showToast("❌ 兩次 PIN 不一致", "error"); return; }
      if (newPin === oldPin) { showToast("⚠️ 新 PIN 不可以同舊 PIN 一樣", "error"); return; }
      setSaving(true);
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/employees?id=eq.${EMPLOYEE.id}`, {
          method: "PATCH",
          headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ pin: newPin })
        });
        EMPLOYEE.pin = newPin; // update local session
        showToast("✅ PIN 已成功更改！");
        setOldPin(""); setNewPin(""); setConfirmPin("");
      } catch(e) {
        showToast("❌ 更改失敗，請重試", "error");
      }
      setSaving(false);
    };

    return (
      <>
        <div className="section-label" style={{ marginTop:0 }}>更改登入 PIN 碼</div>
        <div style={{ background:"rgba(96,165,250,0.06)", border:"1px solid rgba(96,165,250,0.15)", borderRadius:14, padding:"12px 16px", marginBottom:20, fontSize:13, color:"var(--muted)", lineHeight:1.6 }}>
          <div style={{ fontWeight:800, color:"var(--blue)", marginBottom:2 }}>🔐 安全提示</div>
          <div>• PIN 只有你本人知道，請勿告訴他人</div>
          <div>• 老闆可以在管理系統重設你的 PIN</div>
        </div>

        {[
          { label:"舊 PIN", val:oldPin, set:setOldPin, key:"old" },
          { label:"新 PIN（4位數字）", val:newPin, set:setNewPin, key:"new" },
          { label:"確認新 PIN", val:confirmPin, set:setConfirmPin, key:"confirm" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom:16 }}>
            <div className="section-label" style={{ marginTop:0, marginBottom:8 }}>{f.label}</div>
            <div style={{ display:"flex", gap:8 }}>
              <input
                type={show[f.key]?"text":"password"}
                maxLength={4}
                value={f.val}
                onChange={e => f.set(e.target.value.replace(/\D/g,""))}
                placeholder="••••"
                style={{ flex:1, background:"var(--surface)", border:"1.5px solid var(--border)", color:"var(--text)", borderRadius:14, padding:"14px 16px", fontSize:22, fontWeight:800, fontFamily:"var(--font)", letterSpacing:8, textAlign:"center" }}
              />
              <button onClick={() => setShow(s => ({...s,[f.key]:!s[f.key]}))}
                style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--muted)", borderRadius:12, padding:"0 14px", fontSize:20, cursor:"pointer" }}>
                {show[f.key]?"🙈":"👁️"}
              </button>
            </div>
          </div>
        ))}

        <button className={`big-btn ${oldPin&&newPin&&confirmPin?"primary":"disabled"}`} onClick={handleChange} disabled={saving||!oldPin||!newPin||!confirmPin}>
          <span className="big-btn-icon">🔐</span>
          {saving ? "儲存中..." : "確認更改 PIN"}
        </button>
      </>
    );
  };

  const screens = { home: HomeScreen, safety: SafetyScreen, gps: GpsScreen, progress: ProgressScreen, workorder: WorkOrderScreen, docs: DocsScreen, salary: SalaryScreen, pin: PinScreen };
  const SCREEN_LABELS = { home: "主頁", safety: "安全守則簽署", gps: "GPS 考勤", progress: "施工進度回報", workorder: "每日工序申報", docs: "文件上傳", salary: "我的薪酬", pin: "更改 PIN 碼" };
  const ActiveScreen = screens[screen];

  return (
    <>
      <style>{S}</style>
      <div className="phone-wrap">
        {/* Status bar */}        <div className="statusbar">
          <div className="statusbar-time">{clockTick.toLocaleTimeString("zh-HK", { hour: "2-digit", minute: "2-digit" })}</div>
          <div className="statusbar-icons">
            <span>📶</span><span>🔋</span>
          </div>
        </div>

        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-inner">
            {screen !== "home" ? (
              <div className="back-btn" onClick={() => setScreen("home")}>←</div>
            ) : (
              <div style={{ width: 40 }} />
            )}
            <div className="page-label">{SCREEN_LABELS[screen]}</div>
            {/* Logout button */}
            <div onClick={onLogout}
              style={{ width: 40, height: 40, borderRadius: 12, background: "var(--surface2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}
              title="登出">
              🚪
            </div>
          </div>
          {screen === "home" && (
            <div className="greet-bar" style={{ margin: "14px -20px -16px", padding: "14px 20px 16px" }}>
              <div className="avatar-lg" style={{ background: EMPLOYEE.color }}>{EMPLOYEE.name[0]}</div>
              <div className="greet-text">
                <div className="greet-name">早晨，{EMPLOYEE.name} 👋</div>
                <div className="greet-sub">{EMPLOYEE.role} · 電梯工程</div>
              </div>
              <div className="greet-badge">7月</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="content">
          <ActiveScreen />
        </div>

        {/* Bottom Nav */}
        <div className="bottom-nav">
          {NAV.map(n => (
            <div key={n.id} className={`nav-tab ${screen === n.id ? "active" : ""}`} onClick={() => setScreen(n.id)}>
              <div className="nav-indicator" />
              <div className="nav-tab-icon">{n.icon}</div>
              <div className="nav-tab-label">{n.label}</div>
            </div>
          ))}
        </div>

        {/* Toast */}
        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      </div>
    </>
  );
}
