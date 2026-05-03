import { useState, useEffect, useRef } from "react";
import {
  ArrowDown, MapPin, MessageCircle, Leaf, X, ShoppingBag,
  BookOpen, Home, Plus, Minus, ArrowRight, ShoppingCart,
  Clock, Flame, Wheat
} from "lucide-react";

const t = {
  cream: "#F5F0E8", sand: "#E8DCC8", tan: "#C9B99A",
  brown: "#6B4F35", dark: "#3D2B1A", esp: "#1C1008", warm: "#A07850",
};

const fonts = ``; // Fonts loaded via <link> in index.html

const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html {
  scroll-behavior: smooth;
  scrollbar-width: none;
  overflow-y: scroll;
}
html::-webkit-scrollbar { width: 0; display: none; }
body {
  background: ${t.cream}; font-family: 'DM Sans', sans-serif;
  color: ${t.esp}; overflow-x: hidden;
  scrollbar-width: none;
}
body::-webkit-scrollbar { width: 0; display: none; }
.drawer, .po-card, .drawer-body { scrollbar-width: none; }
.drawer::-webkit-scrollbar, .po-card::-webkit-scrollbar, .drawer-body::-webkit-scrollbar { display: none; }

/* custom overlay scrollbar */
.scroll-thumb {
  position: fixed; right: 3px; z-index: 9999;
  width: 3px; border-radius: 3px;
  background: ${t.tan};
  opacity: 0; pointer-events: none;
  transition: opacity 0.4s ease;
  top: 0;
}

/* ── NAV GHOST ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.9rem 1.25rem;
  transition: background 0.45s ease, border-color 0.45s ease, backdrop-filter 0.45s ease;
  border-bottom: 1px solid transparent;
  background: linear-gradient(to bottom, ${t.esp}28 0%, transparent 100%);
}
.nav.scrolled {
  background: ${t.cream}f0;
  backdrop-filter: blur(20px);
  border-bottom-color: ${t.sand};
}
.nav.scrolled .nav-brand-name { color: ${t.dark}; }
.nav.scrolled .nav-brand-sub { color: ${t.warm}; }
.nav.scrolled .nav-links a { color: ${t.brown}; }
.nav.scrolled .nav-cart-btn { color: ${t.dark}; }
.nav.scrolled .nav-wa { color: ${t.brown}; border-color: ${t.tan}; }

.nav-brand { text-decoration: none; display: flex; flex-direction: column; gap: 0.14rem; }
.nav-brand-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem; font-weight: 600; letter-spacing: 0.14em;
  color: ${t.cream}; text-transform: uppercase;
  line-height: 1; transition: color 0.4s;
}
.nav-brand-sub {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.58rem; font-weight: 300; letter-spacing: 0.24em;
  color: ${t.tan}; text-transform: uppercase;
  line-height: 1; font-style: italic; transition: color 0.4s;
}
.nav-links { display: none; gap: 2rem; list-style: none; align-items: center; }
.nav-links a {
  font-size: 0.68rem; letter-spacing: 0.14em;
  color: ${t.cream}; text-decoration: none; text-transform: uppercase;
  transition: opacity 0.2s; font-weight: 400; opacity: 0.85;
}
.nav-links a:hover { opacity: 0.5; }
.nav-right { display: flex; align-items: center; gap: 1.25rem; }
.nav-wa {
  display: none; align-items: center; gap: 0.5rem;
  font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: ${t.cream}; text-decoration: none;
  padding: 0.45rem 1rem; border: 1px solid ${t.cream}44;
  border-radius: 2px; transition: all 0.2s; opacity: 0.85;
}
.nav-wa:hover { background: ${t.cream}18; opacity: 1; }
.nav-cart-btn { display: flex; align-items: center; color: ${t.cream}; background: none; border: none; cursor: pointer; position: relative; padding: 0.25rem; transition: color 0.4s, opacity 0.2s; opacity: 0.85; }
.nav-cart-btn:hover { opacity: 0.55; }
.cart-count { position: absolute; top: -5px; right: -7px; width: 16px; height: 16px; border-radius: 50%; background: ${t.brown}; color: ${t.cream}; font-size: 0.55rem; font-weight: 500; display: flex; align-items: center; justify-content: center; opacity: 1; }

/* ── BOTTOM TAB ── */
.bottom-tab-bar { position: fixed; bottom: 0; left: 0; right: 0; z-index: 200; display: flex; background: ${t.cream}f5; backdrop-filter: blur(16px); border-top: 1px solid ${t.sand}; padding-bottom: env(safe-area-inset-bottom); }
.tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0.65rem 0.5rem 0.55rem; gap: 0.22rem; text-decoration: none; color: ${t.tan}; transition: color 0.2s; border: none; background: none; cursor: pointer; }
.tab-item:hover, .tab-item.active { color: ${t.dark}; }
.tab-item span { font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; }
.tab-cart-btn { flex: 1.5; background: ${t.dark}; color: ${t.cream}; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0.65rem 0.5rem 0.55rem; gap: 0.22rem; border: none; cursor: pointer; transition: background 0.2s; position: relative; }
.tab-cart-btn:hover { background: ${t.esp}; }
.tab-cart-btn span { font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.cream}; }
.tab-cart-count { position: absolute; top: 6px; right: calc(50% - 18px); width: 15px; height: 15px; border-radius: 50%; background: ${t.brown}; color: ${t.cream}; font-size: 0.55rem; display: flex; align-items: center; justify-content: center; }
.page-end-pad { height: 5rem; }

