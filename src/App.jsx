import { useState, useEffect, useRef, useCallback } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --paper:   #FAF7F2;
  --paper2:  #F4EFE6;
  --paper3:  #EDE5D5;
  --ink:     #2C2416;
  --ink2:    #5C4A30;
  --ink3:    #8C7355;
  --gold:    #C8841A;
  --gold-lt: #E8A84A;
  --green:   #4A7C4E;
  --green-lt:#7CBF81;
  --red:     #C0392B;

  /* sticky note colours */
  --sn-yellow: #FFF3A3;
  --sn-yb:     #E8DC6A;
  --sn-blue:   #B8D8F8;
  --sn-bb:     #7AAED4;
  --sn-pink:   #FFB8C8;
  --sn-pb:     #E8809A;
  --sn-green:  #B8EBC8;
  --sn-gb:     #7AC490;
  --sn-peach:  #FFD4A8;
  --sn-peb:    #E8A870;
  --sn-lav:    #D8C8F8;
  --sn-lb:     #A888D0;

  --serif:  'Lora', Georgia, serif;
  --hand:   'Caveat', cursive;
  --sans:   'DM Sans', system-ui, sans-serif;
  --r:      14px;
  --rlg:    20px;
  --rxl:    28px;
  --shadow: 0 2px 12px rgba(44,36,22,.1), 0 1px 3px rgba(44,36,22,.08);
  --shadow-lift: 0 8px 32px rgba(44,36,22,.16), 0 2px 8px rgba(44,36,22,.1);
}

html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
body{
  background:var(--paper);color:var(--ink);
  font-family:var(--sans);font-size:15px;line-height:1.65;
  overflow-x:hidden;min-height:100vh
}

/* Subtle paper texture */
body::before{
  content:'';position:fixed;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='.028'/%3E%3C/svg%3E");
  pointer-events:none;z-index:0
}
*{position:relative;z-index:1}

::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--paper2)}
::-webkit-scrollbar-thumb{background:var(--ink3);border-radius:2px}
:focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:4px}
[id]{scroll-margin-top:72px}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes wiggle{0%,100%{transform:rotate(var(--rot,0deg))}50%{transform:rotate(calc(var(--rot,0deg) + 1.5deg))}}
@keyframes pinDrop{from{opacity:0;transform:translateY(-8px) rotate(var(--rot,0deg))}to{opacity:1;transform:translateY(0) rotate(var(--rot,0deg))}}

/* ── NAV ── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:200;
  height:64px;display:flex;align-items:center;justify-content:space-between;
  padding:0 clamp(1.25rem,4vw,3rem);
  background:rgba(250,247,242,.92);
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  border-bottom:1px solid var(--paper3);
  transition:box-shadow .3s;
}
.nav.on{box-shadow:0 2px 20px rgba(44,36,22,.08)}
.logo{
  font-family:var(--hand);font-size:1.55rem;font-weight:600;
  color:var(--ink);letter-spacing:.02em;text-decoration:none;
  display:flex;align-items:center;gap:10px;white-space:nowrap
}
.logo-mark{
  width:32px;height:32px;border-radius:10px;
  background:var(--ink);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--hand);font-size:.85rem;color:var(--paper);
  font-weight:700;flex-shrink:0
}
.nav-mid{
  display:flex;gap:2.25rem;list-style:none;
  position:absolute;left:50%;transform:translateX(-50%)
}
.nav-mid a{
  font-size:.73rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;
  color:var(--ink3);text-decoration:none;transition:color .2s;white-space:nowrap
}
.nav-mid a:hover{color:var(--ink)}
.nav-r{display:flex;align-items:center;gap:10px}
.nav-pill{
  display:flex;align-items:center;gap:7px;
  font-size:.7rem;font-weight:500;letter-spacing:.06em;
  color:var(--paper);background:var(--ink);
  padding:8px 18px;border-radius:40px;text-decoration:none;
  transition:background .2s,transform .15s;white-space:nowrap
}
.nav-pill:hover{background:var(--ink2);transform:translateY(-1px)}
.ndot{width:6px;height:6px;border-radius:50%;background:var(--green-lt);animation:pulse 2s infinite}
.burger{
  display:none;flex-direction:column;gap:4.5px;
  background:none;border:none;cursor:pointer;padding:6px
}
.burger span{display:block;width:20px;height:1.5px;background:var(--ink);border-radius:1px}
@media(max-width:820px){.nav-mid{display:none}.burger{display:flex}}
@media(max-width:480px){.nav-pill span{display:none}.nav-pill{padding:8px 14px;border-radius:50%}}

/* ── MOBILE DRAWER ── */
.ov{position:fixed;inset:0;background:rgba(44,36,22,.45);z-index:190;opacity:0;pointer-events:none;transition:opacity .3s}
.ov.open{opacity:1;pointer-events:all}
.mdrawer{
  position:fixed;top:0;right:0;width:min(280px,80vw);height:100vh;
  background:var(--paper);border-left:1px solid var(--paper3);
  z-index:195;transform:translateX(100%);
  transition:transform .4s cubic-bezier(.32,0,.15,1);
  display:flex;flex-direction:column;padding:80px 1.75rem 2rem
}
.mdrawer.open{transform:translateX(0)}
.mdrawer a{
  font-family:var(--hand);font-size:2rem;font-weight:500;
  color:var(--ink2);text-decoration:none;
  padding:.55rem 0;border-bottom:1px solid var(--paper3);display:block;transition:color .2s
}
.mdrawer a:hover{color:var(--ink)}
.mdrawer-cta{
  margin-top:auto;text-align:center;
  background:var(--ink);color:var(--paper);
  font-size:.75rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
  padding:14px;border-radius:var(--rlg);text-decoration:none;display:block
}

/* ── HERO ── */
.hero{
  min-height:100vh;
  min-height:100svh;
  min-height:100dvh;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;text-align:center;
  padding:
    clamp(88px,12vh,120px)
    clamp(1.25rem,5vw,4rem)
    clamp(4rem,8vh,5.5rem);
  overflow:hidden;background:var(--paper);
}

/* Decorative circles — clamp size so they don't dominate on mobile */
.hero-deco{position:absolute;border-radius:50%;pointer-events:none}
.hero-deco-1{
  width:clamp(200px,50vw,500px);height:clamp(200px,50vw,500px);
  background:radial-gradient(circle,rgba(200,132,26,.06) 0%,transparent 65%);
  top:-60px;right:-60px
}
.hero-deco-2{
  width:clamp(150px,35vw,350px);height:clamp(150px,35vw,350px);
  background:radial-gradient(circle,rgba(74,124,78,.05) 0%,transparent 65%);
  bottom:-40px;left:-40px
}

.hero-badge{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--paper2);border:1px solid var(--paper3);border-radius:40px;
  padding:7px 18px 7px 12px;
  font-size:.67rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
  color:var(--ink3);margin-bottom:1.5rem;animation:fadeIn .6s ease both;
  max-width:calc(100vw - 3rem);white-space:nowrap;overflow:hidden;
}
.live{display:flex;align-items:center;gap:5px;color:var(--green);font-weight:500;flex-shrink:0}
.ldot{width:6px;height:6px;border-radius:50%;background:var(--green-lt);animation:pulse 2s infinite;flex-shrink:0}

.hero-h1{
  font-family:var(--hand);font-size:clamp(2.8rem,9vw,7rem);
  font-weight:700;line-height:1.05;color:var(--ink);
  margin-bottom:1rem;letter-spacing:-.01em;
  animation:fadeUp .9s ease both;animation-delay:.15s;
  max-width:min(860px,90vw);
}
.hero-h1 em{font-style:normal;color:var(--gold)}

.hero-sub{
  font-family:var(--serif);font-size:clamp(.85rem,2.5vw,1.05rem);
  color:var(--ink2);line-height:1.85;
  width:min(440px,88vw);
  font-weight:400;font-style:italic;margin-bottom:2rem;
  animation:fadeUp .9s ease both;animation-delay:.28s
}

.hero-btns{
  display:flex;gap:10px;justify-content:center;flex-wrap:wrap;
  animation:fadeUp .9s ease both;animation-delay:.4s;margin-bottom:2rem;
  width:min(400px,88vw);
}
@media(max-width:400px){
  .hero-btns{flex-direction:column}
  .hero-btns a,.hero-btns button{width:100%;text-align:center}
}
.btn-ink{
  background:var(--ink);color:var(--paper);font-family:var(--sans);
  font-size:.74rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;
  padding:14px 30px;border-radius:40px;border:none;cursor:pointer;
  text-decoration:none;white-space:nowrap;
  transition:background .2s,transform .15s,box-shadow .2s;
}
.btn-ink:hover,.btn-ink:focus-visible{
  background-color:var(--ink2);
  transform:translateY(-2px);
  box-shadow:0 6px 24px rgba(44,36,22,.18);
}
.btn-outline{
  background:transparent;color:var(--ink);font-family:var(--sans);
  font-size:.74rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;
  padding:14px 26px;border-radius:40px;cursor:pointer;text-decoration:none;
  border:1.5px solid var(--paper3);
  transition:border-color .2s,background .2s,transform .15s;white-space:nowrap
}
.btn-outline:hover{border-color:var(--ink3);background:var(--paper2);transform:translateY(-2px)}

