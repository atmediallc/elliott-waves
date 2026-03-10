import { useState } from "react";

const rules = [
  {
    id: "base",
    wave: null,
    icon: "〜",
    title: "Tipos de Ondas",
    color: "#C8A96E",
    rules: [
      { text: "Motrices: Impulsos que contemplan las 5 ondas de Elliott completas con conteos internos." },
      { text: "Impulsivas: Movimientos impulsivos que NO contienen 5 ondas internamente." },
      { text: "Un impulso de Elliott siempre se divide en 5 ondas." },
    ],
  },
  {
    id: "w1",
    wave: "1",
    icon: "①",
    title: "Onda 1",
    color: "#5B8DD9",
    rules: [
      { text: "Puede ser impulsiva o motriz." },
      { text: "Si es impulsiva → no se puede medir internamente." },
      { text: "Si es motriz → debe medirse por sus conteos internos como si fuera un movimiento independiente." },
    ],
  },
  {
    id: "w2",
    wave: "2",
    icon: "②",
    title: "Onda 2",
    color: "#E07B54",
    rules: [
      { text: "Siempre es correctiva." },
      { text: "Puede retroceder como máximo hasta el inicio de Onda 1." },
      { text: "Nunca puede romper el origen de Onda 1." },
    ],
  },
  {
    id: "w3",
    wave: "3",
    icon: "③",
    title: "Onda 3",
    color: "#4CAF80",
    rules: [
      { text: "Siempre será una onda MOTRIZ." },
      { text: "Nunca puede ser más pequeña que Onda 1." },
      { text: "Mínimo de impulso: 130% del tamaño de Onda 1." },
      { text: "Si se extiende, puede llegar a: 161.8% · 261.8% · 361.8% · 461.8% de Fibonacci." },
    ],
  },
  {
    id: "w4",
    wave: "4",
    icon: "④",
    title: "Onda 4",
    color: "#E07B54",
    rules: [
      { text: "Siempre es correctiva." },
      { text: "Puede retroceder: 38.2% · 50% · 61.8%." },
      { text: "Puede invadir el espacio de Onda 1, pero NO puede terminar por debajo del techo de Onda 1." },
      { text: "La forma más precisa de predecir su fin es hacer los conteos internos." },
    ],
  },
  {
    id: "w5",
    wave: "5",
    icon: "⑤",
    title: "Onda 5",
    color: "#A855F7",
    rules: [
      { text: "Puede ser impulsiva o motriz." },
      { text: "Si es impulsiva → mínimo mismo tamaño que Onda 1 · punto medio puede llegar al mismo precio que Onda 3." },
      { text: "Si es motriz → debe medirse internamente de forma independiente con conteo de 5 ondas para predecir su fin." },
    ],
  },
];

const waveColors = {
  "1": "#5B8DD9",
  "2": "#E07B54",
  "3": "#4CAF80",
  "4": "#E07B54",
  "5": "#A855F7",
};

