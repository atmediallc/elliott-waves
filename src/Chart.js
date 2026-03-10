import { useEffect, useState } from "react";

const CANDLE_WIDTH = 8;
const CANDLE_GAP = 3;
const CHART_HEIGHT = 200;
const PADDING = { top: 20, bottom: 20, left: 10, right: 10 };

function fetchCandles() {
  return fetch(
    "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=4h&limit=58"
  ).then((r) => r.json());
}

function normalize(value, min, max, height) {
  return height - PADDING.bottom - ((value - min) / (max - min)) * (height - PADDING.top - PADDING.bottom);
}

export default function Chart() {
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    fetchCandles()
      .then((data) => {
        const parsed = data.map((d) => ({
          time: d[0],
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        }));
        setCandles(parsed);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el precio. Intenta de nuevo.");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ textAlign: "center", color: "#4A4D58", padding: "2rem", fontSize: "0.85rem", letterSpacing: "0.1em" }}>
      CARGANDO BTC/USDT...
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", color: "#E07B54", padding: "1rem", fontSize: "0.85rem" }}>
      {error}
    </div>
  );

  const allHighs = candles.map((c) => c.high);
  const allLows = candles.map((c) => c.low);
  const minPrice = Math.min(...allLows);
  const maxPrice = Math.max(...allHighs);

  const totalWidth = candles.length * (CANDLE_WIDTH + CANDLE_GAP) + PADDING.left + PADDING.right;

  const formatPrice = (p) =>
    p >= 1000 ? `$${(p / 1000).toFixed(1)}k` : `$${p.toFixed(0)}`;

  const formatDate = (ts) => {
    const d = new Date(ts);
    return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:00`;
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Price labels */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.65rem",
        color: "#4A4D58",
        letterSpacing: "0.05em",
        marginBottom: "0.4rem",
        padding: "0 0.5rem",
      }}>
        <span>BTC/USDT · 4H · 60 velas</span>
        <span style={{ color: candles[candles.length - 1]?.close > candles[candles.length - 1]?.open ? "#4CAF80" : "#E07B54" }}>
          {formatPrice(candles[candles.length - 1]?.close)}
        </span>
      </div>

      {/* Chart scroll container */}
      <div style={{ overflowX: "auto", overflowY: "hidden", borderRadius: 8 }}>
        <svg
          width={totalWidth}
          height={CHART_HEIGHT}
          style={{ display: "block", background: "#0D0F14" }}
        >
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((pct) => {
            const y = PADDING.top + pct * (CHART_HEIGHT - PADDING.top - PADDING.bottom);
            const price = maxPrice - pct * (maxPrice - minPrice);
            return (
              <g key={pct}>
                <line x1={0} y1={y} x2={totalWidth} y2={y} stroke="#1E2130" strokeWidth="1" />
                <text x={PADDING.left + 4} y={y - 3} fill="#2A2D38" fontSize="9" fontFamily="monospace">
                  {formatPrice(price)}
                </text>
              </g>
            );
          })}

          {/* Candles */}
          {candles.map((c, i) => {
            const x = PADDING.left + i * (CANDLE_WIDTH + CANDLE_GAP);
            const cx = x + CANDLE_WIDTH / 2;
            const isGreen = c.close >= c.open;
            const color = isGreen ? "#4CAF80" : "#E07B54";

            const yHigh = normalize(c.high, minPrice, maxPrice, CHART_HEIGHT);
            const yLow = normalize(c.low, minPrice, maxPrice, CHART_HEIGHT);
            const yOpen = normalize(c.open, minPrice, maxPrice, CHART_HEIGHT);
            const yClose = normalize(c.close, minPrice, maxPrice, CHART_HEIGHT);

            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(Math.abs(yClose - yOpen), 1);

            return (
              <g
                key={c.time}
                style={{ cursor: "crosshair" }}
                onMouseEnter={() => setTooltip({ ...c, x: cx, index: i })}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Wick */}
                <line x1={cx} y1={yHigh} x2={cx} y2={yLow} stroke={color} strokeWidth="1" />
                {/* Body */}
                <rect
                  x={x}
                  y={bodyTop}
                  width={CANDLE_WIDTH}
                  height={bodyHeight}
                  fill={color}
                  opacity={0.9}
                  rx={1}
                />
              </g>
            );
          })}

          {/* Tooltip */}
          {tooltip && (() => {
            const tipX = tooltip.x > totalWidth - 120 ? tooltip.x - 130 : tooltip.x + 10;
            return (
              <g>
                <line x1={tooltip.x} y1={0} x2={tooltip.x} y2={CHART_HEIGHT} stroke="#2A2D38" strokeWidth="1" strokeDasharray="3 2" />
                <rect x={tipX} y={10} width={120} height={72} fill="#13161E" stroke="#2A2D38" strokeWidth="1" rx={4} />
                <text x={tipX + 8} y={26} fill="#6A6D78" fontSize="9" fontFamily="monospace">{formatDate(tooltip.time)}</text>
                <text x={tipX + 8} y={40} fill="#4CAF80" fontSize="9" fontFamily="monospace">H: {formatPrice(tooltip.high)}</text>
                <text x={tipX + 8} y={52} fill="#E07B54" fontSize="9" fontFamily="monospace">L: {formatPrice(tooltip.low)}</text>
                <text x={tipX + 8} y={64} fill="#C8C4BA" fontSize="9" fontFamily="monospace">O: {formatPrice(tooltip.open)}</text>
                <text x={tipX + 8} y={76} fill="#C8C4BA" fontSize="9" fontFamily="monospace">C: {formatPrice(tooltip.close)}</text>
              </g>
            );
          })()}
        </svg>
      </div>

      <div style={{
        textAlign: "center",
        fontSize: "0.65rem",
        color: "#2A2D38",
        letterSpacing: "0.1em",
        marginTop: "0.5rem",
      }}>
        DATOS EN TIEMPO REAL · BINANCE · DESLIZA PARA VER MÁS
      </div>
    </div>
  );
}