/* Stat pills — 2x2 grid on mobile, single row above 560px */
.hero-stats{
  display:grid;grid-template-columns:1fr 1fr;gap:8px;
  width:min(400px,88vw);
  animation:fadeUp .9s ease both;animation-delay:.54s
}
@media(min-width:560px){
  .hero-stats{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;width:auto}
}
.hero-stat{
  display:flex;align-items:center;justify-content:center;gap:7px;
  background:var(--paper2);border:1px solid var(--paper3);
  border-radius:40px;padding:7px 14px;
  font-size:.68rem;font-weight:400;color:var(--ink2);white-space:nowrap;
}
.hero-stat-icon{font-size:.85rem;flex-shrink:0}

/* Scroll cue — hide on short viewports to prevent overlap */
.scroll-cue{
  position:absolute;bottom:1.25rem;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:6px;
  animation:fadeIn 1s ease both 1.1s
}
@media(max-height:680px){.scroll-cue{display:none}}
.scroll-line{width:1px;height:28px;background:linear-gradient(to bottom,var(--ink3),transparent)}
.scroll-lbl{font-size:.55rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink3)}

/* ── TICKER ── */
.ticker{
  overflow:hidden;padding:10px 0;
  border-top:1px solid var(--paper3);border-bottom:1px solid var(--paper3);
  background:var(--paper2)
}
.ticker-t{display:flex;width:max-content;animation:marquee 30s linear infinite}
.tick{
  display:flex;align-items:center;gap:1.75rem;padding:0 1.75rem;
  font-family:var(--hand);font-size:.95rem;font-weight:500;
  color:var(--ink2);white-space:nowrap
}
.tsep{
  width:6px;height:6px;border-radius:50%;
  background:var(--gold);flex-shrink:0
}

/* ── SECTION ── */
.wrap{max-width:1180px;margin:0 auto;padding:0 clamp(1.25rem,4vw,2.75rem)}
.sec{padding:clamp(3.5rem,7vh,6rem) 0}
.eyebrow{
  display:inline-flex;align-items:center;gap:10px;
  font-family:var(--hand);font-size:1rem;font-weight:500;color:var(--gold);
  margin-bottom:.65rem
}
.eyebrow::before{content:'✦';font-size:.7rem}
.sec-title{
  font-family:var(--hand);font-size:clamp(2rem,5vw,3.2rem);
  font-weight:700;line-height:1.1;color:var(--ink)
}
.sec-title em{font-style:normal;color:var(--gold)}

/* ── MENU ── */
.menu-header{
  display:flex;align-items:flex-end;justify-content:space-between;
  flex-wrap:wrap;gap:1rem;margin-bottom:2rem
}

/* ── STICKY NOTE GRID ── */
.snboard{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:clamp(1rem,2.5vw,1.75rem);
  align-items:stretch;
  perspective:1200px;
  perspective-origin:50% 30%;
}
@media(max-width:860px){.snboard{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.snboard{grid-template-columns:1fr}}

/* Individual sticky note */
/* ── STICKY NOTE PAPER PHYSICS ── */
.sn{
  border-radius:4px;
  padding:1.6rem 1.5rem 1.2rem;
  cursor:pointer;
  display:flex;
  flex-direction:column;

  /* Resting shadow: ambient depth + subtle contact shadow on the "desk" */
  box-shadow:
    0 1px 1px rgba(44,36,22,.12),
    0 3px 8px rgba(44,36,22,.10),
    0 8px 20px rgba(44,36,22,.07);

  transform:rotate(var(--rot,0deg));
  transition:
    box-shadow .3s ease,
    transform .08s ease;
  will-change:transform;
  animation:pinDrop .5s ease both;
  animation-delay:var(--delay,0s);
  border-top:3px solid var(--border-col,rgba(0,0,0,.12));
  transform-style:preserve-3d;
  overflow:hidden;
}

@media(hover:hover){
  .sn:hover{
    box-shadow:
      0 2px 2px rgba(44,36,22,.08),
      0 8px 24px rgba(44,36,22,.16),
      0 24px 48px rgba(44,36,22,.10);
    z-index:20;
  }
}

/* Active: pressed flat */
.sn:active{
  box-shadow:
    0 1px 1px rgba(44,36,22,.14),
    0 2px 6px rgba(44,36,22,.10);
  transition:transform .05s ease, box-shadow .05s ease;
}

/* Warm colour wash on hover — note "warms up" as you approach it */
.sn-glow{
  position:absolute;inset:0;
  border-radius:inherit;
  background:radial-gradient(ellipse 80% 60% at 50% 0%,
    rgba(255,255,255,.55) 0%,
    transparent 70%
  );
  opacity:0;
  transition:opacity .35s ease;
  pointer-events:none;
  z-index:1;
}
@media(hover:hover){
  .sn:hover .sn-glow{ opacity:1; }
}

/* Tape strip at top */
.sn-tape{
  position:absolute;top:-10px;left:50%;transform:translateX(-50%);
  width:44px;height:20px;border-radius:3px;
  background:rgba(255,255,255,.55);
  border:1px solid rgba(255,255,255,.8);
  backdrop-filter:blur(2px);
  transition:transform .3s ease,box-shadow .3s ease;
}
@media(hover:hover){
  .sn:hover .sn-tape{
    transform:translateX(-50%) scaleY(1.06);
    box-shadow:0 3px 10px rgba(44,36,22,.12);
  }
}

/* Pin dot */
.sn-pin{
  position:absolute;top:-1px;left:50%;transform:translateX(-50%);
  width:10px;height:10px;border-radius:50%;
  background:var(--pin-col,#c0392b);
  box-shadow:0 2px 4px rgba(0,0,0,.25),0 0 0 2px rgba(255,255,255,.5);
  z-index:4;
  transition:transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease;
}
@media(hover:hover){
  .sn:hover .sn-pin{
    transform:translateX(-50%) scale(1.3) translateY(-3px);
    box-shadow:0 5px 10px rgba(0,0,0,.28),0 0 0 2px rgba(255,255,255,.65);
  }
}

.sn-img{
  width:calc(100% + 3rem);
  margin-left:-1.5rem;
  margin-right:-1.5rem;
  margin-top:-1.6rem;
  aspect-ratio:4/3;
  overflow:hidden;
  border-bottom:1px solid rgba(44,36,22,.08);
  margin-bottom:1.1rem;
  flex-shrink:0;
}
.sn-img img{width:100%;height:100%;object-fit:cover;display:block}
.sn-img-ph{
  width:100%;height:100%;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:.35rem;background:rgba(44,36,22,.05)
}
.sn-emoji{font-size:2.6rem;line-height:1}
.sn-img-hint{
  font-size:.55rem;letter-spacing:.12em;text-transform:uppercase;
  color:rgba(44,36,22,.28);font-family:var(--sans)
}

/* Tag + name always paired — tag sits left, small, above name */
.sn-header{
  margin-bottom:.65rem;
  flex-shrink:0;
}
.sn-tag{
  display:inline-flex;align-items:center;gap:4px;
  font-family:var(--hand);font-size:.78rem;font-weight:600;
  color:var(--green);
  margin-bottom:.2rem;
  line-height:1;
}
.sn-name{
  font-family:var(--hand);font-size:1.45rem;font-weight:700;
  color:var(--ink);line-height:1.18;
  /* No margin-bottom here — parent .sn-header owns spacing */
}

/* Description — flex:1 so it pushes variants+footer to the bottom */
.sn-desc{
  font-family:var(--serif);font-size:.76rem;font-style:italic;
  color:var(--ink2);line-height:1.72;
  flex:1;
  /* Clamp at 3 lines so long descs don't blow out card height */
  display:-webkit-box;
  -webkit-line-clamp:3;
  -webkit-box-orient:vertical;
  overflow:hidden;
}

/* Variants — fixed min-height so cards with fewer pills don't collapse */
.sn-variants{
  display:flex;flex-wrap:wrap;gap:5px;
  min-height:2rem; /* always reserves space even if 0 variants */
  align-content:flex-start;
  margin-top:.7rem;
  margin-bottom:.7rem;
  flex-shrink:0;
}
.sv{
  font-family:var(--hand);font-size:.82rem;font-weight:500;
  padding:3px 11px;border-radius:20px;
  background:rgba(44,36,22,.06);border:1px solid rgba(44,36,22,.1);color:var(--ink2);
  cursor:pointer;transition:background .15s,border-color .15s,color .15s;
  line-height:1.5;
}
.sv:hover{background:rgba(44,36,22,.12);color:var(--ink)}
.sv.on{background:var(--ink);border-color:var(--ink);color:var(--paper)}

/* Footer pinned: price left-aligned on baseline, button right */
.sn-foot{
  display:flex;align-items:center;justify-content:space-between;
  padding-top:.7rem;border-top:1px dashed rgba(44,36,22,.18);
  flex-shrink:0;
  gap:.5rem;
}
.sn-price{
  font-family:var(--hand);font-size:1.55rem;font-weight:700;
  color:var(--ink);line-height:1;
  /* Consistent baseline regardless of price string length */
  min-width:3.5rem;
}
.sn-add{
  display:flex;align-items:center;gap:6px;
  background:var(--ink);border:none;border-radius:40px;
  padding:7px 14px 7px 10px;
  font-family:var(--hand);font-size:.92rem;font-weight:600;
  color:var(--paper);cursor:pointer;
  transition:background .2s,transform .15s;
  white-space:nowrap;flex-shrink:0;
}
.sn-add:hover{background:var(--gold);transform:scale(1.04)}
.sn-add svg{width:13px;height:13px;flex-shrink:0}
@media(max-width:768px){.sn-add{min-height:44px}}

/* ── ABOUT ── */
.about-wrap{
  background:var(--paper2);
  border-top:1px solid var(--paper3);border-bottom:1px solid var(--paper3)
}
.about-grid{
  display:grid;grid-template-columns:1fr 1fr;
  gap:clamp(2.5rem,5vw,5rem);align-items:center
}
@media(max-width:720px){.about-grid{grid-template-columns:1fr}}

.about-visual{
  border-radius:var(--rlg);overflow:hidden;
  box-shadow:var(--shadow-lift);
  background:var(--paper3)
}
.about-img{
  width:100%;aspect-ratio:3/4;max-height:480px;
  background:var(--paper3);display:flex;align-items:center;justify-content:center
}
.about-img img{width:100%;height:100%;object-fit:cover;display:block}
.about-img-ph{display:flex;flex-direction:column;align-items:center;gap:.75rem}
.about-img-emoji{font-size:5rem;opacity:.5}
.about-img-hint{font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);font-family:var(--sans)}
.about-cap{
  padding:1.1rem 1.35rem;border-top:1px solid var(--paper3)
}
.about-cap-title{font-family:var(--hand);font-size:1.05rem;font-weight:600;color:var(--ink);margin-bottom:2px}
.about-cap-sub{font-size:.7rem;color:var(--ink3);font-weight:300}

.about-txt p{
  font-family:var(--serif);font-size:.9rem;color:var(--ink2);
  line-height:1.9;font-weight:400;margin-bottom:1.25rem
}
.about-pills{display:flex;flex-wrap:wrap;gap:7px;margin:1.5rem 0 2rem}
.about-pill{
  font-family:var(--hand);font-size:.9rem;font-weight:500;
  padding:5px 15px;border-radius:20px;
  background:var(--paper);border:1px solid var(--paper3);color:var(--ink2)
}

/* ── HOW IT WORKS ── */
.how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:2rem}
@media(max-width:620px){.how-grid{grid-template-columns:1fr}}
.how-card{
  background:var(--paper);border:1px solid var(--paper3);
  border-radius:var(--rlg);padding:1.65rem 1.5rem;
  box-shadow:var(--shadow);
  transition:transform .25s,box-shadow .25s
}
.how-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lift)}
.how-num{
  font-family:var(--hand);font-size:3.5rem;font-weight:700;
  color:var(--paper3);line-height:1;margin-bottom:.5rem
}
.how-title{font-family:var(--hand);font-size:1.25rem;font-weight:600;color:var(--ink);margin-bottom:.35rem}
.how-desc{font-family:var(--serif);font-size:.8rem;color:var(--ink2);line-height:1.8;font-style:italic}

