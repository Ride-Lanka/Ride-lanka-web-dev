"use client";

export default function SplashScreen({ active, onGetStarted, onSignIn }) {
  return (
    <div id="screen-splash" className={`screen ${active ? "active" : ""}`}>
      <div className="splash-content">
        <div className="splash-logo">🌍</div>
        <h1>
          Ready to Dream?
          <br />
          Let&apos;s Travel.
        </h1>
        <p>
          Discover breathtaking destinations, plan unforgettable trips,
          <br />
          and connect with a global community of explorers.
        </p>
        <div className="splash-actions">
          <button className="btn-primary" onClick={onGetStarted}>
            Get Started
          </button>
          <button className="btn-outline" onClick={onSignIn}>
            Sign In
          </button>
        </div>
        <div className="splash-dots">
          <span className="active" />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
