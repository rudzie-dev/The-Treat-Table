import { useState } from "react";

/*
  ─────────────────────────────────────────
  CHANGE THE PASSWORD HERE BEFORE SHARING
  ─────────────────────────────────────────
*/
const DEMO_PASSWORD = "treattable2024";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

  .gate {
    min-height: 100svh;
    background: #FAF7F2;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    font-family: 'DM Sans', sans-serif;
  }

  .gate::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60vw 50vh at 20% 30%, rgba(200,132,26,.06) 0%, transparent 60%),
      radial-gradient(ellipse 50vw 40vh at 80% 70%, rgba(74,124,78,.04) 0%, transparent 55%);
    pointer-events: none;
  }

  .gate-card {
    background: #fff;
    border: 1px solid #EDE5D5;
    border-radius: 20px;
    padding: clamp(2rem, 5vw, 3.5rem);
    width: min(420px, 100%);
    box-shadow: 0 4px 24px rgba(44,36,22,.08), 0 1px 4px rgba(44,36,22,.06);
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .gate-emoji {
    font-size: 2.8rem;
    display: block;
    margin-bottom: 1rem;
  }

  .gate-title {
    font-family: 'Caveat', cursive;
    font-size: 2.2rem;
    font-weight: 700;
    color: #2C2416;
    margin-bottom: .3rem;
  }

  .gate-sub {
    font-size: .85rem;
    color: #8C7355;
    font-weight: 300;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .gate-input-wrap {
    display: flex;
    border: 1.5px solid #EDE5D5;
    border-radius: 40px;
    overflow: hidden;
    margin-bottom: .75rem;
    transition: border-color .2s;
  }

  .gate-input-wrap:focus-within {
    border-color: #C8841A;
  }

  .gate-input-wrap.error {
    border-color: #C0392B;
    animation: shake .35s ease;
  }

  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }

  .gate-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 13px 18px;
    font-family: 'DM Sans', sans-serif;
    font-size: .9rem;
    font-weight: 300;
    color: #2C2416;
    background: transparent;
  }

  .gate-input::placeholder {
    color: #C8B89A;
  }

  .gate-btn {
    background: #2C2416;
    border: none;
    padding: 13px 22px;
    font-family: 'DM Sans', sans-serif;
    font-size: .72rem;
    font-weight: 500;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: #FAF7F2;
    cursor: pointer;
    transition: background .2s;
    white-space: nowrap;
  }

  .gate-btn:hover { background: #C8841A; }

  .gate-error {
    font-size: .75rem;
    color: #C0392B;
    margin-bottom: .5rem;
    min-height: 1.1rem;
  }

  .gate-note {
    font-size: .68rem;
    color: #C8B89A;
    margin-top: 1.25rem;
    line-height: 1.6;
  }
`;

export default function PasswordGate({ onUnlock }) {
  const [value,  setValue]  = useState("");
  const [error,  setError]  = useState(false);
  const [shake,  setShake]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() === DEMO_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setValue("");
      setTimeout(() => setShake(false), 400);
    }
  };

  return (
    <>
      <style>{S}</style>
      <div className="gate">
        <div className="gate-card">
          <span className="gate-emoji">🎂</span>
          <div className="gate-title">The Treat Table</div>
          <div className="gate-sub">
            This is a private demo. Enter the password<br/>to preview the site.
          </div>

          <form onSubmit={handleSubmit}>
            <div className={`gate-input-wrap${shake ? " error" : ""}`}>
              <input
                className="gate-input"
                type="password"
                placeholder="Enter password"
                value={value}
                onChange={e => { setValue(e.target.value); setError(false); }}
                autoFocus
              />
              <button type="submit" className="gate-btn">Enter</button>
            </div>
            <div className="gate-error">
              {error ? "Incorrect password — try again." : ""}
            </div>
          </form>

          <div className="gate-note">
            Contact Rudz to get access.
          </div>
        </div>
      </div>
    </>
  );
}