.pickup-strip{
  margin-top:1rem;border-radius:var(--rlg);
  background:var(--ink);color:var(--paper);
  padding:1.75rem 2rem;
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.25rem;
  box-shadow:var(--shadow-lift)
}
.pickup-info{}
.pickup-lbl{font-family:var(--hand);font-size:.8rem;font-weight:500;color:var(--gold);margin-bottom:.25rem}
.pickup-val{font-family:var(--hand);font-size:1.3rem;font-weight:600;color:var(--paper);line-height:1.2}
.pickup-sub{font-size:.72rem;color:rgba(250,247,242,.55);font-weight:300;margin-top:2px}
.pickup-div{width:1px;height:44px;background:rgba(250,247,242,.15)}
@media(max-width:560px){.pickup-div{display:none}}
.btn-paper{
  background:var(--paper);color:var(--ink);font-family:var(--sans);
  font-size:.72rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;
  padding:12px 24px;border-radius:40px;border:none;cursor:pointer;
  text-decoration:none;transition:background .2s,transform .15s;white-space:nowrap;flex-shrink:0
}
.btn-paper:hover{background:var(--paper2);transform:translateY(-1px)}

/* ── JOURNAL ── */
.j-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:2rem}
@media(max-width:820px){.j-grid{grid-template-columns:1fr 1fr}}
@media(max-width:500px){.j-grid{grid-template-columns:1fr}}
.jcard{
  background:var(--paper);border:1px solid var(--paper3);
  border-radius:var(--rlg);padding:1.5rem;
  box-shadow:var(--shadow);cursor:pointer;
  transition:transform .25s,box-shadow .25s
}
.jcard:hover{transform:translateY(-4px);box-shadow:var(--shadow-lift)}
.jcard.feat{grid-column:span 2}
@media(max-width:820px){.jcard.feat{grid-column:span 1}}
.j-cat{
  font-family:var(--hand);font-size:.88rem;font-weight:500;
  color:var(--gold);margin-bottom:.55rem
}
.j-title{font-family:var(--hand);font-size:1.3rem;font-weight:600;color:var(--ink);line-height:1.3;margin-bottom:.45rem}
.jcard.feat .j-title{font-size:1.55rem}
.j-exc{font-family:var(--serif);font-size:.78rem;color:var(--ink2);line-height:1.8;font-style:italic;margin-bottom:1rem}
.j-foot{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem}
.j-date{font-size:.65rem;color:var(--ink3)}
.j-link{font-family:var(--hand);font-size:.95rem;font-weight:600;color:var(--gold);text-decoration:none;display:inline-flex;align-items:center;gap:5px;transition:gap .2s}
.j-link:hover{gap:9px}

/* ── NEWSLETTER ── */
.nl-wrap{
  margin:0 clamp(1.25rem,4vw,2.75rem) clamp(3rem,5vh,5rem);
  border-radius:var(--rxl);
  background:var(--paper2);border:1px solid var(--paper3);
  box-shadow:var(--shadow);
  padding:clamp(2rem,5vw,3.25rem);
  display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center
}
@media(max-width:600px){.nl-wrap{grid-template-columns:1fr;gap:1.75rem}}
.nl-title{font-family:var(--hand);font-size:clamp(1.5rem,3vw,2.2rem);font-weight:700;color:var(--ink);line-height:1.15;margin-bottom:.65rem}
.nl-title em{font-style:normal;color:var(--gold)}
.nl-sub{font-family:var(--serif);font-size:.85rem;color:var(--ink2);font-style:italic;line-height:1.8}
.nl-form{display:flex;flex-direction:column;gap:9px}
.nl-row{display:flex;border-radius:var(--rlg);overflow:hidden;border:1.5px solid var(--paper3);background:var(--paper)}
.nl-in{flex:1;background:transparent;border:none;outline:none;padding:12px 16px;font-family:var(--sans);font-size:.85rem;font-weight:300;color:var(--ink)}
.nl-in::placeholder{color:var(--ink3)}
.nl-btn{background:var(--ink);border:none;padding:12px 20px;font-family:var(--sans);font-size:.68rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--paper);cursor:pointer;transition:background .2s;white-space:nowrap}
.nl-btn:hover{background:var(--gold)}
.nl-note{font-size:.63rem;color:var(--ink3)}
.nl-ok{font-family:var(--hand);font-size:1.4rem;font-weight:600;color:var(--green);animation:fadeIn .5s ease}

/* ── FOOTER ── */
.footer{
  padding:2rem clamp(1.25rem,4vw,2.75rem);
  border-top:1px solid var(--paper3);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1.25rem;
  background:var(--paper2)
}
.f-logo{font-family:var(--hand);font-size:1.1rem;font-weight:600;color:var(--ink2)}
.f-copy{font-size:.63rem;color:var(--ink3);margin-top:3px}
.f-nav{display:flex;gap:1.75rem;list-style:none;flex-wrap:wrap}
.f-nav a{font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink3);text-decoration:none;transition:color .2s}
.f-nav a:hover{color:var(--ink)}

/* ── MOBILE STICKY BAR ── */
.sbar{
  display:none;position:fixed;bottom:0;left:0;right:0;
  padding:.75rem clamp(1rem,3vw,1.5rem);
  background:rgba(250,247,242,.94);
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
  border-top:1px solid var(--paper3);z-index:180;gap:9px
}
@media(max-width:768px){.sbar{display:flex};body{padding-bottom:70px}}
.sb-main{
  flex:1;text-align:center;
  background:var(--ink);color:var(--paper);
  font-size:.76rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;
  padding:13px;border-radius:var(--rlg);text-decoration:none;
}

.sb-ghost{flex:1;text-align:center;border:1.5px solid var(--paper3);color:var(--ink);font-size:.76rem;font-weight:400;letter-spacing:.07em;text-transform:uppercase;padding:12px;border-radius:var(--rlg);text-decoration:none}

/* ── PRODUCT DRAWER ── */
.pd-ov{
  position:fixed;inset:0;
  background:rgba(44,36,22,.55);
  backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
  z-index:300;opacity:0;pointer-events:none;
  transition:opacity .35s ease;
  display:flex;align-items:center;justify-content:center;
  padding:clamp(1rem,4vw,2rem);
}
.pd-ov.open{opacity:1;pointer-events:all}

