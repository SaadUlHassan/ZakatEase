import type { JSX } from "react";

export function OgImageContent(): JSX.Element {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0d9488 0%, #115e59 50%, #134e4a 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 100,
          height: 100,
          borderRadius: "24px",
          background: "rgba(204, 251, 241, 0.15)",
          marginBottom: 32,
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, color: "#ccfbf1" }}>Z</div>
      </div>

      <div style={{ fontSize: 64, fontWeight: 800, color: "#ffffff", letterSpacing: "-1px", marginBottom: 12 }}>
        ZakatEase
      </div>

      <div style={{ fontSize: 28, color: "#99f6e4", marginBottom: 16 }}>Free Zakat Calculator</div>

      <div style={{ fontSize: 26, color: "rgba(204, 251, 241, 0.8)" }}>زکوٰۃ کا آسان حساب</div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          display: "flex",
          gap: 24,
          fontSize: 18,
          color: "rgba(153, 246, 228, 0.6)",
        }}
      >
        <span>Gold & Silver</span>
        <span>•</span>
        <span>Cash & Bank</span>
        <span>•</span>
        <span>Investments</span>
        <span>•</span>
        <span>Business Assets</span>
      </div>
    </div>
  );
}