/* ── CART DRAWER ── */
.drawer-overlay { position: fixed; inset: 0; z-index: 300; background: ${t.esp}55; backdrop-filter: blur(2px); opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
.drawer-overlay.open { opacity: 1; pointer-events: all; }
.drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 400; width: min(420px, 100vw); background: ${t.cream}; display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); box-shadow: -8px 0 40px ${t.esp}22; }
.drawer.open { transform: translateX(0); }
.drawer-head { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 1.5rem 1.25rem; border-bottom: 1px solid ${t.sand}; flex-shrink: 0; }
.drawer-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300; color: ${t.dark}; }
.drawer-title em { font-style: italic; }
.drawer-close { background: none; border: none; cursor: pointer; color: ${t.tan}; padding: 0.25rem; display: flex; align-items: center; transition: color 0.2s; }
.drawer-close:hover { color: ${t.dark}; }
.drawer-body { flex: 1; overflow-y: auto; padding: 0 1.5rem; }
.drawer-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 1rem; padding: 3rem 0; }
.drawer-empty-icon { color: ${t.tan}; }
.drawer-empty-text { font-size: 0.85rem; color: ${t.warm}; text-align: center; line-height: 1.7; }
.drawer-empty-cta { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.brown}; background: none; border: 1px solid ${t.tan}; padding: 0.6rem 1.25rem; border-radius: 2px; cursor: pointer; transition: all 0.2s; }
.drawer-empty-cta:hover { background: ${t.brown}; color: ${t.cream}; border-color: ${t.brown}; }
.drawer-line { display: flex; align-items: flex-start; gap: 1rem; padding: 1.25rem 0; border-bottom: 1px solid ${t.sand}; }
.drawer-line-info { flex: 1; }
.drawer-line-name { font-family: 'Cormorant Garamond', serif; font-size: 1.05rem; font-weight: 400; color: ${t.dark}; margin-bottom: 0.15rem; }
.drawer-line-flavor { font-size: 0.72rem; color: ${t.warm}; }
.drawer-line-price { font-size: 0.72rem; color: ${t.brown}; margin-top: 0.25rem; }
.drawer-line-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; padding-top: 0.2rem; }
.dqty-btn { width: 26px; height: 26px; border-radius: 50%; border: 1px solid ${t.tan}; background: transparent; color: ${t.brown}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.dqty-btn:hover { background: ${t.brown}; color: ${t.cream}; border-color: ${t.brown}; }
.dqty-val { font-size: 0.85rem; font-weight: 500; color: ${t.dark}; min-width: 1.2rem; text-align: center; }
.drawer-form-wrap { padding: 1.5rem 0 1rem; }
.drawer-form-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 300; color: ${t.dark}; margin-bottom: 1.25rem; }
.drawer-form-title em { font-style: italic; }
.d-form { display: flex; flex-direction: column; gap: 0.85rem; }
.d-form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.d-label { font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: ${t.brown}; }
.d-input, .d-textarea { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 300; color: ${t.dark}; background: transparent; border: none; border-bottom: 1px solid ${t.tan}; padding: 0.55rem 0; outline: none; transition: border-color 0.2s; width: 100%; }
.d-input:focus, .d-textarea:focus { border-bottom-color: ${t.brown}; }
.d-textarea { resize: vertical; min-height: 60px; }
.drawer-foot { padding: 1.25rem 1.5rem; border-top: 1px solid ${t.sand}; flex-shrink: 0; display: flex; flex-direction: column; gap: 0.75rem; }
.drawer-note { font-size: 0.68rem; color: ${t.warm}; font-style: italic; }
.drawer-wa-btn { display: flex; align-items: center; justify-content: center; gap: 0.6rem; font-family: 'DM Sans', sans-serif; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.cream}; background: ${t.dark}; border: none; cursor: pointer; padding: 1rem; border-radius: 2px; width: 100%; transition: background 0.2s; }
.drawer-wa-btn:hover { background: ${t.esp}; }
.drawer-wa-alt { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: ${t.brown}; text-decoration: none; padding: 0.5rem; transition: color 0.2s; }
.drawer-wa-alt:hover { color: ${t.dark}; }

/* ── PRODUCT OVERLAY ── */
.product-overlay {
  position: fixed; inset: 0; z-index: 600;
  display: flex; align-items: center; justify-content: center;
  padding: 1.25rem;
  pointer-events: none;
}
.product-overlay::before {
  content: ''; position: absolute; inset: 0;
  background: ${t.esp}66;
  backdrop-filter: blur(20px) saturate(0.7);
  opacity: 0;
  transition: opacity 0.35s ease;
}
.product-overlay.open { pointer-events: all; }
.product-overlay.open::before { opacity: 1; }
.product-overlay.closing::before { opacity: 0; transition: opacity 0.26s ease; }