.pd-panel{
  width:min(560px,94vw);
  max-height:88svh;
  overflow-y:auto;
  background:var(--paper);
  border-radius:8px;
  box-shadow:
    0 2px 0 rgba(255,255,255,.8) inset,
    0 -1px 0 rgba(44,36,22,.08) inset,
    0 32px 80px rgba(44,36,22,.35),
    0 8px 24px rgba(44,36,22,.2);
  /* Paper border feel */
  border:1px solid rgba(44,36,22,.1);
  border-bottom:2px solid rgba(44,36,22,.12);

  /* Start tiny+rotated, expand into place */
  transform:scale(.88) rotate(-1.5deg);
  opacity:0;
  transition:
    transform .42s cubic-bezier(.34,1.28,.64,1),
    opacity .3s ease;
  transform-origin:center center;

  /* Subtle paper gradient */
  background-image:
    linear-gradient(180deg,rgba(255,255,255,.6) 0%,transparent 60%),
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 27px,
      rgba(44,36,22,.03) 27px,
      rgba(44,36,22,.03) 28px
    );
}
.pd-panel.open{
  transform:scale(1) rotate(0deg);
  opacity:1;
}

/* Fold crease at top — like the note was folded open */
.pd-panel::before{
  content:'';
  position:absolute;
  top:0;left:0;right:0;
  height:3px;
  background:linear-gradient(90deg,
    rgba(44,36,22,.06) 0%,
    rgba(44,36,22,.12) 30%,
    rgba(44,36,22,.06) 60%,
    rgba(44,36,22,.1) 100%
  );
  border-radius:8px 8px 0 0;
  z-index:1;
}

.pd-in{padding:clamp(1.5rem,4vw,2.25rem)}

/* Pull handle — hide in modal */
.pd-handle{display:none}

.pd-close{
  position:absolute;top:1rem;right:1rem;
  width:34px;height:34px;border-radius:50%;
  background:var(--paper2);border:1px solid var(--paper3);
  color:var(--ink);font-size:.9rem;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:background .2s,transform .15s;
  z-index:10;
}
.pd-close:hover{background:var(--paper3);transform:scale(1.08)}

.pd-img{
  width:100%;aspect-ratio:4/3;border-radius:var(--rlg);
  background:var(--paper2);overflow:hidden;margin-bottom:1.4rem;
  border:1px solid var(--paper3)
}
.pd-img img{width:100%;height:100%;object-fit:cover;display:block}
.pd-img-ph{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.5rem}
.pd-emoji{font-size:4rem}
.pd-img-note{font-size:.58rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink3);font-family:var(--sans)}

.pd-tag-row{display:flex;gap:7px;margin-bottom:.85rem}
.pd-tag{
  font-family:var(--hand);font-size:.85rem;font-weight:500;
  padding:3px 12px;border-radius:20px;background:rgba(74,124,78,.1);
  color:var(--green);border:1px solid rgba(74,124,78,.2)
}
.pd-name{font-family:var(--hand);font-size:1.9rem;font-weight:700;color:var(--ink);margin-bottom:.4rem;line-height:1.15}
.pd-desc{font-family:var(--serif);font-size:.83rem;color:var(--ink2);font-style:italic;line-height:1.8;margin-bottom:1.3rem}

.pd-lbl{font-family:var(--hand);font-size:.85rem;font-weight:600;color:var(--ink3);margin-bottom:.55rem;display:block}
.pd-variants{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:1.25rem}
.pv{
  font-family:var(--hand);font-size:.95rem;font-weight:500;
  padding:6px 16px;border-radius:20px;
  background:transparent;border:1.5px solid var(--paper3);color:var(--ink2);
  cursor:pointer;transition:all .15s;min-height:40px
}
.pv:hover{border-color:var(--ink3);color:var(--ink)}
.pv.on{background:var(--ink);border-color:var(--ink);color:var(--paper)}

.pd-vegan-row{
  display:flex;align-items:center;justify-content:space-between;gap:1rem;
  background:rgba(74,124,78,.07);border:1px solid rgba(74,124,78,.18);
  border-radius:var(--r);padding:.9rem 1.1rem;margin-bottom:1.25rem
}
.pd-vegan-l{}
.pd-vegan-title{font-family:var(--hand);font-size:1rem;font-weight:600;color:var(--green);margin-bottom:2px}
.pd-vegan-note{font-family:var(--serif);font-size:.72rem;color:rgba(74,124,78,.7);font-style:italic;line-height:1.5}
.toggle{
  width:42px;height:24px;border-radius:12px;
  background:var(--paper3);border:1.5px solid var(--paper3);
  cursor:pointer;flex-shrink:0;transition:background .2s;
}
.toggle.on{background:var(--green-lt)}
.toggle-k{
  position:absolute;top:2px;left:2px;
  width:18px;height:18px;border-radius:50%;
  background:var(--paper);box-shadow:0 1px 3px rgba(0,0,0,.2);
  transition:transform .2s
}
.toggle.on .toggle-k{transform:translateX(18px)}

.pd-qty{display:flex;align-items:center;gap:12px;margin-bottom:1.25rem}
.qty-l{font-family:var(--hand);font-size:.9rem;font-weight:600;color:var(--ink3);flex:1}
.qty-row{display:flex;align-items:center;gap:0;border:1.5px solid var(--paper3);border-radius:var(--r);overflow:hidden}
.qb{
  width:38px;height:38px;background:var(--paper2);border:none;
  color:var(--ink);font-size:1.1rem;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:background .15s
}
.qb:hover{background:var(--paper3)}
.qty-n{min-width:38px;text-align:center;font-family:var(--hand);font-size:1.1rem;font-weight:700;color:var(--ink)}

.pd-foot{
  display:flex;align-items:center;justify-content:space-between;
  flex-wrap:wrap;gap:.75rem;padding-top:1.1rem;border-top:1px dashed var(--paper3)
}
.pd-price{font-family:var(--hand);font-size:2.1rem;font-weight:700;color:var(--ink)}
.pd-add{
  flex:1;background:var(--ink);border:none;border-radius:40px;
  font-family:var(--hand);font-size:1.05rem;font-weight:700;
  color:var(--paper);cursor:pointer;padding:13px 20px;
  transition:background .2s,transform .15s;min-height:48px
}
.pd-add:hover{background:var(--gold);transform:translateY(-1px)}
.pd-add.done{background:var(--green)}
.pd-add.disabled{opacity:.4;cursor:default}

/* ── CATEGORY TIER ROWS ── */
.cat-tier{margin-bottom:1.25rem}
.cat-tier-label{
  font-family:var(--hand);font-size:.82rem;font-weight:600;
  color:var(--ink3);letter-spacing:.04em;
  padding-bottom:.4rem;margin-bottom:.5rem;
  border-bottom:1px dashed var(--paper3);
}
.cat-row{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:1rem;padding:.7rem 0;
  border-bottom:1px solid rgba(44,36,22,.05);
}
.cat-row:last-child{border-bottom:none}
.cat-row-left{display:flex;align-items:flex-start;gap:.75rem;flex:1;min-width:0}
.cat-swatch{
  width:28px;height:28px;border-radius:6px;
  flex-shrink:0;margin-top:2px;
  border:1px solid rgba(44,36,22,.12);
  box-shadow:0 1px 3px rgba(44,36,22,.1);
}
.cat-row-info{flex:1;min-width:0}
.cat-row-name{
  font-family:var(--hand);font-size:1rem;font-weight:500;
  color:var(--ink);line-height:1.3;
}
.cat-row-note{
  font-family:var(--serif);font-size:.75rem;font-style:italic;
  color:var(--ink3);line-height:1.5;margin-top:2px;
}
.cat-row-right{display:flex;align-items:center;gap:.75rem;flex-shrink:0;padding-top:2px}
.cat-row-price{
  font-family:var(--hand);font-size:1rem;font-weight:600;
  color:var(--gold);min-width:2.5rem;text-align:right;
}
.cat-qty{
  display:flex;align-items:center;gap:0;
  border:1.5px solid var(--paper3);border-radius:var(--r);overflow:hidden;
}
.cat-qbtn{
  width:32px;height:32px;background:var(--paper2);border:none;
  color:var(--ink);font-size:1rem;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:background .15s;
}
.cat-qbtn:hover{background:var(--paper3)}
.cat-qnum{
  min-width:28px;text-align:center;
  font-family:var(--hand);font-size:1rem;font-weight:700;color:var(--ink);
}
.cat-coming{
  font-family:var(--serif);font-size:.78rem;font-style:italic;
  color:var(--ink3);text-align:center;
  padding:.75rem 1rem;
  background:var(--paper2);border-radius:var(--r);
  margin-bottom:.5rem;
}
/* ── CART PILL ── */
.cart-pill{
  position:fixed;bottom:1.5rem;right:1.5rem;z-index:250;
  display:flex;align-items:center;gap:10px;
  background:var(--ink);color:var(--paper);
  font-family:var(--hand);font-size:1.05rem;font-weight:600;
  padding:12px 20px 12px 16px;border-radius:40px;
  box-shadow:0 4px 20px rgba(44,36,22,.25),0 1px 4px rgba(44,36,22,.15);
  cursor:pointer;border:none;
  transform:translateY(80px);opacity:0;pointer-events:none;
  transition:transform .35s cubic-bezier(.34,1.28,.64,1),opacity .3s ease;
}
.cart-pill.visible{transform:translateY(0);opacity:1;pointer-events:all}
.cart-pill:hover{background:var(--ink2);transform:translateY(-2px)}
.cart-pill.visible:hover{transform:translateY(-2px)}
.cart-badge{
  width:22px;height:22px;border-radius:50%;
  background:var(--gold);color:var(--ink);
  font-size:.72rem;font-weight:700;
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;
}
@media(max-width:768px){
  .cart-pill{bottom:5.5rem;right:1rem}
}