export default function ElliottWaves() {
  const [active, setActive] = useState("base");

  const current = rules.find((r) => r.id === active);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0D0F14",
      fontFamily: "'Georgia', serif",
      color: "#E8E0D0",
      padding: "2rem 1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <div style={{ maxWidth: 700, width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            fontSize: "0.7rem",
            letterSpacing: "0.25em",
            color: "#C8A96E",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}>Teoría de</div>
          <h1 style={{
            fontSize: "clamp(2rem, 6vw, 3.2rem)",
            fontWeight: "normal",
            margin: 0,
            letterSpacing: "0.05em",
            color: "#F5EDD8",
          }}>Ondas de Elliott</h1>
          <div style={{
            width: 60,
            height: 2,
            background: "linear-gradient(90deg, transparent, #C8A96E, transparent)",
            margin: "1rem auto 0",
          }} />
        </div>

        {/* Wave Visual */}
        <div style={{
          background: "#13161E",
          border: "1px solid #2A2D38",
          borderRadius: 12,
          padding: "1.5rem",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}>
          <svg viewBox="0 0 500 170" style={{ width: "100%", height: "auto" }}>
            {/* Grid lines */}
            {[50, 90, 130].map(y => (
              <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#1E2130" strokeWidth="1" />
            ))}
            {/* Wave path */}
            <polyline
              points="30,140 110,60 170,100 310,25 370,75 450,35"
              fill="none"
              stroke="#2A2D38"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            {/* Colored segments */}
            {[
              { points: "30,140 110,60", wave: "1" },
              { points: "110,60 170,100", wave: "2" },
              { points: "170,100 310,25", wave: "3" },
              { points: "310,25 370,75", wave: "4" },
              { points: "370,75 450,35", wave: "5" },
            ].map(({ points, wave }) => (
              <polyline
                key={wave}
                points={points}
                fill="none"
                stroke={active === `w${wave}` ? waveColors[wave] : `${waveColors[wave]}55`}
                strokeWidth={active === `w${wave}` ? 3.5 : 2}
                style={{ transition: "all 0.3s", cursor: "pointer" }}
                onClick={() => setActive(`w${wave}`)}
              />
            ))}
            {/* Labels */}
            {[
              { x: 65, y: 53, wave: "1" },
              { x: 136, y: 93, wave: "2" },
              { x: 310, y: 14, wave: "3" },
              { x: 335, y: 68, wave: "4" },
              { x: 405, y: 28, wave: "5" },
            ].map(({ x, y, wave }) => (
              <g key={wave} style={{ cursor: "pointer" }} onClick={() => setActive(`w${wave}`)}>
                <circle
                  cx={x}
                  cy={y}
                  r={14}
                  fill={active === `w${wave}` ? waveColors[wave] : "#13161E"}
                  stroke={waveColors[wave]}
                  strokeWidth="1.5"
                  style={{ transition: "all 0.3s" }}
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="Georgia"
                  fill={active === `w${wave}` ? "#0D0F14" : waveColors[wave]}
                  style={{ transition: "all 0.3s" }}
                >
                  {wave}
                </text>
              </g>
            ))}
          </svg>
          <div style={{
            textAlign: "center",
            fontSize: "0.7rem",
            color: "#4A4D58",
            letterSpacing: "0.1em",
            marginTop: "0.5rem",
          }}>TOCA UNA ONDA PARA VER SUS REGLAS</div>
        </div>

        {/* Nav Tabs */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {rules.map((r) => (
            <button
              key={r.id}
              onClick={() => setActive(r.id)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: 999,
                border: `1px solid ${active === r.id ? r.color : "#2A2D38"}`,
                background: active === r.id ? `${r.color}22` : "transparent",
                color: active === r.id ? r.color : "#6A6D78",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.25s",
                letterSpacing: "0.05em",
              }}
            >
              {r.icon} {r.title}
            </button>
          ))}
        </div>

        {/* Rule Card */}
        <div style={{
          background: "#13161E",
          border: `1px solid ${current.color}44`,
          borderRadius: 12,
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            top: 0, left: 0,
            width: "4px",
            height: "100%",
            background: current.color,
            borderRadius: "12px 0 0 12px",
          }} />
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}>
            <span style={{
              fontSize: "2.2rem",
              color: current.color,
              lineHeight: 1,
            }}>{current.icon}</span>
            <div>
              <div style={{
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "#4A4D58",
                textTransform: "uppercase",
              }}>Reglas</div>
              <div style={{
                fontSize: "1.4rem",
                color: current.color,
                letterSpacing: "0.05em",
              }}>{current.title}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {current.rules.map((rule, i) => (
              <div key={i} style={{
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
                padding: "0.9rem 1rem",
                background: "#0D0F14",
                borderRadius: 8,
                border: "1px solid #1E2130",
              }}>
                <span style={{
                  minWidth: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: `${current.color}22`,
                  border: `1px solid ${current.color}66`,
                  color: current.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontFamily: "monospace",
                  flexShrink: 0,
                }}>{i + 1}</span>
                <span style={{
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "#C8C4BA",
                }}>{rule.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          marginTop: "2rem",
          fontSize: "0.65rem",
          color: "#2A2D38",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}>Elliott Wave Theory · Guía de Referencia</div>
      </div>
    </div>
  );
}
