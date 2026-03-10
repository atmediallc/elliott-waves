import { useState } from "react";
import "./App.css";

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
    <div className="app">
      <div className="container">

        {/* Header */}
        <div className="header">
          <div className="header-subtitle">Teoría de</div>
          <h1>Ondas de Elliott</h1>
          <div className="header-divider" />
        </div>

        {/* Wave Visual */}
        <div className="wave-container">
          <svg viewBox="0 0 500 180" className="wave-svg">
            {[50, 90, 130, 165].map(y => (
              <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#1E2130" strokeWidth="1" />
            ))}
            <polyline
              points="30,155 110,75 170,115 310,40 370,90 450,50"
              fill="none"
              stroke="#2A2D38"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            {[
              { points: "30,155 110,75", wave: "1" },
              { points: "110,75 170,115", wave: "2" },
              { points: "170,115 310,40", wave: "3" },
              { points: "310,40 370,90", wave: "4" },
              { points: "370,90 450,50", wave: "5" },
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
            {[
              { x: 65, y: 68, wave: "1" },
              { x: 136, y: 108, wave: "2" },
              { x: 310, y: 25, wave: "3" },
              { x: 335, y: 83, wave: "4" },
              { x: 405, y: 43, wave: "5" },
            ].map(({ x, y, wave }) => (
              <g key={wave} style={{ cursor: "pointer" }} onClick={() => setActive(`w${wave}`)}>
                <circle
                  cx={x} cy={y} r={14}
                  fill={active === `w${wave}` ? waveColors[wave] : "#13161E"}
                  stroke={waveColors[wave]}
                  strokeWidth="1.5"
                  style={{ transition: "all 0.3s" }}
                />
                <text
                  x={x} y={y + 5}
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
          <div className="wave-hint">TOCA UNA ONDA PARA VER SUS REGLAS</div>
        </div>

        {/* Nav Tabs */}
        <div className="nav-tabs">
          {rules.map((r) => (
            <button
              key={r.id}
              onClick={() => setActive(r.id)}
              className="nav-tab"
              style={{
                border: `1px solid ${active === r.id ? r.color : "#2A2D38"}`,
                background: active === r.id ? `${r.color}22` : "transparent",
                color: active === r.id ? r.color : "#6A6D78",
              }}
            >
              {r.icon} {r.title}
            </button>
          ))}
        </div>

        {/* Rule Card */}
        <div
          className="rule-card"
          style={{ border: `1px solid ${current.color}44` }}
        >
          <div className="rule-card-bar" style={{ background: current.color }} />
          <div className="rule-card-header">
            <span className="rule-card-icon" style={{ color: current.color }}>
              {current.icon}
            </span>
            <div>
              <div className="rule-card-label">Reglas</div>
              <div className="rule-card-title" style={{ color: current.color }}>
                {current.title}
              </div>
            </div>
          </div>
          <div className="rules-list">
            {current.rules.map((rule, i) => (
              <div key={i} className="rule-item">
                <span
                  className="rule-number"
                  style={{
                    background: `${current.color}22`,
                    border: `1px solid ${current.color}66`,
                    color: current.color,
                  }}
                >
                  {i + 1}
                </span>
                <span className="rule-text">{rule.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="footer">Elliott Wave Theory · Guía de Referencia</div>

      </div>
    </div>
  );
}