/* ── ORDER FORM MODAL ── */
.order-ov{
  position:fixed;inset:0;
  background:rgba(44,36,22,.6);
  backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);
  z-index:400;opacity:0;pointer-events:none;
  display:flex;align-items:center;justify-content:center;
  padding:clamp(1rem,4vw,2rem);
  transition:opacity .35s ease;
}
.order-ov.open{opacity:1;pointer-events:all}
.order-modal{
  width:min(600px,96vw);
  max-height:90svh;overflow-y:auto;
  background:var(--paper);
  border-radius:12px;
  box-shadow:0 24px 80px rgba(44,36,22,.3),0 4px 16px rgba(44,36,22,.15);
  border:1px solid var(--paper3);
  transform:scale(.92) translateY(16px);opacity:0;
  transition:transform .4s cubic-bezier(.34,1.2,.64,1),opacity .3s ease;
}
.order-ov.open .order-modal{transform:scale(1) translateY(0);opacity:1}
.order-inner{padding:clamp(1.5rem,4vw,2.25rem)}
.order-close{
  position:absolute;top:1rem;right:1rem;
  width:34px;height:34px;border-radius:50%;
  background:var(--paper2);border:1px solid var(--paper3);
  color:var(--ink);font-size:.9rem;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  transition:background .2s;z-index:2;
}
.order-close:hover{background:var(--paper3)}
.order-title{
  font-family:var(--hand);font-size:1.8rem;font-weight:700;
  color:var(--ink);margin-bottom:.3rem;
}
.order-sub{
  font-family:var(--serif);font-size:.83rem;font-style:italic;
  color:var(--ink3);margin-bottom:1.5rem;line-height:1.6;
}

/* Cart summary inside order modal */
.order-cart{
  background:var(--paper2);border:1px solid var(--paper3);
  border-radius:var(--r);padding:1rem 1.15rem;
  margin-bottom:1.5rem;
}
.order-cart-title{
  font-family:var(--hand);font-size:.8rem;font-weight:600;
  letter-spacing:.08em;text-transform:uppercase;color:var(--ink3);
  margin-bottom:.65rem;
}
.order-cart-row{
  display:flex;justify-content:space-between;align-items:baseline;
  gap:.5rem;padding:.3rem 0;font-size:.83rem;
  border-bottom:1px solid rgba(44,36,22,.05);
}
.order-cart-row:last-child{border-bottom:none}
.order-cart-name{font-family:var(--hand);font-size:.95rem;color:var(--ink);flex:1}
.order-cart-qty{font-size:.75rem;color:var(--ink3);flex-shrink:0}
.order-cart-price{font-family:var(--hand);font-size:.95rem;color:var(--gold);flex-shrink:0}
.order-cart-total{
  display:flex;justify-content:space-between;align-items:baseline;
  padding-top:.65rem;margin-top:.5rem;border-top:1px dashed var(--paper3);
}
.order-cart-total-label{font-family:var(--hand);font-size:.85rem;font-weight:600;color:var(--ink3)}
.order-cart-total-amt{font-family:var(--hand);font-size:1.4rem;font-weight:700;color:var(--ink)}

/* Form fields */
.form-row{margin-bottom:1rem}
.form-label{
  display:block;font-family:var(--hand);font-size:.85rem;font-weight:600;
  color:var(--ink3);margin-bottom:.35rem;
}
.form-input,.form-textarea{
  width:100%;font-family:var(--sans);font-size:.88rem;font-weight:300;
  color:var(--ink);background:var(--paper);
  border:1.5px solid var(--paper3);border-radius:var(--r);
  padding:10px 14px;outline:none;
  transition:border-color .2s;
}
.form-input:focus,.form-textarea:focus{border-color:var(--ink3)}
.form-textarea{min-height:80px;resize:vertical;line-height:1.6}
.form-hint{font-size:.68rem;color:var(--ink3);margin-top:.3rem;font-style:italic}
.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
@media(max-width:460px){.form-2col{grid-template-columns:1fr}}

/* Submit buttons */
.order-submit-wa{
  width:100%;background:#25D366;color:#fff;
  font-family:var(--hand);font-size:1.05rem;font-weight:700;
  border:none;border-radius:40px;padding:15px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
  transition:background .2s,transform .15s;margin-bottom:.65rem;
}
.order-submit-wa:hover{background:#1fb959;transform:translateY(-1px)}
.order-submit-wa:disabled{opacity:.4;cursor:default;transform:none}
.wa-icon{width:20px;height:20px;flex-shrink:0}
.order-submit-email{
  width:100%;background:transparent;color:var(--ink);
  font-family:var(--sans);font-size:.75rem;font-weight:500;letter-spacing:.08em;
  text-transform:uppercase;border:1.5px solid var(--paper3);
  border-radius:40px;padding:12px;cursor:pointer;
  transition:border-color .2s,background .2s;
}
.order-submit-email:hover{border-color:var(--ink3);background:var(--paper2)}
.order-submit-email:disabled{opacity:.4;cursor:default}
.order-note{
  font-size:.68rem;color:var(--ink3);text-align:center;
  margin-top:.75rem;line-height:1.6;font-style:italic;
}
.order-success{
  text-align:center;padding:2rem 1rem;
}
.order-success-icon{font-size:3rem;margin-bottom:1rem;display:block}
.order-success-title{font-family:var(--hand);font-size:1.6rem;font-weight:700;color:var(--ink);margin-bottom:.5rem}
.order-success-msg{font-family:var(--serif);font-size:.88rem;font-style:italic;color:var(--ink2);line-height:1.8}

/* ── CONTACT SECTION ── */
.contact-grid{
  display:grid;grid-template-columns:1fr 1fr;gap:1.1rem;margin-top:2rem;
}
@media(max-width:600px){.contact-grid{grid-template-columns:1fr}}
.contact-card{
  background:var(--paper);border:1px solid var(--paper3);
  border-radius:var(--rxl);padding:1.5rem 1.5rem;
  box-shadow:0 2px 12px rgba(44,36,22,.07);
  display:flex;flex-direction:column;gap:.4rem;
  text-decoration:none;color:inherit;
  transition:transform .25s,box-shadow .25s,border-color .25s;
}
.contact-card:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(44,36,22,.12);border-color:var(--ink3)}
.contact-card-icon{font-size:1.6rem;margin-bottom:.25rem;display:block}
.contact-card-label{font-size:.6rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink3)}
.contact-card-val{font-family:var(--hand);font-size:1.15rem;font-weight:600;color:var(--ink)}
.contact-card-hint{font-size:.72rem;color:var(--ink3);font-style:italic}