.po-card {
  position: relative; z-index: 1;
  background: ${t.cream}; width: 100%; max-width: 860px;
  max-height: 90vh; overflow-y: auto;
  display: grid; grid-template-columns: 1fr;
  opacity: 0; transform: scale(0.94) translateY(24px);
  border-radius: 3px;
}
.product-overlay.open .po-card {
  animation: overlayIn 0.4s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;
}
.product-overlay.closing .po-card {
  animation: overlayOut 0.24s cubic-bezier(0.4, 0, 1, 1) forwards;
}
@keyframes overlayIn {
  0%   { opacity: 0; transform: scale(0.94) translateY(24px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes overlayOut {
  0%   { opacity: 1; transform: scale(1) translateY(0); }
  100% { opacity: 0; transform: scale(0.97) translateY(10px); }
}

.po-close {
  position: absolute; top: 1.25rem; right: 1.25rem; z-index: 2;
  background: ${t.sand}; border: none; cursor: pointer;
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: ${t.dark}; transition: background 0.2s;
}
.po-close:hover { background: ${t.tan}; }

.po-img {
  width: 100%; aspect-ratio: 16/7;
  background: linear-gradient(135deg, ${t.sand} 0%, ${t.tan} 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif; font-size: 0.9rem;
  color: ${t.warm}88; letter-spacing: 0.15em; flex-shrink: 0;
}
.po-body { padding: 2rem 1.75rem 2.5rem; }
.po-tag { font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: ${t.warm}; margin-bottom: 0.4rem; }
.po-name { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 300; color: ${t.dark}; line-height: 1.1; margin-bottom: 1rem; }
.po-name em { font-style: italic; }
.po-desc { font-size: 0.88rem; font-weight: 300; color: ${t.warm}; line-height: 1.85; margin-bottom: 1.75rem; }
.po-flavor-label { font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: ${t.warm}; margin-bottom: 0.75rem; }
.po-flavors { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
.po-flavor-pill { font-size: 0.75rem; color: ${t.warm}; background: ${t.sand}; padding: 0.4rem 0.9rem; border-radius: 20px; border: 1px solid ${t.tan}88; cursor: pointer; transition: all 0.15s; }
.po-flavor-pill.selected { background: ${t.brown}; color: ${t.cream}; border-color: ${t.brown}; }
.po-order-row { display: flex; align-items: center; gap: 0.75rem; padding-top: 1.25rem; border-top: 1px solid ${t.sand}; }
.po-price { font-size: 0.88rem; font-weight: 500; color: ${t.brown}; flex: 1; }
.po-qty-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid ${t.tan}; background: transparent; color: ${t.brown}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.po-qty-btn:hover { background: ${t.brown}; color: ${t.cream}; border-color: ${t.brown}; }
.po-qty-val { font-size: 0.9rem; font-weight: 500; color: ${t.dark}; min-width: 1.4rem; text-align: center; }
.po-add-btn { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.cream}; background: ${t.dark}; border: none; cursor: pointer; padding: 0.8rem 1.75rem; border-radius: 2px; transition: background 0.2s, transform 0.15s; display: flex; align-items: center; gap: 0.4rem; }
.po-add-btn:hover { background: ${t.esp}; transform: translateY(-1px); }
.po-add-btn.added { background: ${t.brown}; transform: none; }
.po-eggless { display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; }
.po-eggless-text { font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: ${t.warm}; }
.po-vegan { font-size: 0.6rem; color: ${t.tan}; margin-left: 0.25rem; }

/* ── SCROLL REVEAL ── */
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-d1 { transition-delay: 0.1s; }
.reveal-d2 { transition-delay: 0.22s; }
.reveal-d3 { transition-delay: 0.34s; }

/* ── HERO ── */
.hero { min-height: 100svh; padding: 0; display: flex; flex-direction: column; border-bottom: 1px solid ${t.sand}; position: relative; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; z-index: 0; background: url('/images/cinnamon-rolls.webp') center / cover; display: flex; align-items: center; justify-content: center; }
.hero-circle { width: 200px; height: 200px; border-radius: 50%; background: ${t.tan}44; display: none; align-items: center; justify-content: center; position: relative; opacity: 0.6; }
.hero-circle::before { content: ''; position: absolute; width: 155px; height: 155px; border-radius: 50%; background: ${t.tan}66; border: 1px solid ${t.tan}99; }
.hero-circle-text { font-family: 'Cormorant Garamond', serif; font-size: 0.72rem; font-style: italic; color: ${t.brown}; z-index: 1; letter-spacing: 0.1em; }
.hero-badge { display: none; }
.hero-content {
  position: relative; z-index: 1;
  margin-top: auto;
  padding: 2rem 1.5rem calc(5.5rem + env(safe-area-inset-bottom));
  background: linear-gradient(to top, ${t.cream} 70%, transparent 100%);
}
.hero-eyebrow { font-size: 0.62rem; letter-spacing: 0.18em; color: ${t.warm}; text-transform: uppercase; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.5rem; opacity: 1; animation: fadeUp 0.8s 0.2s forwards; }
.hero-eyebrow::before { content: ''; display: block; width: 1.5rem; height: 1px; background: ${t.tan}; flex-shrink: 0; }
.hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.6rem, 9vw, 3.5rem); font-weight: 300; line-height: 1.05; color: ${t.dark}; margin-bottom: 0.75rem; opacity: 1; animation: fadeUp 0.9s 0.35s forwards; }
.hero-title em { font-style: italic; color: ${t.brown}; }
.hero-sub { font-size: 0.85rem; font-weight: 300; line-height: 1.7; color: ${t.warm}; margin-bottom: 1.75rem; opacity: 1; animation: fadeUp 0.9s 0.5s forwards; max-width: 340px; }
.hero-actions { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; opacity: 0; animation: fadeUp 0.9s 0.65s forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.btn-primary { font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; color: ${t.cream}; background: ${t.dark}; padding: 0.85rem 1.75rem; border-radius: 2px; text-decoration: none; text-transform: uppercase; transition: background 0.2s, transform 0.2s; border: none; cursor: pointer; display: inline-block; }
.btn-primary:hover { background: ${t.esp}; transform: translateY(-1px); }
.btn-ghost { font-size: 0.75rem; letter-spacing: 0.08em; color: ${t.brown}; text-decoration: none; text-transform: uppercase; display: flex; align-items: center; gap: 0.4rem; transition: color 0.2s, gap 0.2s; }
.btn-ghost:hover { color: ${t.dark}; gap: 0.65rem; }

/* ── TICKER ── */
.ticker { background: ${t.dark}; padding: 0.75rem 0; overflow: hidden; white-space: nowrap; }
.ticker-inner { display: flex; gap: 2.5rem; animation: ticker 22s linear infinite; }
.ticker-item { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: ${t.tan}; flex-shrink: 0; display: flex; align-items: center; gap: 1.25rem; }
.ticker-dot { width: 3px; height: 3px; border-radius: 50%; background: ${t.warm}; }
@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* ── SECTION COMMONS ── */
.section { padding: 3.5rem 1.25rem; }
.section-label { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: ${t.warm}; margin-bottom: 0.5rem; }
.section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 300; color: ${t.dark}; line-height: 1.1; }
.section-title em { font-style: italic; }

/* ── MENU — mobile stacked ── */
.menu-section { padding: 3.5rem 0 3.5rem; }
.menu-header { padding: 0 1.25rem; margin-bottom: 1.75rem; display: flex; justify-content: space-between; align-items: flex-end; }
.menu-scroll-track {
  display: flex; gap: 12px; background: transparent;
  overflow-x: auto; -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory;
  scrollbar-width: none; padding: 0 1.25rem 0.25rem;
}
.menu-scroll-track::-webkit-scrollbar { display: none; }
.menu-card {
  flex: 0 0 68vw; scroll-snap-align: start;
  background: ${t.cream}; padding: 0;
  display: flex; flex-direction: column; cursor: pointer;
  border: 1px solid ${t.sand}; border-radius: 3px; overflow: hidden;
}
.menu-card-img-wrap {
  position: relative; width: 100%; aspect-ratio: 3/4;
  overflow: hidden; cursor: pointer;
}
.menu-card-img-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, ${t.sand} 0%, ${t.tan} 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif; font-size: 0.8rem;
  color: ${t.warm}88; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
}
.menu-card-img-wrap:hover .menu-card-img-bg { transform: scale(1.04); }
.menu-card-plus {
  position: absolute; bottom: 0.85rem; right: 0.85rem;
  opacity: 0; pointer-events: none;
  transform: scale(0.5);
}
.menu-card-img-wrap:hover .menu-card-plus,
.menu-card-img-wrap:active .menu-card-plus {
  opacity: 1; pointer-events: all;
  animation: plusPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes plusPop {
  0%   { transform: scale(0.5); }
  70%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}
@media (hover: none) {
  .menu-card-plus { opacity: 1; pointer-events: all; transform: scale(1); animation: none; }
}
.menu-card-plus-btn {
  width: 44px; height: 44px; border-radius: 50%;
  background: ${t.cream}; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px ${t.esp}44;
  transition: background 0.2s, transform 0.15s;
  color: ${t.dark};
}
.menu-card-plus-btn:hover { background: ${t.dark}; color: ${t.cream}; transform: scale(1.08); }
.menu-card-info { padding: 0.9rem 1rem 1.1rem; }
.menu-card-tag { font-size: 0.56rem; letter-spacing: 0.18em; text-transform: uppercase; color: ${t.warm}; margin-bottom: 0.3rem; }
.menu-card-name { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 400; color: ${t.dark}; margin-bottom: 0.2rem; line-height: 1.15; }
.menu-card-price { font-size: 0.72rem; color: ${t.brown}; font-weight: 500; }
.menu-eggless { display: flex; align-items: center; gap: 0.4rem; margin-top: 0.55rem; }
.eggless-text { font-size: 0.54rem; letter-spacing: 0.12em; text-transform: uppercase; color: ${t.warm}; }
.vegan-note { font-size: 0.52rem; color: ${t.tan}; }

/* ── HOW IT WORKS ── */
.how-section { padding: 3.5rem 1.25rem; background: ${t.dark}; }
.how-section .section-label { color: ${t.tan}; }
.how-section .section-title { color: ${t.cream}; margin-bottom: 3rem; }
.how-steps { display: flex; flex-direction: column; gap: 0; }
.how-step { padding: 2rem 0; border-bottom: 1px solid ${t.brown}33; display: flex; gap: 1.5rem; align-items: flex-start; }
.how-step:last-child { border-bottom: none; }
.how-step-num { font-family: 'Cormorant Garamond', serif; font-size: 2.8rem; font-weight: 300; color: ${t.brown}44; line-height: 1; flex-shrink: 0; width: 3rem; }
.how-step-body {}
.how-step-icon { margin-bottom: 0.75rem; color: ${t.tan}; }
.how-step-title { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; font-weight: 400; color: ${t.cream}; margin-bottom: 0.4rem; }
.how-step-desc { font-size: 0.8rem; font-weight: 300; color: ${t.tan}; line-height: 1.8; }

/* ── THIS WEEK'S BAKE ── */
.weekly-section { padding: 3.5rem 1.25rem; border-top: 1px solid ${t.sand}; }
.weekly-inner { background: ${t.sand}; position: relative; overflow: hidden; border-radius: 2px; }
.weekly-inner::after { content: ''; position: absolute; bottom: -50px; right: -50px; width: 180px; height: 180px; border-radius: 50%; background: ${t.tan}55; pointer-events: none; }
.weekly-img { width: 100%; aspect-ratio: 1/1; background: linear-gradient(135deg, ${t.tan} 0%, ${t.brown}44 100%); display: flex; align-items: center; justify-content: center; position: relative; font-family: 'Cormorant Garamond', serif; font-size: 0.9rem; color: ${t.cream}88; letter-spacing: 0.15em; flex-shrink: 0; }
.weekly-body { padding: 1.75rem 1.5rem 2rem; position: relative; z-index: 1; }
.weekly-eyebrow { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: ${t.warm}; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
.weekly-name { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.6rem, 5vw, 2.5rem); font-weight: 300; color: ${t.dark}; line-height: 1.15; margin-bottom: 0.75rem; }
.weekly-name em { font-style: italic; }
.weekly-desc { font-size: 0.84rem; font-weight: 300; color: ${t.warm}; line-height: 1.8; margin-bottom: 1.25rem; }
.weekly-meta { display: flex; gap: 1.25rem; margin-bottom: 1.75rem; flex-wrap: wrap; }
.weekly-meta-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; color: ${t.brown}; }

/* ── JOURNAL ── */
.blog-section { padding: 3.5rem 1.25rem; background: ${t.sand}55; }
.blog-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid ${t.sand}; }
.blog-grid { display: flex; flex-direction: column; gap: 1rem; }
.blog-card { background: ${t.cream}; border: 1px solid ${t.sand}; border-radius: 2px; overflow: hidden; position: relative; }
.blog-skeleton-img { width: 100%; height: 160px; background: linear-gradient(90deg, ${t.sand} 25%, ${t.cream} 50%, ${t.sand} 75%); background-size: 200% 100%; animation: shimmer 1.8s infinite; }
.blog-skeleton-body { padding: 1.25rem; }
.blog-skel { border-radius: 2px; margin-bottom: 0.5rem; background: linear-gradient(90deg, ${t.sand} 25%, ${t.cream} 50%, ${t.sand} 75%); background-size: 200% 100%; animation: shimmer 1.8s infinite; }
.coming-soon-badge { position: absolute; top: 0.75rem; right: 0.75rem; font-size: 0.58rem; letter-spacing: 0.15em; text-transform: uppercase; color: ${t.brown}; background: ${t.cream}; border: 1px solid ${t.tan}; padding: 0.25rem 0.6rem; border-radius: 20px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* ── FOOTER ── */
.footer { background: ${t.esp}; padding: 2.5rem 1.25rem 2rem; display: flex; flex-direction: column; gap: 1.5rem; border-top: 1px solid ${t.dark}; }
.footer-brand { font-family: 'Cormorant Garamond', serif; font-size: 1rem; font-weight: 600; letter-spacing: 0.1em; color: ${t.cream}; text-transform: uppercase; }
.footer-tagline { font-size: 0.73rem; font-weight: 300; color: ${t.brown}; line-height: 1.6; margin-top: 0.3rem; }
.footer-links { list-style: none; display: flex; flex-wrap: wrap; gap: 0.4rem 1.25rem; }
.footer-links a { font-size: 0.67rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.brown}; text-decoration: none; transition: color 0.2s; }
.footer-links a:hover { color: ${t.cream}; }
.footer-bottom { font-size: 0.62rem; color: ${t.brown}44; padding-top: 0.75rem; border-top: 1px solid ${t.dark}88; }

