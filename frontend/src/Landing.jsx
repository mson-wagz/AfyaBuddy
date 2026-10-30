import { useState } from "react";
// Put the logo file at src/assets/afyabuddy-logo.png
import logo from "./assets/afyabuddy-logo.png";

const SCENARIOS = {
  Burn: {
    ask: "My brother burned his hand on the stove. What should I do first?",
    steps: [
      "Hold the hand under cool running water for 15–20 minutes.",
      "Remove rings and watches gently, before it swells.",
      "Cover loosely with a clean cloth or cling film.",
    ],
    flag: "Blistering or larger than his palm? Call 999 now.",
  },
  Choking: {
    ask: "Someone is choking at the table. Help!",
    steps: [
      "Ask them to cough. If they can, let them.",
      "If not, give up to 5 firm back blows between the shoulder blades.",
      "Then give up to 5 abdominal thrusts. Alternate until it clears.",
    ],
    flag: "Not clearing, or they pass out? Call 999 or 112 now.",
  },
  "Deep cut": {
    ask: "I cut my hand on a tin and it won't stop bleeding.",
    steps: [
      "Press firmly on the cut with a clean cloth. Do not lift it to check.",
      "Raise the hand above your heart.",
      "If blood soaks through, add more cloth on top and keep pressing.",
    ],
    flag: "Bleeding after 10 minutes of pressure? Call 999 now.",
  },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800&family=Nunito:wght@400;600;700&display=swap');
.ab{--teal:#03534E;--deep:#022F2C;--mint:#6DDDC4;--mist:#DDF5EE;--paper:#F3FAF7;--coral:#FF7559;--coral-d:#E9593C;--ink:#17302C;
  font-family:'Nunito',system-ui,sans-serif;color:var(--ink);background:var(--paper);line-height:1.6}
.ab *{box-sizing:border-box}
.ab h1,.ab h2,.ab h3,.ab .display{font-family:'M PLUS Rounded 1c','Nunito',sans-serif;color:var(--teal);margin:0;letter-spacing:-.01em;line-height:1.08}
.ab p{margin:0}
.ab a:focus-visible,.ab button:focus-visible{outline:3px solid var(--coral);outline-offset:3px}
.ab .wrap{max-width:1120px;margin:0 auto;padding:0 24px}
.ab .logo{display:block;height:44px;width:auto}
.ab .mark{width:42px;height:44px;overflow:hidden;flex:none}
.ab .mark img{height:44px;width:auto;display:block}
.ab nav{display:flex;align-items:center;justify-content:space-between;padding:14px 0;gap:16px}
.ab nav .links{display:flex;gap:28px}
.ab nav .links a{color:#42615B;text-decoration:none;font-weight:600}
.ab nav .links a:hover{color:var(--teal)}
.ab .btn{font:700 16px 'Nunito';border:0;border-radius:999px;padding:14px 26px;cursor:pointer;text-decoration:none;display:inline-block}
.ab .btn.teal{background:var(--teal);color:#fff}.ab .btn.teal:hover{background:var(--deep)}
.ab .btn.coral{background:var(--coral);color:#fff}.ab .btn.coral:hover{background:var(--coral-d)}
.ab .btn.ghost{background:#fff;color:var(--teal);box-shadow:inset 0 0 0 1.5px #CFE6DF}
.ab .btn.ghost:hover{background:var(--mist)}
.ab .hero{display:grid;grid-template-columns:1.05fr 1fr;gap:56px;align-items:center;padding:56px 0 88px}
.ab .badge{display:inline-block;background:var(--mist);color:var(--teal);font-weight:700;font-size:14px;padding:7px 14px;border-radius:999px;border:1px solid #BFE9DD;margin-bottom:22px}
.ab .hero h1{font-size:clamp(44px,6.4vw,76px);font-weight:800}
.ab .hero h1 i{font-style:normal;color:var(--coral)}
.ab .lede{font-size:19px;color:#4C6A64;max-width:46ch;margin:22px 0 30px}
.ab .row{display:flex;gap:12px;flex-wrap:wrap}
.ab .stage{position:relative;padding:28px 0}
.ab .chat{background:#fff;border-radius:32px;padding:22px;box-shadow:0 30px 70px -30px rgba(3,83,78,.45)}
.ab .chat-h{display:flex;align-items:center;gap:12px;padding-bottom:16px;border-bottom:1px solid #E4F1EC}
.ab .chat-h b{display:block;font-family:'M PLUS Rounded 1c';color:var(--teal)}
.ab .chat-h small{color:#2FA88D;font-weight:700}
.ab .sos{margin-left:auto;background:var(--coral);color:#fff;font-weight:800;font-size:13px;padding:5px 14px;border-radius:999px}
.ab .you{background:var(--teal);color:#fff;border-radius:20px 20px 4px 20px;padding:14px 18px;margin:18px 0 0 auto;width:fit-content;max-width:88%;font-weight:600}
.ab .bot{background:var(--mist);border-radius:20px 20px 20px 4px;padding:16px 18px;margin-top:14px;max-width:94%}
.ab .bot ol{margin:6px 0 8px;padding-left:20px}.ab .bot li{margin:6px 0}
.ab .bot .flag{color:var(--coral-d);font-weight:800;font-size:14px}
.ab .chips{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap}
.ab .chip{font:700 14px 'Nunito';padding:8px 16px;border-radius:999px;border:0;background:var(--mist);color:var(--teal);cursor:pointer}
.ab .chip[aria-selected=true]{background:var(--teal);color:#fff}
.ab .float{position:absolute;background:#fff;border-radius:999px;padding:8px 16px;font-weight:700;font-size:14px;box-shadow:0 10px 24px -10px rgba(3,83,78,.35);border:1px solid #E4F1EC}
.ab .float.a{top:0;left:-12px;color:var(--coral-d)}
.ab .float.b{bottom:70px;right:-14px;color:var(--teal)}
.ab section.pad{padding:84px 0}
.ab .head{max-width:620px;margin-bottom:44px}
.ab .head h2{font-size:clamp(32px,4.4vw,48px);font-weight:800}
.ab .head p{margin-top:14px;color:#4C6A64;font-size:18px}
.ab .feats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.ab .feat{background:#fff;border-radius:28px;padding:28px;border:1px solid #E4F1EC}
.ab .feat .ic{width:48px;height:48px;border-radius:16px;background:var(--mist);display:grid;place-items:center;margin-bottom:18px}
.ab .feat:nth-child(2) .ic{background:#FFE6DF}
.ab .feat h3{font-size:22px;margin-bottom:8px}.ab .feat p{color:#4C6A64}
.ab .how{background:var(--teal);color:#DDF5EE}
.ab .how h2{color:#fff}.ab .how .head p{color:#B9E4D8}
.ab .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;counter-reset:s}
.ab .step{counter-increment:s;border-top:3px solid var(--mint);padding-top:18px}
.ab .step:before{content:counter(s);display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:var(--mint);color:var(--deep);font:800 18px 'M PLUS Rounded 1c';margin-bottom:14px}
.ab .step h3{color:#fff;font-size:22px;margin-bottom:6px}
.ab .em{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
.ab .card{background:#fff;border-radius:28px;padding:24px;border:1px solid #E4F1EC}
.ab .person{display:flex;align-items:center;gap:14px;padding:14px 0;border-top:1px solid #E4F1EC}
.ab .person:first-child{border-top:0}
.ab .av{width:42px;height:42px;border-radius:50%;background:var(--mist);color:var(--teal);display:grid;place-items:center;font:800 16px 'M PLUS Rounded 1c'}
.ab .person small{display:block;color:#5F7A74}
.ab .call{margin-left:auto;background:var(--coral);color:#fff;font-weight:800;font-size:14px;padding:7px 16px;border-radius:999px}
.ab .cta{background:var(--mist);border-radius:36px;padding:56px;display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap}
.ab .cta h2{font-size:clamp(30px,4vw,44px);font-weight:800;max-width:15ch}
.ab footer{padding:40px 0;color:#5F7A74;font-size:14px;max-width:72ch}
@media(max-width:860px){.ab nav .links{display:none}.ab .hero,.ab .em{grid-template-columns:1fr}.ab .feats,.ab .steps{grid-template-columns:1fr}.ab .float.a{left:0}.ab .float.b{right:0}.ab .cta{padding:36px 28px}}
`;

const Icon = ({ d }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#03534E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

export default function Landing({ onStart = () => {} }) {
  const [tab, setTab] = useState("Burn");
  const s = SCENARIOS[tab];

  return (
    <div className="ab">
      <style>{CSS}</style>
      <div className="wrap">
        <nav aria-label="Main">
          <img className="logo" src={logo} alt="AfyaBuddy" />
          <div className="links">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#emergency">Emergency</a>
          </div>
          <button className="btn teal" onClick={onStart}>Start chatting</button>
        </nav>

        <header className="hero">
          <div>
            <span className="badge">First aid guidance, powered by AI</span>
            <h1>Help for the moment that matters<i>.</i></h1>
            <p className="lede">
              AfyaBuddy is your calm, friendly first aid companion. Say or type what
              happened and get clear steps in seconds, plus a direct line to 999 or 112
              when it is serious.
            </p>
            <div className="row">
              <button className="btn coral" onClick={onStart}>Try AfyaBuddy free</button>
              <a className="btn ghost" href="#how">See how it works</a>
            </div>
          </div>

          <div className="stage">
            <span className="float a">999 / 112 SOS</span>
            <span className="float b">Voice or text</span>
            <div className="chat" aria-live="polite">
              <div className="chat-h">
                <div className="mark"><img src={logo} alt="" /></div>
                <div><b>AfyaBuddy</b><small>Online, responds instantly</small></div>
                <span className="sos">SOS</span>
              </div>
              <p className="you">{s.ask}</p>
              <div className="bot">
                Stay calm, let's do this together:
                <ol>{s.steps.map((t) => <li key={t}>{t}</li>)}</ol>
                <p className="flag">{s.flag}</p>
              </div>
              <div className="chips" role="tablist">
                {Object.keys(SCENARIOS).map((k) => (
                  <button key={k} role="tab" aria-selected={tab === k} className="chip" onClick={() => setTab(k)}>{k}</button>
                ))}
              </div>
            </div>
          </div>
        </header>
      </div>

      <section className="pad wrap" id="features">
        <div className="head">
          <h2>Made for when your hands are shaking.</h2>
          <p>Simple on purpose. No menus to dig through while someone needs help.</p>
        </div>
        <div className="feats">
          <div className="feat">
            <div className="ic"><Icon d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM19 11a7 7 0 0 1-14 0M12 18v3" /></div>
            <h3>Just talk to it</h3>
            <p>Tap the mic and describe what happened. Typing works too.</p>
          </div>
          <div className="feat">
            <div className="ic"><Icon d="M4 6h16M4 12h16M4 18h10" /></div>
            <h3>One clear step at a time</h3>
            <p>Short instructions in the right order, with a plain warning when it is time to get a professional.</p>
          </div>
          <div className="feat">
            <div className="ic"><Icon d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></div>
            <h3>Your people on speed dial</h3>
            <p>Add your own emergency contacts, like family, and call them in one tap.</p>
          </div>
        </div>
      </section>

      <section className="pad how" id="how">
        <div className="wrap">
          <div className="head">
            <h2>Three steps, no learning curve.</h2>
          </div>
          <div className="steps">
            <div className="step"><h3>Describe it</h3><p>Say what happened in your own words.</p></div>
            <div className="step"><h3>Follow the steps</h3><p>Get calm, numbered guidance you can act on right away.</p></div>
            <div className="step"><h3>Call for help</h3><p>Reach 999, 112 or your own contacts without leaving the chat.</p></div>
          </div>
        </div>
      </section>

      <section className="pad wrap" id="emergency">
        <div className="em">
          <div>
            <h2 className="display" style={{ fontSize: "clamp(32px,4.4vw,48px)", fontWeight: 800 }}>Help is always one tap away.</h2>
            <p style={{ marginTop: 14, color: "#4C6A64", fontSize: 18, maxWidth: "44ch" }}>
              Keep the people who matter in AfyaBuddy so you never search for a number in a crisis.
            </p>
          </div>
          <div className="card">
            <div className="person"><div className="av">M</div><div>Mum<small>Your contact</small></div><span className="call">Call</span></div>
            <div className="person"><div className="av">B</div><div>Brian, cousin<small>Your contact</small></div><span className="call">Call</span></div>
            <div className="person"><div className="av">!</div><div>Emergency services<small>999 or 112</small></div><span className="call">Call</span></div>
          </div>
        </div>
      </section>

      <div className="wrap">
        <div className="cta">
          <h2 className="display">Know what to do before help arrives.</h2>
          <button className="btn coral" onClick={onStart}>Try AfyaBuddy free</button>
        </div>
        <footer>
          AfyaBuddy gives general first-aid guidance and does not replace a doctor or emergency
          services. In a serious emergency, call 999 or 112 first.
        </footer>
      </div>
    </div>
  );
}