/* ── SOCIAL LINKS ── */
.social-links{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.social-link{
  display:flex;align-items:center;gap:6px;
  font-size:.65rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
  color:var(--ink3);text-decoration:none;
  padding:6px 14px;border:1px solid var(--paper3);border-radius:20px;
  transition:color .2s,border-color .2s;
}
.social-link:hover{color:var(--ink);border-color:var(--ink3)}

`;

/* ── STICKY NOTE CONFIG ──────────────────────────────────────── */
const NOTES = [
  { bg:"#FFF3A3", border:"#E8DC6A", pin:"#E8A820", rot:"-1.5deg", delay:"0s"   },
  { bg:"#B8D8F8", border:"#7AAED4", pin:"#4A90C4", rot:"1.2deg",  delay:".07s" },
  { bg:"#FFB8C8", border:"#E8809A", pin:"#C06080", rot:"-0.8deg", delay:".14s" },
];

/* ── MENU DATA ─────────────────────────────────────────────── */
/*
  Structure: each entry is a CATEGORY (one sticky note).
  items[]  — all orderable options inside the category
    tier   — optional grouping label shown inside the modal
    name   — item name
    price  — exact price in Rands
*/
const MENU = [
  {
    id:1, emoji:"🍰", img:null,
    name:"Mini Loaf Cakes",
    desc:"Individually sized loaf cakes, baked fresh to order. Seven flavours across three tiers.",
    priceRange:"R42 – R48",
    badge:"Eggless",
    tiers:[
      {
        label:"Classic — R42 each",
        items:[
          { id:"vanilla",   name:"Vanilla",   price:42, swatch:"#F5E6C8", note:"Soft, buttery, pure — the one that never disappoints" },
          { id:"burfi",     name:"Burfi",      price:42, swatch:"#E8D4A0", note:"Cardamom and rose, inspired by the classic Indian sweet" },
        ]
      },
      {
        label:"Premium — R45 each",
        items:[
          { id:"chocolate", name:"Chocolate",  price:45, swatch:"#5C3317", note:"Deep, fudgy, rich — proper chocolate, not cocoa powder" },
          { id:"mocha",     name:"Mocha",       price:45, swatch:"#7B4F2E", note:"Espresso and dark chocolate, for coffee lovers" },
          { id:"carrot",    name:"Carrot",      price:45, swatch:"#D4701A", note:"Warmly spiced, moist, topped with cream cheese glaze" },
        ]
      },
      {
        label:"Specialty — R48 each",
        items:[
          { id:"redvelvet", name:"Red Velvet",  price:48, swatch:"#C0392B", note:"Velvety crumb, subtle cocoa, cream cheese finish" },
          { id:"hotchoc",   name:"Hot Chocolate",price:48, swatch:"#3D1A0A", note:"Intense dark chocolate with a warming spiced finish" },
        ]
      },
    ],
  },
  {
    id:2, emoji:"🌀", img:null,
    name:"Cinnamon Rolls",
    desc:"Soft, pillowy rolls with generous glazes and toppings. Available in duo, sharing tray, and family sizes.",
    priceRange:"R60 – R150",
    badge:"Eggless",
    tiers:[
      {
        label:"Duo",
        items:[
          { id:"duo-choc-caramel", name:"2 Large Rolls", price:60, swatch:"#C47A1E", note:"Chocolate & caramel drizzle — sticky, indulgent, generous" },
        ]
      },
      {
        label:"Sharing tray",
        items:[
          { id:"tray-8-cream", name:"8 Small Rolls", price:105, swatch:"#F0E6D0", note:"Cream cheese frosting & pecans — tangy, nutty, perfect with tea" },
        ]
      },
      {
        label:"Family tray",
        items:[
          { id:"tray-12-glaze",  name:"12 Medium Rolls — Classic Glaze",           price:140, swatch:"#EDD9A3", note:"Simple, sweet glaze — the crowd-pleaser for any table" },
          { id:"tray-12-almond", name:"12 Medium Rolls — Classic Glaze & Almonds", price:150, swatch:"#D4B483", note:"Toasted sliced almonds add crunch to the classic" },
        ]
      },
    ],
    comingSoon:"More flavours and fillings coming soon.",
  },
  {
    id:3, emoji:"🍮", img:null,
    name:"Milk Cake",
    desc:"A rich, creamy South African classic. Choose your flavour and your serving size.",
    priceRange:"R120 – R150",
    badge:"Eggless",
    tiers:[
      {
        label:"Pistachio & Cream",
        items:[
          { id:"pist-sm", name:"Serves 4–6", price:120, swatch:"#A8C878", note:"Delicate, nutty, beautiful pale green — elegant and light" },
          { id:"pist-lg", name:"Serves 8",   price:140, swatch:"#A8C878", note:"Same gorgeous flavour, bigger celebration" },
        ]
      },
      {
        label:"Strawberries & Cream",
        items:[
          { id:"straw-sm", name:"Serves 4–6", price:130, swatch:"#E8748A", note:"Fresh strawberries, lush cream — bright and summery" },
          { id:"straw-lg", name:"Serves 8",   price:150, swatch:"#E8748A", note:"The showstopper version — perfect for a birthday" },
        ]
      },
    ],
  },
];

const POSTS = [
  {cat:"Behind the bake",title:"Why we cold-proof our croissant dough for 72 hours",  excerpt:"The science of slow fermentation — why patience makes better layers.",date:"12 Mar 2026",read:"8 min",feat:true},
  {cat:"Recipe",          title:"Making our focaccia vegan without compromise",          excerpt:"How one swap changes nothing about flavour or texture.",            date:"5 Mar 2026", read:"5 min",feat:false},
  {cat:"Ingredients",     title:"On flour: why stone-ground matters",                   excerpt:"Texture, flavour, and the miller we source from.",                  date:"28 Feb 2026",read:"4 min",feat:false},
];

/* ── CATEGORY STICKY NOTE ─────────────────────────────────── */
function StickyNote({ item, note, onOpen }) {
  const ref    = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const handleMouseMove = (e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
      const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
      el.style.transform = `rotate(0deg) translate(${dx*4}px,${-8 + dy*1.5}px) rotateX(${-dy*8}deg) rotateY(${dx*8}deg) scale(1.02)`;
      el.style.transition = 'box-shadow .35s ease';
    });
  };
  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const el = ref.current;
    if (!el) return;
    el.style.transform = `rotate(var(--rot,0deg))`;
    el.style.transition = 'transform .5s cubic-bezier(.34,1.2,.64,1), box-shadow .35s ease';
  };
  const handleMouseDown = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `rotate(0deg) translateY(-3px) scale(0.99)`;
    el.style.transition = 'transform .08s ease, box-shadow .08s ease';
  };
  const handleMouseUp = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `rotate(0deg) translateY(-8px) scale(1.02)`;
    el.style.transition = 'transform .2s cubic-bezier(.34,1.4,.64,1), box-shadow .2s ease';
  };

  // Count total items across all tiers
  const totalItems = item.tiers.reduce((sum, t) => sum + t.items.length, 0);

  return (
    <div
      ref={ref}
      className="sn"
      style={{
        "--rot":        note.rot,
        "--delay":      note.delay,
        "--border-col": note.border,
        "--pin-col":    note.pin,
        background:     note.bg,
        transformStyle: "preserve-3d",
        perspective:    "800px",
      }}
      onClick={() => onOpen(item, note.bg)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="sn-glow"/>
      <div className="sn-tape"/>
      <div className="sn-pin"/>

      <div className="sn-img">
        {item.img
          ? <img src={item.img} alt={item.name} loading="lazy"/>
          : <div className="sn-img-ph">
              <span className="sn-emoji">{item.emoji}</span>
              <span className="sn-img-hint">Add photo</span>
            </div>
        }
      </div>

      <div className="sn-header">
        <div className="sn-tag">🌱 {item.badge}</div>
        <div className="sn-name">{item.name}</div>
      </div>

      <div className="sn-desc">{item.desc}</div>

      {/* Tier count teaser */}
      <div className="sn-variants">
        <span className="sv on" style={{pointerEvents:"none"}}>
          {totalItems} options
        </span>
        <span className="sv" style={{pointerEvents:"none"}}>
          {item.priceRange}
        </span>
      </div>

      <div className="sn-foot">
        <div className="sn-price">from {item.priceRange.split(' ')[0]}</div>
        <button
          className="sn-add"
          onClick={e => { e.stopPropagation(); onOpen(item, note.bg); }}
          aria-label={`View ${item.name}`}
        >
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 7h12M8 2l5 5-5 5"/>
          </svg>
          View & order
        </button>
      </div>
    </div>
  );
}

/* ── CATEGORY MODAL ─────────────────────────────────────────── */
function CategoryModal({ item, noteColor, onClose, onAdd }) {
  const [quantities, setQuantities] = useState({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (item) { setQuantities({}); setDone(false); }
  }, [item]);

  if (!item) return null;

  const setQty = (id, delta) => {
    setQuantities(prev => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: next };
    });
  };

  const allItems = item.tiers.flatMap(t => t.items);
  const total = allItems.reduce((sum, it) => sum + (quantities[it.id] || 0) * it.price, 0);
  const totalQty = allItems.reduce((sum, it) => sum + (quantities[it.id] || 0), 0);

  const handleOrder = () => {
    if (totalQty === 0) return;
    onAdd(quantities, item.name);
    setDone(true);
    setTimeout(() => { onClose(); setDone(false); }, 900);
  };

  return (
    <div className="pd-in">
      {noteColor && (
        <div style={{
          position:"absolute",top:0,left:0,right:0,height:"6px",
          background:noteColor,borderRadius:"8px 8px 0 0",opacity:.7,
        }}/>
      )}
      <button className="pd-close" onClick={onClose} aria-label="Close">✕</button>

      <div className="pd-img" style={{marginTop:"1rem"}}>
        {item.img
          ? <img src={item.img} alt={item.name} loading="lazy"/>
          : <div className="pd-img-ph">
              <span className="pd-emoji">{item.emoji}</span>
              <span className="pd-img-note">Add your photo to /public/images/</span>
            </div>
        }
      </div>

      <div className="pd-tag-row">
        <span className="pd-tag">🌱 {item.badge}</span>
      </div>
      <div className="pd-name">{item.name}</div>
      <div className="pd-desc">{item.desc}</div>

      {/* Tier groups */}
      {item.tiers.map(tier => (
        <div key={tier.label} className="cat-tier">
          <div className="cat-tier-label">{tier.label}</div>
          {tier.items.map(it => (
            <div key={it.id} className="cat-row">
              <div className="cat-row-left">
                {it.swatch && (
                  <div className="cat-swatch" style={{background:it.swatch}} aria-hidden="true"/>
                )}
                <div className="cat-row-info">
                  <div className="cat-row-name">{it.name}</div>
                  {it.note && <div className="cat-row-note">{it.note}</div>}
                </div>
              </div>
              <div className="cat-row-right">
                <div className="cat-row-price">R{it.price}</div>
                <div className="cat-qty">
                  <button className="cat-qbtn" onClick={() => setQty(it.id, -1)} aria-label={`Remove ${it.name}`}>−</button>
                  <span className="cat-qnum">{quantities[it.id] || 0}</span>
                  <button className="cat-qbtn" onClick={() => setQty(it.id,  1)} aria-label={`Add ${it.name}`}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Coming soon note */}
      {item.comingSoon && (
        <div className="cat-coming">{item.comingSoon}</div>
      )}

      {/* Order footer */}
      <div className="pd-foot" style={{marginTop:"1.25rem"}}>
        <div>
          <div style={{fontSize:".65rem",fontWeight:500,letterSpacing:".1em",textTransform:"uppercase",color:"var(--ink3)",marginBottom:"2px"}}>
            {totalQty > 0 ? `${totalQty} item${totalQty > 1 ? "s" : ""}` : "Nothing selected yet"}
          </div>
          <div className="pd-price">{total > 0 ? `R${total}` : "—"}</div>
        </div>
        <button
          className={`pd-add${done ? " done" : ""}${totalQty === 0 ? " disabled" : ""}`}
          onClick={handleOrder}
          disabled={totalQty === 0}
        >
          {done ? "✓ Added!" : "Add to order"}
        </button>
      </div>
    </div>
  );
}

/* ── ORDER FORM MODAL ───────────────────────────────────────── */
/*
  CONFIGURATION — update these before going live:
  WHATSAPP_NUMBER: client's WhatsApp number in international format, no + or spaces
  CONTACT_EMAIL:   client's email for the mailto fallback
*/
const WHATSAPP_NUMBER = "27600000000"; // ← replace with real number
const CONTACT_EMAIL   = "orders@thetreattable.co.za"; // ← replace with real email

function OrderModal({ cart, onClose, onClearCart }) {
  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [date,    setDate]    = useState("");
  const [notes,   setNotes]   = useState("");
  const [sent,    setSent]    = useState(false);
  const firstRef = useRef(null);

  // Focus trap
  useEffect(() => {
    if (firstRef.current) firstRef.current.focus();
    const prev = document.activeElement;
    return () => { if (prev?.focus) prev.focus(); };
  }, []);

  const cartLines = Object.entries(cart).map(([key, {name: n, price: p, qty: q}]) => ({key, n, p, q}));
  const total = cartLines.reduce((s, {p, q}) => s + p * q, 0);
  const totalQty = cartLines.reduce((s, {q}) => s + q, 0);

  const isValid = name.trim().length > 1 && phone.trim().length > 6 && date.trim().length > 0;

  const buildMessage = () => {
    const lines = cartLines.map(({n, p, q}) => `  • ${q}x ${n} — R${p * q}`).join("\n");
    return `Hi! I'd like to place an order from The Treat Table 🎂\n\n*Order:*\n${lines}\n\n*Total: R${total}*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Pickup date:* ${date}${notes ? `\n*Notes:* ${notes}` : ""}`;
  };

  const handleWhatsApp = () => {
    if (!isValid) return;
    const msg = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setSent(true);
    setTimeout(() => { onClearCart(); onClose(); setSent(false); }, 3000);
  };

  const handleEmail = () => {
    if (!isValid) return;
    const subject = encodeURIComponent("Order from The Treat Table");
    const body = encodeURIComponent(buildMessage().replace(/\*/g, ""));
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => { onClearCart(); onClose(); setSent(false); }, 3000);
  };

  // Minimum pickup date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="order-inner">
      <button className="order-close" onClick={onClose} aria-label="Close">✕</button>

      {sent ? (
        <div className="order-success">
          <span className="order-success-icon">🎉</span>
          <div className="order-success-title">Order sent!</div>
          <div className="order-success-msg">
            We'll be in touch to confirm your order and pickup time. Thank you!
          </div>
        </div>
      ) : (
        <>
          <div className="order-title">Place your order</div>
          <div className="order-sub">Give us 24 hours and we'll bake it fresh for you.</div>

          {/* Cart summary */}
          <div className="order-cart">
            <div className="order-cart-title">Your order</div>
            {cartLines.map(({key, n, p, q}) => (
              <div key={key} className="order-cart-row">
                <div className="order-cart-name">{n}</div>
                <div className="order-cart-qty">×{q}</div>
                <div className="order-cart-price">R{p * q}</div>
              </div>
            ))}
            <div className="order-cart-total">
              <div className="order-cart-total-label">Total</div>
              <div className="order-cart-total-amt">R{total}</div>
            </div>
          </div>

          {/* Contact details */}
          <div className="form-2col">
            <div className="form-row">
              <label className="form-label" htmlFor="ord-name">Your name</label>
              <input
                ref={firstRef}
                id="ord-name" className="form-input" type="text"
                placeholder="e.g. Fatima" value={name}
                onChange={e => setName(e.target.value)} required
              />
            </div>
            <div className="form-row">
              <label className="form-label" htmlFor="ord-phone">WhatsApp number</label>
              <input
                id="ord-phone" className="form-input" type="tel"
                placeholder="e.g. 083 123 4567" value={phone}
                onChange={e => setPhone(e.target.value)} required
              />
            </div>
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="ord-date">Pickup date</label>
            <input
              id="ord-date" className="form-input" type="date"
              min={minDate} value={date}
              onChange={e => setDate(e.target.value)} required
            />
            <div className="form-hint">Minimum 24 hours from today</div>
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="ord-notes">Special requests <span style={{fontWeight:300}}>(optional)</span></label>
            <textarea
              id="ord-notes" className="form-textarea"
              placeholder="e.g. no nuts, extra cream cheese, allergies..."
              value={notes} onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button className="order-submit-wa" onClick={handleWhatsApp} disabled={!isValid}>
            <svg className="wa-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Send order via WhatsApp
          </button>
          <button className="order-submit-email" onClick={handleEmail} disabled={!isValid}>
            Or send via email
          </button>
          <div className="order-note">
            We'll confirm your order and give you a pickup time via WhatsApp within a few hours.
          </div>
        </>
      )}
    </div>
  );
}