/* ── DESKTOP 768+ ── */
@media (min-width: 768px) {
  .nav { padding: 1rem 3rem; }
  .nav-brand-name { font-size: 1.2rem; }
  .nav-brand-sub { font-size: 0.62rem; }
  .nav-links { display: flex; }
  .nav-wa { display: flex; }
  .nav-right { gap: 1.5rem; }
  .bottom-tab-bar { display: none; }
  .page-end-pad { display: none; }

  /* HERO */
  .hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; padding: 0; flex-direction: unset; align-items: stretch; }
  .hero-bg { position: relative; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .hero-circle { width: 420px; height: 420px; }
  .hero-circle::before { width: 330px; height: 330px; }
  .hero-circle-text { font-size: 1rem; }
  .hero-content { position: static; background: transparent; padding: 0 5rem 0 3.5rem; margin: 0; display: flex; flex-direction: column; justify-content: center; }
  .hero-title { font-size: clamp(3.5rem, 4.5vw, 5.5rem); margin-bottom: 1.25rem; }
  .hero-sub { font-size: 0.92rem; max-width: 400px; margin-bottom: 2.5rem; }
  .hero-badge { display: block; position: absolute; bottom: 3rem; left: -1.5rem; background: ${t.cream}; border: 1px solid ${t.sand}; padding: 1.2rem 1.75rem; min-width: 195px; box-shadow: 0 8px 32px ${t.esp}18; transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .hero-badge:hover { transform: translateY(-3px); box-shadow: 0 16px 40px ${t.esp}28; }
  .hero-badge-label { font-size: 0.62rem; letter-spacing: 0.18em; color: ${t.warm}; text-transform: uppercase; margin-bottom: 0.3rem; }
  .hero-badge-value { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 400; color: ${t.dark}; }

  /* MENU — horizontal scroll desktop */
  .menu-section { padding: 6rem 0; }
  .menu-header { padding: 0 3rem; margin-bottom: 2.5rem; }
  .menu-scroll-track { padding: 0 3rem 0.5rem; gap: 1.25rem; }
  .menu-card { flex: 0 0 280px; border-radius: 3px; }
  .menu-card-img-wrap { aspect-ratio: 3/4; }

  /* PRODUCT OVERLAY — side-by-side on desktop */
  .po-card { grid-template-columns: 1fr 1fr; max-height: 80vh; }
  .po-img { aspect-ratio: unset; height: 100%; min-height: 400px; }
  .po-body { overflow-y: auto; }

  /* HOW */
  .how-section { padding: 6rem 3rem; }
  .how-section .section-title { margin-bottom: 0; }
  .how-steps { flex-direction: row; gap: 0; margin-top: 4rem; border-top: 1px solid ${t.brown}33; }
  .how-step { flex: 1; flex-direction: column; padding: 2.5rem 2rem; border-bottom: none; border-right: 1px solid ${t.brown}33; gap: 0; }
  .how-step:last-child { border-right: none; }
  .how-step:nth-child(2) { padding-top: 4rem; }
  .how-step:nth-child(3) { padding-top: 1.5rem; padding-bottom: 4rem; }
  .how-step-num { font-size: 3.5rem; width: auto; margin-bottom: 1.5rem; }
  .how-step-icon { margin-bottom: 1rem; }
  .how-step-title { font-size: 1.35rem; }

  /* WEEKLY */
  .weekly-section { padding: 6rem 3rem; }
  .weekly-inner { display: grid; grid-template-columns: 1fr 1fr; }
  .weekly-inner::after { width: 280px; height: 280px; bottom: -80px; right: -80px; }
  .weekly-img { aspect-ratio: unset; order: 2; overflow: hidden; display: flex; min-height: 500px; position: relative; }
  .weekly-body { padding: 3rem 3rem; display: flex; flex-direction: column; justify-content: center; order: 1; }

  /* JOURNAL */
  .blog-section { padding: 6rem 3rem; }
  .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; flex-direction: unset; }

  /* FOOTER */
  .footer { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 2.5rem; flex-direction: unset; align-items: end; padding: 3rem; }
  .footer-bottom { grid-column: 1 / -1; text-align: right; }
}
`;

const products = [
  { tag: "Bite Sized", name: "Mini Cakes", image: "mini-cakes.webp", flavors: ["Vanilla Bean", "Chocolate Fudge", "Red Velvet", "Lemon Raspberry", "Carrot Cake"], desc: "Perfectly portioned mini cakes for any occasion. Available in a variety of classic flavors, baked fresh.", price: "From R65" },
  { tag: "Signature", name: "Cinnamon Rolls", image: "cinnamon-rolls.webp", flavors: ["Classic (R25)"], categories: [
    { name: "Classic Rolls", options: ["Classic (R25)", "Classic + Nuts/Coconut (R35)", "Iced (R30)", "CinnaCream (R45)"] },
    { name: "Speciality Rolls", options: ["Almond Delight (R55)", "Chocolate Dream (R55)", "Royal Oreo (R55)", "Caramel Swirl (R55)"] },
    { name: "Available as Packs", options: ["Classic 4-Pack (R90)", "Classic 6-Pack (R130)", "Classic 12-Pack (R250)", "Speciality 4-Pack (R200)", "Speciality 6-Pack (R290)", "Speciality 12-Pack (R580)"] }
  ], desc: "Our signature soft & fluffy cinnamon rolls. Choose from our classic glazes, decadent speciality flavours, or grab a value pack.", price: "From R25" },
  { tag: "Decadent", name: "Tres Leches Milk Cake", image: "milk-cake.webp", flavors: ["Classic Vanilla", "Pistachio", "Rose", "Saffron"], desc: "A rich and moist sponge cake soaked in three kinds of milk, topped with a light whipped cream layer.", price: "From R350" },
  { tag: "Classic", name: "Chunky Cookies", image: "cookies.webp", flavors: ["Brown Butter Choc Chip", "Double Chocolate", "Macadamia Nut", "Oatmeal Raisin"], desc: "Thick, chewy, and loaded with goodness. Our cookies are baked to have a crispy edge and a gooey center.", price: "From R35" },
];

const weeklyBake = {
  name: "Signature\nCinnamon Rolls",
  desc: "This week's featured bake — our highly requested signature soft and fluffy cinnamon rolls. A limited run, available until Sunday.",
  meta: [{ icon: Clock, label: "Until Sunday" }, { icon: Flame, label: "Baked Thursday" }, { icon: Wheat, label: "Eggless" }],
  productIdx: 1,
};

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function R({ children, d = 0, className = "", style = {} }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal${d ? ` reveal-d${d}` : ""} ${className}`} style={style}>{children}</div>;
}

