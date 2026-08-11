export default function CinematicBackground() {
  return (
    <div className="cinematic-bg">
      <div
        className="glow-orb"
        style={{
          width: 500, height: 500, top: "-10%", left: "-10%",
          background: "var(--violet)", animationDelay: "0s",
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: 400, height: 400, top: "40%", right: "-5%",
          background: "var(--cyan)", animationDelay: "4s", opacity: 0.18,
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: 350, height: 350, bottom: "-10%", left: "20%",
          background: "var(--gold)", animationDelay: "8s", opacity: 0.12,
        }}
      />
    </div>
  );
}