/* ── PAGE ───────────────────────────────────────────────────── */
export default function BakeryHomepage() {
  const [scrolled,   setScrolled]   = useState(false);
  const [drawer,     setDrawer]     = useState(false);
  const [email,      setEmail]      = useState("");
  const [subbed,     setSubbed]     = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [pdOpen,     setPdOpen]     = useState(false);
  // cart: { [uniqueKey]: { name, price, qty, category } }
  const [cart,       setCart]       = useState({});
  const [orderOpen,  setOrderOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (drawer || pdOpen || orderOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawer, pdOpen, orderOpen]);

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") { setPdOpen(false); setDrawer(false); setOrderOpen(false); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const openProduct = (item, noteBg) => {
    setActiveItem(item); setActiveNote(noteBg ?? null); setPdOpen(true);
  };
  const closeProduct = () => {
    setPdOpen(false);
    setTimeout(() => setActiveItem(null), 420);
  };

  const addToCart = useCallback((quantities, categoryName) => {
    setCart(prev => {
      const next = { ...prev };
      Object.entries(quantities).forEach(([id, qty]) => {
        if (qty <= 0) return;
        // find item details from MENU
        let itemName = id, itemPrice = 0;
        MENU.forEach(cat => cat.tiers.forEach(tier => {
          const found = tier.items.find(it => it.id === id);
          if (found) { itemName = found.name; itemPrice = found.price; }
        }));
        const key = id;
        if (next[key]) {
          next[key] = { ...next[key], qty: next[key].qty + qty };
        } else {
          next[key] = { name: itemName, price: itemPrice, qty, category: categoryName };
        }
      });
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  const cartTotal = Object.values(cart).reduce((s, {price, qty}) => s + price * qty, 0);
  const cartQty   = Object.values(cart).reduce((s, {qty}) => s + qty, 0);

  return (
    <>
      <style>{S}</style>

      {/* NAV */}
      <nav className={`nav${scrolled ? " on" : ""}`}>
        <a href="#" className="logo">
          <div className="logo-mark">TT</div>
          The Treat Table
        </a>
        <ul className="nav-mid">
          <li><a href="#menu">Menu</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#journal">Journal</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-r">
          <button className="nav-pill" onClick={() => cartQty > 0 ? setOrderOpen(true) : document.querySelector('#menu').scrollIntoView({behavior:'smooth'})}><div className="ndot"/><span>{cartQty > 0 ? `Order (${cartQty})` : "Order now"}</span></button>
          <button className="burger" aria-label="Open menu" onClick={() => setDrawer(true)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`ov${drawer ? " open" : ""}`} onClick={() => setDrawer(false)}/>
      <div className={`mdrawer${drawer ? " open" : ""}`}>
        {["Menu","About","Journal"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setDrawer(false)}>{l}</a>
        ))}
        <a href="#menu" className="mdrawer-cta" onClick={() => setDrawer(false)}>Place a pre-order →</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-deco hero-deco-1"/>
        <div className="hero-deco hero-deco-2"/>

        <div className="hero-badge">
          <div className="live"><div className="ldot"/>Taking orders</div>
          <span style={{color:"var(--paper3)"}}>·</span>
          24hr notice · Ladysmith pickup
        </div>

        <h1 className="hero-h1">Made fresh.<br/>Made for <em>you.</em></h1>

        <p className="hero-sub">
          Every loaf, tart and pastry baked to your order.
          Always eggless — vegan on request.
          Pick up from our kitchen. 24 hours notice.
        </p>

        <div className="hero-btns">
          <a href="#menu" className="btn-ink">See the full menu</a>
          <a href="#about" className="btn-outline">Our story</a>
        </div>

        <div className="hero-stats">
          {[
            {icon:"⏱",label:"24h pre-order"},
            {icon:"🌱",label:"Always eggless"},
            {icon:"🌿",label:"Vegan on request"},
            {icon:"🏠",label:"Home kitchen"},
          ].map(s => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-icon">{s.icon}</span>
              {s.label}
            </div>
          ))}
        </div>

        <div className="scroll-cue">
          <div className="scroll-line"/>
          <div className="scroll-lbl">Scroll</div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-t">
          {[0,1].map(i=>(
            <div key={i} style={{display:"flex",alignItems:"center"}}>
              {["Baked to order","Always eggless","Vegan on request","24hr notice","Pickup from Ladysmith","Home kitchen","No preservatives · No shortcuts"].map((t,j)=>(
                <div key={j} className="tick">{t}<div className="tsep"/></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* MENU */}
      <section className="sec" id="menu">
        <div className="wrap">
          <div className="menu-header">
            <div>
              <div className="eyebrow">Our menu</div>
              <h2 className="sec-title">Always available,<br/><em>made to order</em></h2>
            </div>
            <a href="#order" className="btn-ink" style={{fontSize:".72rem",padding:"11px 24px"}}>
              Place an order
            </a>
          </div>

          <div className="snboard">
            {MENU.map((item, i) => (
              <StickyNote
                key={item.id}
                item={item}
                note={NOTES[i % NOTES.length]}
                onOpen={(it, noteBg) => openProduct(it, noteBg)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <div className="about-wrap">
        <section className="sec" id="about">
          <div className="wrap">
            <div className="about-grid">
              <div className="about-visual">
                <div className="about-img">
                  {null
                    ? <img src="/images/kitchen.jpg" alt="Our kitchen" loading="lazy"/>
                    : <div className="about-img-ph">
                        <span className="about-img-emoji">🫙</span>
                        <span className="about-img-hint">Your kitchen photo here</span>
                      </div>
                  }
                </div>
                <div className="about-cap">
                  <div className="about-cap-title">The kitchen</div>
                  <div className="about-cap-sub">Ladysmith, KwaZulu-Natal · Est. 2024</div>
                </div>
              </div>

              <div className="about-txt">
                <div className="eyebrow">About us</div>
                <h2 className="sec-title" style={{marginBottom:"1.5rem"}}>
                  Baking with<br/><em>heart</em>
                </h2>
                <p>
                  The Treat Table is a home bakery based in Ladysmith, KwaZulu-Natal.
                  Every item on the menu is baked fresh to your order — mini loaf cakes in
                  seven flavours, pillowy cinnamon rolls, and rich milk cakes for the whole family.
                  Nothing sits on a shelf. Nothing is made in advance.
                </p>
                <p>
                  Every bake is fully eggless. Just place your order at least 24 hours ahead
                  and collect from our kitchen at a time that suits you.
                </p>
                <div className="about-pills">
                  {["Always eggless","Vegan on request","No delivery","Made to order","Home kitchen","No preservatives"].map(p=>(
                    <span key={p} className="about-pill">{p}</span>
                  ))}
                </div>
                <a href="#story" className="btn-outline" style={{width:"fit-content",fontSize:".72rem",padding:"11px 22px"}}>
                  Read the full story
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* HOW IT WORKS */}
      <section className="sec" id="how-it-works" style={{paddingTop:0}}>
        <div className="wrap">
          <div className="eyebrow">How it works</div>
          <h2 className="sec-title">Simple as <em>that</em></h2>
          <div className="how-grid">
            {[
              {n:"01",t:"Browse the menu",  d:"Everything is available all the time — no reset, no cutoff. Pick what you'd like at your own pace."},
              {n:"02",t:"Place your order", d:"Choose your items, pick variants, note any vegan requests, and let us know when you'd like to collect."},
              {n:"03",t:"Pick up fresh",    d:"Give us 24 hours and your order is baked fresh on the morning of pickup. Warm bread in hand."},
            ].map(s=>(
              <div key={s.n} className="how-card">
                <div className="how-num">{s.n}</div>
                <div className="how-title">{s.t}</div>
                <div className="how-desc">{s.d}</div>
              </div>
            ))}
          </div>

          <div className="pickup-strip">
            <div className="pickup-info">
              <div className="pickup-lbl">Location</div>
              <div className="pickup-val">Ladysmith, KZN</div>
              <div className="pickup-sub">Address in your confirmation</div>
            </div>
            <div className="pickup-div"/>
            <div className="pickup-info">
              <div className="pickup-lbl">Pickup</div>
              <div className="pickup-val">Your schedule</div>
              <div className="pickup-sub">Collect whenever suits you — just give us a day's notice</div>
            </div>
            <div className="pickup-div"/>
            <div className="pickup-info">
              <div className="pickup-lbl">Notice required</div>
              <div className="pickup-val">24 hours</div>
              <div className="pickup-sub">Order any day — we just need time to bake</div>
            </div>
            <a href="#menu" className="btn-paper">Order now</a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="sec" id="contact">
        <div className="wrap">
          <div className="eyebrow">Get in touch</div>
          <h2 className="sec-title">Order, ask, or just <em>say hi</em></h2>
          <div className="contact-grid">
            <a className="contact-card" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
              <span className="contact-card-icon">💬</span>
              <div className="contact-card-label">WhatsApp</div>
              <div className="contact-card-val">Chat with us</div>
              <div className="contact-card-hint">Quickest way to place an order or ask a question</div>
            </a>
            <a className="contact-card" href={`mailto:${CONTACT_EMAIL}`}>
              <span className="contact-card-icon">✉️</span>
              <div className="contact-card-label">Email</div>
              <div className="contact-card-val">{CONTACT_EMAIL}</div>
              <div className="contact-card-hint">For detailed orders or special requests</div>
            </a>
            <a className="contact-card" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <span className="contact-card-icon">📸</span>
              <div className="contact-card-label">Instagram</div>
              <div className="contact-card-val">@thetreattableza</div>
              <div className="contact-card-hint">See what's fresh, behind the scenes, and new flavours</div>
            </a>
            <div className="contact-card" style={{cursor:"default"}}>
              <span className="contact-card-icon">📍</span>
              <div className="contact-card-label">Location</div>
              <div className="contact-card-val">Ladysmith, KZN</div>
              <div className="contact-card-hint">Pickup from our home kitchen — address in your order confirmation</div>
            </div>
          </div>
        </div>
      </section>

      {/* JOURNAL */}
      <section className="sec" id="journal" style={{background:"var(--paper2)",borderTop:"1px solid var(--paper3)",borderBottom:"1px solid var(--paper3)"}}>
        <div className="wrap">
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
            <div>
              <div className="eyebrow">The journal</div>
              <h2 className="sec-title">Stories from the <em>kitchen</em></h2>
            </div>
            <a href="#all" className="btn-outline" style={{fontSize:".7rem",padding:"10px 20px"}}>All posts</a>
          </div>
          <div className="j-grid">
            {POSTS.map((p,i) => (
              <div key={i} className={`jcard${p.feat?" feat":""}`}>
                <div className="j-cat">{p.cat}</div>
                <div className="j-title">{p.title}</div>
                <div className="j-exc">{p.excerpt}</div>
                <div className="j-foot">
                  <div className="j-date">{p.date} · {p.read}</div>
                  <a href="#" className="j-link">Read →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <div style={{padding:"clamp(3rem,6vh,5rem) 0 0"}}>
        <div className="nl-wrap">
          <div>
            <div className="eyebrow" style={{marginBottom:".65rem"}}>Stay in touch</div>
            <h2 className="nl-title">New bakes, <em>special runs</em> & updates</h2>
            <p className="nl-sub">
              Occasional emails when we add something new to the menu, run a special batch, or have something worth sharing. No spam, ever.
            </p>
          </div>
          <div>
            {subbed ? (
              <div className="nl-ok">✦ You're on the list. We'll be in touch.</div>
            ) : (
              <form className="nl-form" onSubmit={e=>{e.preventDefault();if(email)setSubbed(true)}}>
                <div className="nl-row">
                  <input className="nl-in" type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
                  <button type="submit" className="nl-btn">Sign up</button>
                </div>
                <div className="nl-note">Infrequent. Unsubscribe any time.</div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <div className="f-logo">The Treat Table</div>
          <div className="f-copy">© 2026 · Ladysmith, KwaZulu-Natal · Always eggless</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px",alignItems:"flex-end"}}>
          <ul className="f-nav">
            <li><a href="#menu">Menu</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#journal">Journal</a></li>
          </ul>
          <div className="social-links">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="social-link">💬 WhatsApp</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="social-link">📸 Instagram</a>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY BAR */}
      <div className="sbar">
        <button className="sb-main" style={{border:"none",cursor:"pointer"}}
          onClick={() => cartQty > 0 ? setOrderOpen(true) : document.querySelector('#menu').scrollIntoView({behavior:'smooth'})}>
          {cartQty > 0 ? `Review order · R${cartTotal}` : "Order now"}
        </button>
        <a href="#how-it-works" className="sb-ghost">How it works</a>
      </div>

      {/* PRODUCT DETAIL DRAWER */}
      <div
        className={`pd-ov${pdOpen?" open":""}`}
        onClick={e => { if(e.target === e.currentTarget) closeProduct(); }}
      >
        <div className={`pd-panel${pdOpen?" open":""}`} role="dialog" aria-modal="true" aria-label={activeItem?.name}>
          {activeItem && (
            <CategoryModal item={activeItem} noteColor={activeNote} onClose={closeProduct} onAdd={addToCart}/>
          )}
        </div>
      </div>

      {/* FLOATING CART PILL */}
      <button
        className={`cart-pill${cartQty > 0 ? " visible" : ""}`}
        onClick={() => setOrderOpen(true)}
        aria-label={`View order — ${cartQty} items`}
      >
        <div className="cart-badge">{cartQty}</div>
        <span>R{cartTotal} · Review order</span>
      </button>

      {/* ORDER FORM MODAL */}
      <div className={`order-ov${orderOpen ? " open" : ""}`} onClick={e => { if (e.target === e.currentTarget) setOrderOpen(false); }}>
        <div className="order-modal" role="dialog" aria-modal="true" aria-label="Place your order">
          {orderOpen && (
            <OrderModal
              cart={cart}
              onClose={() => setOrderOpen(false)}
              onClearCart={clearCart}
            />
          )}
        </div>
      </div>
    </>
  );
}