function SkeletonCard() {
  return (
    <div className="blog-card">
      <div className="coming-soon-badge">Coming Soon</div>
      <div className="blog-skeleton-img" />
      <div className="blog-skeleton-body">
        <div className="blog-skel" style={{ height: 9, width: "38%", marginBottom: "0.75rem" }} />
        <div className="blog-skel" style={{ height: 14, width: "82%" }} />
        <div className="blog-skel" style={{ height: 14, width: "58%", marginBottom: "0.75rem" }} />
        <div className="blog-skel" style={{ height: 9, width: "100%" }} />
        <div className="blog-skel" style={{ height: 9, width: "80%" }} />
      </div>
    </div>
  );
}



export default function KindCrumb() {
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overlay, setOverlay] = useState(null);
  const [overlayClosing, setOverlayClosing] = useState(false); // { product, flavor, qty, added }

  const [formData, setFormData] = useState({ name: "", phone: "", date: "", notes: "" });
  const [activeTab, setActiveTab] = useState("home");

  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setNavScrolled(y > 60);
      const mid = y + 80;
      const secs = [{ id: "home", el: document.querySelector(".hero") }, { id: "products", el: document.getElementById("products") }, { id: "blog", el: document.getElementById("blog") }];
      let cur = "home";
      secs.forEach(({ id, el }) => { if (el && el.offsetTop <= y + window.innerHeight / 2) cur = id; });
      setActiveTab(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (drawerOpen || overlay) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => { 
      document.body.style.overflow = ""; 
      document.documentElement.style.overflow = ""; 
    };
  }, [drawerOpen, overlay]);

  const thumbRef = useRef(null);
  const scrollTimer = useRef(null);

  useEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;
    const update = () => {
      const doc = document.documentElement;
      const scrollRatio = window.scrollY / (doc.scrollHeight - doc.clientHeight);
      const thumbHeight = Math.max(40, (doc.clientHeight / doc.scrollHeight) * doc.clientHeight);
      const maxTop = doc.clientHeight - thumbHeight;
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.top = `${scrollRatio * maxTop}px`;
      thumb.style.opacity = "0.7";
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => { thumb.style.opacity = "0"; }, 1200);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); clearTimeout(scrollTimer.current); };
  }, []);

  const openOverlay = (product) => { setOverlayClosing(false); setOverlay({ product, flavor: product.categories ? product.categories[0].options[0] : product.flavors[0], qty: 1, added: false }); };
  const closeOverlay = () => { setOverlayClosing(true); setTimeout(() => { setOverlay(null); setOverlayClosing(false); }, 260); };

  const addToCart = (name, flavor, qty, price) => {
    setCart(prev => {
      const idx = prev.findIndex(c => c.name === name && c.flavor === flavor);
      if (idx >= 0) { const u = [...prev]; u[idx].qty += qty; return u; }
      return [...prev, { name, flavor, qty, price }];
    });
    setDrawerOpen(true);
  };



  const addFromOverlay = () => {
    if (!overlay) return;
    addToCart(overlay.product.name, overlay.flavor, overlay.qty, overlay.product.price);
    setOverlay(o => ({ ...o, added: true }));
    setTimeout(() => closeOverlay(), 1100);
  };

  const updateCartQty = (i, d) => {
    const u = [...cart]; u[i].qty = Math.max(0, u[i].qty + d);
    setCart(u.filter(c => c.qty > 0));
  };

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);

  const handleSubmit = () => {
    const items = cart.length ? cart.map(c => `- ${c.name} (${c.flavor}) x${c.qty}`).join("%0A") : "No items";
    const msg = `Hello Kind Crumb!%0A%0AOrder:%0A${items}%0A%0AName: ${formData.name}%0APhone: ${formData.phone}%0ADate needed: ${formData.date}%0ANotes: ${formData.notes}`;
    window.open(`https://wa.me/27689536500?text=${msg}`, "_blank");
  };

  const tickerItems = ["Baked to order", "Pickup available", "Ladysmith", "Always eggless", "Small batch", "No artificial additives"];

  return (
    <>
      <style>{fonts}{css}</style>

      <div ref={thumbRef} className="scroll-thumb" />
      {/* CART DRAWER OVERLAY */}
      <div className={`drawer-overlay${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />

      {/* PRODUCT OVERLAY */}
      <div className={`product-overlay${overlay ? " open" : ""}${overlayClosing ? " closing" : ""}`} onClick={e => { if (e.target === e.currentTarget) closeOverlay(); }}>
        {overlay && (
          <div className="po-card">
            <div className="po-img"><img src={`/images/${overlay.product.image}`} alt={overlay.product.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} /></div>
            <div className="po-body">
              <button className="po-close" onClick={closeOverlay}><X size={16} strokeWidth={1.5} /></button>
              <p className="po-tag">{overlay.product.tag}</p>
              <h2 className="po-name">{overlay.product.name}</h2>
              <p className="po-desc">{overlay.product.desc}</p>
              {overlay.product.categories ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
                  {overlay.product.categories.map((cat, ci) => (
                    <div key={ci}>
                      <p className="po-flavor-label" style={{ marginBottom: "0.6rem" }}>{cat.name}</p>
                      <div className="po-flavors" style={{ marginBottom: 0 }}>
                        {cat.options.map((f, i) => (
                          <span key={i} className={`po-flavor-pill${overlay.flavor === f ? " selected" : ""}`} onClick={() => setOverlay(o => ({ ...o, flavor: f }))}>{f}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <p className="po-flavor-label">Choose your flavour</p>
                  <div className="po-flavors">
                    {overlay.product.flavors.map((f, i) => (
                      <span key={i} className={`po-flavor-pill${overlay.flavor === f ? " selected" : ""}`} onClick={() => setOverlay(o => ({ ...o, flavor: f }))}>{f}</span>
                    ))}
                  </div>
                </>
              )}
              <div className="po-order-row">
                <span className="po-price">{overlay.product.price}</span>
                <button className="po-qty-btn" onClick={() => setOverlay(o => ({ ...o, qty: Math.max(1, o.qty - 1) }))}><Minus size={12} strokeWidth={2} /></button>
                <span className="po-qty-val">{overlay.qty}</span>
                <button className="po-qty-btn" onClick={() => setOverlay(o => ({ ...o, qty: o.qty + 1 }))}><Plus size={12} strokeWidth={2} /></button>
                <button className={`po-add-btn${overlay.added ? " added" : ""}`} onClick={addFromOverlay}>
                  {overlay.added ? "Added" : <><Plus size={12} strokeWidth={2} />Add to order</>}
                </button>
              </div>
              <div className="po-eggless">
                <Leaf size={11} color={t.warm} strokeWidth={1.5} />
                <span className="po-eggless-text">Always eggless</span>
                <span className="po-vegan">· Vegan on request</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CART DRAWER */}
      <div className={`drawer${drawerOpen ? " open" : ""}`}>
        <div className="drawer-head">
          <h2 className="drawer-title">Your <em>order</em></h2>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}><X size={20} strokeWidth={1.5} /></button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="drawer-empty">
              <ShoppingCart size={36} strokeWidth={1} className="drawer-empty-icon" />
              <p className="drawer-empty-text">Nothing here yet.<br />Pick something from the menu.</p>
              <button className="drawer-empty-cta" onClick={() => { setDrawerOpen(false); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>View Menu</button>
            </div>
          ) : (
            <>
              {cart.map((c, i) => (
                <div key={i} className="drawer-line">
                  <div className="drawer-line-info">
                    <p className="drawer-line-name">{c.name}</p>
                    <p className="drawer-line-flavor">{c.flavor}</p>
                    <p className="drawer-line-price">{c.price}</p>
                  </div>
                  <div className="drawer-line-actions">
                    <button className="dqty-btn" onClick={() => updateCartQty(i, -1)}><Minus size={11} strokeWidth={2} /></button>
                    <span className="dqty-val">{c.qty}</span>
                    <button className="dqty-btn" onClick={() => updateCartQty(i, 1)}><Plus size={11} strokeWidth={2} /></button>
                  </div>
                </div>
              ))}
              <div className="drawer-form-wrap">
                <h3 className="drawer-form-title">Your <em>details</em></h3>
                <div className="d-form">
                  <div className="d-form-group"><label className="d-label">Name</label><input className="d-input" type="text" placeholder="Full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                  <div className="d-form-group"><label className="d-label">Phone / WhatsApp</label><input className="d-input" type="tel" placeholder="+27 000 000 0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>
                  <div className="d-form-group"><label className="d-label">Date needed</label><input className="d-input" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} /></div>
                  <div className="d-form-group"><label className="d-label">Notes</label><textarea className="d-textarea" placeholder="Vegan requirements, allergies, quantities…" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} /></div>
                </div>
              </div>
            </>
          )}
        </div>
        {cart.length > 0 && (
          <div className="drawer-foot">
            <p className="drawer-note">Pricing confirmed on collection. We'll reach out within 24 hours.</p>
            <button className="drawer-wa-btn" onClick={handleSubmit}><MessageCircle size={15} strokeWidth={1.5} />Send Order via WhatsApp</button>
            <a href="https://wa.me/27689536500" className="drawer-wa-alt" target="_blank" rel="noreferrer">Or message us directly <ArrowRight size={12} strokeWidth={1.5} /></a>
          </div>
        )}
      </div>

      {/* NAV */}
      <nav className={`nav${navScrolled ? " scrolled" : ""}`}>
        <a href="#home" className="nav-brand">
          <span className="nav-brand-name">Kind Crumb</span>
          <span className="nav-brand-sub">The Treat Table</span>
        </a>
        <ul className="nav-links">
          <li><a href="#products">Menu</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#blog">Journal</a></li>
        </ul>
        <div className="nav-right">
          <a href="https://wa.me/27689536500" className="nav-wa" target="_blank" rel="noreferrer">
            <MessageCircle size={13} strokeWidth={1.5} /> Order via WhatsApp
          </a>
          <button className="nav-cart-btn" onClick={() => setDrawerOpen(true)}>
            <ShoppingCart size={19} strokeWidth={1.5} />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-circle"><span className="hero-circle-text">The Treat Table</span></div>
          <div className="hero-badge">
            <p className="hero-badge-label">Signature</p>
            <p className="hero-badge-value">Cinnamon Rolls</p>
          </div>
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow"><MapPin size={11} strokeWidth={1.5} style={{ flexShrink: 0 }} />Ladysmith, KZN</p>
          <h1 className="hero-title">Signature<br /><em>Cinnamon Rolls.</em></h1>
          <p className="hero-sub">Small-batch baking made to order. Experience our soft, fluffy dough swirled with rich cinnamon sugar and topped with cream cheese frosting.</p>
          <div className="hero-actions">
            <a href="#products" className="btn-primary">View the Menu</a>
            <a href="#how" className="btn-ghost">How it works <ArrowDown size={13} strokeWidth={1.5} /></a>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="ticker-item">{item}<span className="ticker-dot" /></span>
          ))}
        </div>
      </div>

      {/* MENU */}
      <section id="products" className="menu-section">
        <R className="menu-header">
          <div>
            <p className="section-label">What we make</p>
            <h2 className="section-title">The <em>menu</em></h2>
          </div>
        </R>
        <div className="menu-scroll-track">
          {products.map((p, i) => (
            <div key={i} className="menu-card">
              <div className="menu-card-img-wrap" onClick={() => openOverlay(p)}>
                <img src={`/images/${p.image}`} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                <div className="menu-card-plus">
                  <button className="menu-card-plus-btn" onClick={e => { e.stopPropagation(); openOverlay(p); }}>
                    <Plus size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
              <div className="menu-card-info">
                <p className="menu-card-tag">{p.tag}</p>
                <p className="menu-card-name">{p.name}</p>
                <p style={{ fontSize: "0.78rem", color: t.warm, marginTop: "0.4rem", marginBottom: "0.85rem", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p className="menu-card-price">{p.price}</p>
                  <div className="menu-eggless" style={{ marginTop: 0 }}>
                    <Leaf size={10} color={t.warm} strokeWidth={1.5} />
                    <span className="eggless-text">Eggless</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="how-section">
        <R>
          <p className="section-label">How it works</p>
          <h2 className="section-title">Three steps.<br /><em>That's it.</em></h2>
        </R>
        <div className="how-steps">
          {[
            { n: "01", icon: ShoppingBag, title: "Choose & add", desc: "Browse the menu, tap a flavour, set your quantity. Add directly from the card — no extra pages." },
            { n: "02", icon: MessageCircle, title: "Send your order", desc: "Your cart holds everything. Fill in your details and send directly to us on WhatsApp." },
            { n: "03", icon: MapPin, title: "Collect in Ladysmith", desc: "Everything baked fresh to your order on collection day. No pre-made stock, ever." },
          ].map((s, i) => (
            <R key={i} d={i + 1} className="how-step">
              <div className="how-step-num">{s.n}</div>
              <div className="how-step-body">
                <div className="how-step-icon"><s.icon size={20} strokeWidth={1.5} /></div>
                <h3 className="how-step-title">{s.title}</h3>
                <p className="how-step-desc">{s.desc}</p>
              </div>
            </R>
          ))}
        </div>
      </section>

      {/* THIS WEEK'S BAKE */}
      <section className="weekly-section">
        <R style={{ marginBottom: "1.75rem" }}>
          <p className="section-label">From the oven</p>
          <h2 className="section-title">This week's <em>bake</em></h2>
        </R>
        <R d={1}>
          <div className="weekly-inner">
            <div className="weekly-img"><img src={`/images/${products[weeklyBake.productIdx].image}`} alt={weeklyBake.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} /></div>
            <div className="weekly-body">
              <div className="weekly-eyebrow"><Flame size={12} color={t.warm} strokeWidth={1.5} />Limited this week</div>
              <h3 className="weekly-name">
                {weeklyBake.name.split("\n").map((l, i) => i === 0 ? <span key={i}>{l}<br /></span> : <em key={i}>{l}</em>)}
              </h3>
              <p className="weekly-desc">{weeklyBake.desc}</p>
              <div className="weekly-meta">
                {weeklyBake.meta.map((m, i) => <span key={i} className="weekly-meta-item"><m.icon size={13} strokeWidth={1.5} />{m.label}</span>)}
              </div>
              <button className="btn-primary" onClick={() => openOverlay(products[weeklyBake.productIdx])}>Order This Bake</button>
            </div>
          </div>
        </R>
      </section>

      {/* JOURNAL */}
      <section id="blog" className="blog-section">
        <div className="blog-header">
          <R>
            <p className="section-label">From the kitchen</p>
            <h2 className="section-title">Our <em>Journal</em></h2>
          </R>
          <span style={{ fontSize: "0.7rem", color: t.warm, letterSpacing: "0.1em", textTransform: "uppercase" }}>Launching soon</span>
        </div>
        <div className="blog-grid">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <p className="footer-brand">Kind Crumb · The Treat Table</p>
          <p className="footer-tagline">Small-batch baking, made to order.<br />Ladysmith, KZN.</p>
        </div>
        <ul className="footer-links">
          <li><a href="#products">Menu</a></li>
          <li><a href="#blog">Journal</a></li>
          <li><a href="https://wa.me/27689536500">WhatsApp</a></li>
        </ul>
        <div />
        <p className="footer-bottom">© {new Date().getFullYear()} Kind Crumb. All rights reserved.</p>
      </footer>

      <div className="page-end-pad" />

      {/* BOTTOM TAB BAR */}
      <nav className="bottom-tab-bar">
        <button className={`tab-item${activeTab === "home" ? " active" : ""}`} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}><Home size={18} strokeWidth={1.5} /><span>Home</span></button>
        <a href="#products" className={`tab-item${activeTab === "products" ? " active" : ""}`}><ShoppingBag size={18} strokeWidth={1.5} /><span>Menu</span></a>
        <button className="tab-cart-btn" onClick={() => setDrawerOpen(true)}>
          {totalItems > 0 && <span className="tab-cart-count">{totalItems}</span>}
          <ShoppingCart size={18} strokeWidth={1.5} /><span>Order</span>
        </button>
        <a href="#blog" className={`tab-item${activeTab === "blog" ? " active" : ""}`}><BookOpen size={18} strokeWidth={1.5} /><span>Journal</span></a>
      </nav>
    </>
  );
}