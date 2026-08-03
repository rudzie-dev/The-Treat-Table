import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDown, MapPin, MessageCircle, Leaf, X, ShoppingBag,
  Plus, Minus, ArrowRight, ShoppingCart,
  Clock, Flame, Wheat, Star, Quote, Check, Menu as MenuIcon
} from "lucide-react";

// lucide-react@1.8.0 (pinned) predates its Instagram icon, so it's inlined
// here matching the same outlined stroke style as the rest of the icon set.
function Instagram({ size = 16, strokeWidth = 1.5, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const t = {
  cream: "#F5F0E8", sand: "#E8DCC8", tan: "#C9B99A",
  brown: "#6B4F35", dark: "#3D2B1A", esp: "#1C1008",
  // Darkened from the original #A07850 (~3.5:1 on cream, failed WCAG AA)
  // to ~5:1 so section labels/eyebrows/tags clear 4.5:1 for small text.
  warm: "#816141",
  warmText: "#7A5A3D",
};

const fonts = ``; // Fonts loaded via <link> in index.html

const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
/* Native scrollbars render differently (or not at all) across browsers/OSes —
   hide them everywhere, on every current and future scrollable element, and
   rely entirely on our own custom thumb for scroll affordance instead. */
* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
*::-webkit-scrollbar { width: 0; height: 0; display: none; }
html { scroll-behavior: smooth; overflow-y: scroll; }
body {
  background: ${t.cream}; font-family: 'Raleway', sans-serif;
  color: ${t.esp}; overflow-x: hidden;
}

/* custom scrollbar thumb — shared look for the page and any local
   scroll container (product overlay, cart drawer, ...) */
.scroll-thumb, .local-scroll-thumb {
  width: 3px; border-radius: 3px;
  background: ${t.tan};
  opacity: 0; pointer-events: none;
  transition: opacity 0.4s ease;
  top: 0;
}
.scroll-thumb { position: fixed; right: 3px; z-index: 9999; }
.local-scroll-thumb { position: absolute; right: 3px; z-index: 20; }

/* ── NAV GHOST ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
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
.nav.scrolled .nav-menu-btn { color: ${t.brown}; }
.nav.scrolled .nav-cart-btn { color: ${t.dark}; }
.nav.scrolled .nav-wa { opacity: 1; pointer-events: all; transform: translateY(0); color: ${t.brown}; border-color: ${t.tan}; }

.nav-left { justify-self: start; position: relative; }
.nav-brand { justify-self: center; text-decoration: none; display: flex; flex-direction: column; align-items: center; gap: 0.14rem; }
.nav-brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem; font-weight: 600; letter-spacing: 0.14em;
  color: ${t.cream}; text-transform: uppercase;
  line-height: 1; transition: color 0.4s;
}
.nav-brand-sub {
  font-family: 'Playfair Display', serif;
  font-size: 0.58rem; font-weight: 300; letter-spacing: 0.24em;
  color: ${t.tan}; text-transform: uppercase;
  line-height: 1; font-style: italic; transition: color 0.4s;
}
.nav-menu-btn {
  display: flex; align-items: center; gap: 0.45rem;
  font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: ${t.cream}; background: none; border: none; cursor: pointer;
  padding: 0.4rem; opacity: 0.9; transition: color 0.4s, opacity 0.2s;
}
.nav-menu-btn:hover { opacity: 0.6; }
.nav-menu-btn span { display: none; }

/* ── NAV SIDEBAR — full-screen on mobile, half-screen on desktop ── */
.sidebar-overlay { position: fixed; inset: 0; z-index: 300; background: ${t.esp}55; backdrop-filter: blur(2px); opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
.sidebar-overlay.open { opacity: 1; pointer-events: all; }
.sidebar {
  position: fixed; top: 0; left: 0; bottom: 0; z-index: 400;
  width: 100vw; background: ${t.cream};
  display: flex; flex-direction: column;
  transform: translateX(-100%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 8px 0 40px ${t.esp}22;
}
.sidebar.open { transform: translateX(0); }
.sidebar-head { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 1.5rem 1.25rem; border-bottom: 1px solid ${t.sand}; flex-shrink: 0; }
.sidebar-brand { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 600; letter-spacing: 0.1em; color: ${t.dark}; text-transform: uppercase; }
.sidebar-close { background: none; border: none; cursor: pointer; color: ${t.tan}; padding: 0.25rem; display: flex; align-items: center; transition: color 0.2s; }
.sidebar-close:hover { color: ${t.dark}; }
.sidebar-links { flex: 1; overflow-y: auto; list-style: none; display: flex; flex-direction: column; padding: 1rem 0; }
.sidebar-links a { display: flex; align-items: center; font-family: 'Playfair Display', serif; font-size: 1.75rem; font-weight: 400; color: ${t.dark}; text-decoration: none; padding: 1rem 1.75rem; transition: background 0.15s, color 0.15s; }
.sidebar-links a:hover, .sidebar-links a:focus-visible { background: ${t.sand}55; color: ${t.brown}; outline: none; }
.sidebar-links a em { font-style: italic; color: ${t.warm}; }
.sidebar-foot { padding: 1.5rem; border-top: 1px solid ${t.sand}; flex-shrink: 0; }
.sidebar-wa { display: flex; align-items: center; justify-content: center; gap: 0.6rem; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.cream}; background: ${t.dark}; text-decoration: none; padding: 1rem; border-radius: 999px; transition: background 0.2s; }
.sidebar-wa:hover { background: ${t.esp}; }
.nav-right { justify-self: end; display: flex; align-items: center; gap: 1.25rem; }
.nav-wa {
  display: none; align-items: center; gap: 0.5rem;
  font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: ${t.cream}; text-decoration: none;
  padding: 0.45rem 1rem; border: 1px solid ${t.cream}44;
  border-radius: 999px; transition: background 0.2s, color 0.4s, border-color 0.4s, opacity 0.3s, transform 0.3s;
  opacity: 0.85;
}
.nav-wa:hover { background: ${t.cream}18; opacity: 1; }
.nav-cart-btn { display: flex; align-items: center; color: ${t.cream}; background: none; border: none; cursor: pointer; position: relative; padding: 0.25rem; transition: color 0.4s, opacity 0.2s; opacity: 0.85; }
.nav-cart-btn:hover { opacity: 0.55; }
.cart-count { position: absolute; top: -5px; right: -7px; width: 16px; height: 16px; border-radius: 50%; background: ${t.brown}; color: ${t.cream}; font-size: 0.55rem; font-weight: 500; display: flex; align-items: center; justify-content: center; opacity: 1; }

/* ── ADD-TO-CART TOAST ── */
.cart-toast {
  position: fixed; left: 1rem; right: 1rem;
  bottom: calc(1.25rem + env(safe-area-inset-bottom)); z-index: 250;
  background: ${t.esp}; color: ${t.cream}; border-radius: 20px;
  padding: 0.85rem 1rem; box-shadow: 0 8px 28px ${t.esp}44;
  display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
  animation: toastIn 0.3s cubic-bezier(0.34, 1.3, 0.64, 1);
}
@keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.cart-toast-text { font-size: 0.78rem; line-height: 1.4; }
.cart-toast-btn { flex-shrink: 0; font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; color: ${t.esp}; background: ${t.cream}; border: none; border-radius: 999px; padding: 0.5rem 0.85rem; cursor: pointer; }

/* ── CART DRAWER ── */
.drawer-overlay { position: fixed; inset: 0; z-index: 300; background: ${t.esp}55; backdrop-filter: blur(2px); opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
.drawer-overlay.open { opacity: 1; pointer-events: all; }
.drawer { position: fixed; top: 0; right: 0; bottom: 0; z-index: 400; width: min(420px, 100vw); background: ${t.cream}; display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1); box-shadow: -8px 0 40px ${t.esp}22; }
.drawer.open { transform: translateX(0); }
.drawer-head { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 1.5rem 1.25rem; border-bottom: 1px solid ${t.sand}; flex-shrink: 0; }
.drawer-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 300; color: ${t.dark}; }
.drawer-title em { font-style: italic; }
.drawer-close { background: none; border: none; cursor: pointer; color: ${t.tan}; padding: 0.25rem; display: flex; align-items: center; transition: color 0.2s; }
.drawer-close:hover { color: ${t.dark}; }
.drawer-body { position: relative; flex: 1; overflow-y: auto; padding: 0 1.5rem; }
.drawer-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 1rem; padding: 3rem 0; }
.drawer-empty-icon { color: ${t.tan}; }
.drawer-empty-text { font-size: 0.85rem; color: ${t.warmText}; text-align: center; line-height: 1.7; }
.drawer-empty-cta { font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.brown}; background: none; border: 1px solid ${t.tan}; padding: 0.6rem 1.25rem; border-radius: 999px; cursor: pointer; transition: all 0.2s; }
.drawer-empty-cta:hover { background: ${t.brown}; color: ${t.cream}; border-color: ${t.brown}; }
.drawer-line { display: flex; align-items: flex-start; gap: 1rem; padding: 1.25rem 0; border-bottom: 1px solid ${t.sand}; }
.drawer-line-info { flex: 1; }
.drawer-line-name { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 400; color: ${t.dark}; margin-bottom: 0.15rem; }
.drawer-line-flavor { font-size: 0.72rem; color: ${t.warmText}; }
.drawer-line-price { font-size: 0.72rem; color: ${t.brown}; margin-top: 0.25rem; }
.drawer-line-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; padding-top: 0.2rem; }
.dqty-btn { width: 26px; height: 26px; border-radius: 50%; border: 1px solid ${t.tan}; background: transparent; color: ${t.brown}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.dqty-btn:hover { background: ${t.brown}; color: ${t.cream}; border-color: ${t.brown}; }
.dqty-val { font-size: 0.85rem; font-weight: 500; color: ${t.dark}; min-width: 1.2rem; text-align: center; }
.drawer-total-row { display: flex; justify-content: space-between; align-items: baseline; padding: 1rem 0 0; font-size: 0.85rem; font-weight: 500; color: ${t.dark}; }
.drawer-total-note { font-size: 0.66rem; color: ${t.warmText}; margin-top: 0.35rem; line-height: 1.5; }
.drawer-sent-check { width: 56px; height: 56px; border-radius: 50%; background: ${t.brown}; color: ${t.cream}; display: flex; align-items: center; justify-content: center; }
.drawer-form-wrap { padding: 1.5rem 0 1rem; }
.drawer-form-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 300; color: ${t.dark}; margin-bottom: 1.25rem; }
.drawer-form-title em { font-style: italic; }
.d-form { display: flex; flex-direction: column; gap: 0.85rem; }
.d-form-group { display: flex; flex-direction: column; gap: 0.3rem; }
.d-label { font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: ${t.brown}; }
.d-input, .d-textarea { font-family: 'Raleway', sans-serif; font-size: 0.88rem; font-weight: 300; color: ${t.dark}; background: transparent; border: none; border-bottom: 1px solid ${t.tan}; padding: 0.55rem 0; outline: none; transition: border-color 0.2s; width: 100%; }
.d-input:focus, .d-textarea:focus { border-bottom-color: ${t.brown}; }
.d-textarea { resize: vertical; min-height: 60px; }
.d-hint { font-size: 0.66rem; color: ${t.warmText}; line-height: 1.5; }
.d-privacy { font-size: 0.66rem; color: ${t.warmText}; line-height: 1.5; margin-top: 1rem; opacity: 0.85; }
.drawer-foot { padding: 1.25rem 1.5rem; border-top: 1px solid ${t.sand}; flex-shrink: 0; display: flex; flex-direction: column; gap: 0.75rem; }
.drawer-note { font-size: 0.68rem; color: ${t.warmText}; font-style: italic; }
.drawer-wa-btn { display: flex; align-items: center; justify-content: center; gap: 0.6rem; font-family: 'Raleway', sans-serif; font-size: 0.78rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.cream}; background: ${t.dark}; border: none; cursor: pointer; padding: 1rem; border-radius: 999px; width: 100%; transition: background 0.2s; }
.drawer-wa-btn:hover { background: ${t.esp}; }
.drawer-wa-btn:disabled { background: ${t.tan}; cursor: not-allowed; }
.drawer-wa-btn:disabled:hover { background: ${t.tan}; }
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
.product-overlay.open.closing { pointer-events: none; }
.product-overlay.open::before { opacity: 1; }
.product-overlay.closing::before { opacity: 0; transition: opacity 0.26s ease; }

.po-card {
  position: relative; z-index: 1;
  background: ${t.cream}; width: 100%; max-width: 860px;
  max-height: 90vh; overflow-y: auto;
  display: grid; grid-template-columns: 1fr;
  opacity: 0; transform: scale(0.94) translateY(24px);
  border-radius: 28px;
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
  width: 100%; aspect-ratio: 4/5;
  background: linear-gradient(135deg, ${t.sand} 0%, ${t.tan} 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-size: 0.9rem;
  color: ${t.warm}88; letter-spacing: 0.15em; flex-shrink: 0;
}
.po-body { position: relative; padding: 2rem 1.75rem 2.5rem; }
.po-tag { font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: ${t.warm}; margin-bottom: 0.4rem; }
.po-name { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 300; color: ${t.dark}; line-height: 1.1; margin-bottom: 1rem; }
.po-name em { font-style: italic; }
.po-desc { font-size: 0.88rem; font-weight: 300; color: ${t.warmText}; line-height: 1.85; margin-bottom: 1.75rem; }
.po-flavor-label { font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: ${t.warm}; margin-bottom: 0.75rem; }
.po-flavor-sublabel { font-size: 0.66rem; font-weight: 500; color: ${t.brown}; margin-bottom: 0.5rem; }
.po-flavors { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem; }
.po-flavor-pill { font: inherit; font-size: 0.75rem; color: ${t.warmText}; background: ${t.sand}; padding: 0.5rem 0.9rem; min-height: 44px; border-radius: 20px; border: 1px solid ${t.tan}88; cursor: pointer; transition: all 0.15s; }
.po-flavor-pill:focus-visible { outline: 2px solid ${t.brown}; outline-offset: 2px; }
.po-flavor-pill.selected { background: ${t.brown}; color: ${t.cream}; border-color: ${t.brown}; }

/* Flavor card grid — one visual language whether or not a flavor has a
   photo, so picking a flavour reads as "browsing bakes" instead of
   "reading a list of buttons". Cards without a photo fall back to the
   same placeholder gradient used elsewhere on the site (po-img, menu
   cards) rather than a blank tile. */
.flavor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 0.6rem; margin-bottom: 2rem; }
.flavor-card { font: inherit; position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; padding: 0; cursor: pointer; border: 2px solid transparent; background: linear-gradient(135deg, ${t.sand} 0%, ${t.tan} 100%); transition: border-color 0.15s, transform 0.15s; }
.flavor-card:hover { transform: translateY(-2px); }
.flavor-card:focus-visible { outline: 2px solid ${t.brown}; outline-offset: 2px; }
.flavor-card.selected { border-color: ${t.brown}; }
.flavor-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.flavor-card-check { position: absolute; top: 0.3rem; right: 0.3rem; width: 18px; height: 18px; border-radius: 50%; background: ${t.brown}; color: ${t.cream}; display: flex; align-items: center; justify-content: center; }
.flavor-card-label { position: absolute; inset-inline: 0; bottom: 0; padding: 0.4rem 0.35rem 0.3rem; font-size: 0.64rem; font-weight: 500; line-height: 1.25; color: ${t.cream}; text-align: center; background: linear-gradient(to top, ${t.esp}cc 0%, transparent 100%); }
.flavor-card-price { display: block; font-size: 0.58rem; font-weight: 400; opacity: 0.85; margin-top: 0.1rem; }
.po-order-row { display: flex; align-items: center; gap: 0.75rem; padding-top: 1.25rem; border-top: 1px solid ${t.sand}; }
.po-price { font-size: 0.88rem; font-weight: 500; color: ${t.brown}; flex: 1; }
.po-qty-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid ${t.tan}; background: transparent; color: ${t.brown}; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.po-qty-btn:hover { background: ${t.brown}; color: ${t.cream}; border-color: ${t.brown}; }
.po-qty-val { font-size: 0.9rem; font-weight: 500; color: ${t.dark}; min-width: 1.4rem; text-align: center; }
.po-add-btn { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.cream}; background: ${t.dark}; border: none; cursor: pointer; padding: 0.8rem 1.75rem; border-radius: 999px; transition: background 0.2s, transform 0.15s; display: flex; align-items: center; gap: 0.4rem; }
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
.hero-circle-text { font-family: 'Playfair Display', serif; font-size: 0.72rem; font-style: italic; color: ${t.brown}; z-index: 1; letter-spacing: 0.1em; }
.hero-badge { display: none; }
.hero-content {
  position: relative; z-index: 1;
  margin-top: auto;
  padding: 2rem 1.5rem calc(5.5rem + env(safe-area-inset-bottom));
  background: linear-gradient(to top, ${t.cream} 70%, transparent 100%);
}
.hero-eyebrow { font-size: 0.62rem; letter-spacing: 0.18em; color: ${t.warm}; text-transform: uppercase; margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.5rem; opacity: 1; animation: fadeUp 0.8s 0.2s forwards; }
.hero-eyebrow::before { content: ''; display: block; width: 1.5rem; height: 1px; background: ${t.tan}; flex-shrink: 0; }
.hero-title { font-family: 'Playfair Display', serif; font-size: clamp(2.6rem, 9vw, 3.5rem); font-weight: 300; line-height: 1.05; color: ${t.dark}; margin-bottom: 0.75rem; opacity: 1; animation: fadeUp 0.9s 0.35s forwards; }
.hero-title em { font-style: italic; color: ${t.brown}; }
.hero-sub { font-size: 0.85rem; font-weight: 300; line-height: 1.7; color: ${t.warmText}; margin-bottom: 1.75rem; opacity: 1; animation: fadeUp 0.9s 0.5s forwards; max-width: 340px; }
.hero-actions { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; opacity: 0; animation: fadeUp 0.9s 0.65s forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.btn-primary { font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; color: ${t.cream}; background: ${t.dark}; padding: 0.85rem 1.75rem; border-radius: 999px; text-decoration: none; text-transform: uppercase; transition: background 0.2s, transform 0.2s; border: none; cursor: pointer; display: inline-block; }
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
.section-title { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 300; color: ${t.dark}; line-height: 1.1; }
.section-title em { font-style: italic; }

/* ── MENU INTRO — breathing room between hero and showcase ── */
.menu-intro { padding: 6rem 1.25rem 2.5rem; text-align: center; }

/* ── MENU SHOWCASE — alternating rows that start plain and "light up" with
   that product's matched color once scrolled into view (one-time, via the
   same reveal/visible mechanism the rest of the site uses for entrances) ── */
.showcase-row-section { background: ${t.cream}; padding: 2.5rem 1.25rem; }
.showcase-card {
  position: relative; max-width: 1000px; margin: 0 auto;
  border-radius: 28px; overflow: hidden;
  padding: 1.75rem 1.75rem 2.5rem;
  background-color: transparent;
  transition: background-color 0.7s ease;
}
.showcase-row.visible .showcase-card { background-color: var(--pcolor); }
.showcase-grid { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.showcase-photo-block {
  width: 100%; max-width: 320px; aspect-ratio: 1/1;
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 12px 28px ${t.esp}22;
}
.showcase-photo-block img { width: 100%; height: 100%; object-fit: cover; display: block; }
.showcase-row-body { display: flex; flex-direction: column; align-items: flex-start; width: 100%; }
.showcase-badge { display: inline-block; background: ${t.sand}; color: ${t.brown}; font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; padding: 0.45rem 1rem; border-radius: 999px; margin-bottom: 1rem; }
.showcase-row-name { font-family: 'Playfair Display', serif; font-weight: 400; font-size: clamp(1.8rem, 5vw, 2.6rem); color: ${t.dark}; line-height: 1.15; margin-bottom: 0.85rem; transition: color 0.7s ease; }
.showcase-row.visible .showcase-row-name { color: ${t.cream}; }
.showcase-row-desc { font-size: 0.88rem; font-weight: 300; color: ${t.warmText}; line-height: 1.75; margin-bottom: 0.75rem; max-width: 420px; transition: color 0.7s ease; }
.showcase-row.visible .showcase-row-desc { color: ${t.cream}; }
.showcase-row-price { font-size: 0.85rem; font-weight: 500; color: ${t.brown}; margin-bottom: 1.25rem; transition: color 0.7s ease; }
.showcase-row.visible .showcase-row-price { color: ${t.cream}; }
.showcase-row-links { display: flex; align-items: center; gap: 1rem; }
.showcase-link {
  background: none; border: 1px solid transparent; padding: 0; border-radius: 999px;
  font-size: 0.78rem; font-weight: 500; cursor: pointer; color: ${t.dark};
  text-decoration: underline; text-underline-offset: 3px;
  transition: color 0.5s ease, border-color 0.5s ease, background-color 0.5s ease, padding 0.5s ease;
}
.showcase-row.visible .showcase-link { color: ${t.esp}; border-color: ${t.esp}; padding: 0.75rem 1.5rem; text-decoration: none; }
.showcase-row.visible .showcase-link-primary { background-color: ${t.esp}; color: var(--pcolor); }

/* ── HOW IT WORKS ── */
.how-section { padding: 3.5rem 1.25rem; background: ${t.dark}; }
.how-section .section-label { color: ${t.tan}; }
.how-section .section-title { color: ${t.cream}; margin-bottom: 3rem; }
.how-steps { display: flex; flex-direction: column; gap: 0; }
.how-step { padding: 2rem 0; border-bottom: 1px solid ${t.brown}33; display: flex; gap: 1.5rem; align-items: flex-start; }
.how-step:last-child { border-bottom: none; }
.how-step-num { font-family: 'Playfair Display', serif; font-size: 2.8rem; font-weight: 300; color: ${t.brown}44; line-height: 1; flex-shrink: 0; width: 3rem; }
.how-step-body {}
.how-step-icon { margin-bottom: 0.75rem; color: ${t.tan}; }
.how-step-title { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 400; color: ${t.cream}; margin-bottom: 0.4rem; }
.how-step-desc { font-size: 0.8rem; font-weight: 300; color: ${t.tan}; line-height: 1.8; }

/* ── THIS WEEK'S BAKE ── */
.weekly-section { padding: 3.5rem 1.25rem; border-top: 1px solid ${t.sand}; }
.weekly-inner { background: ${t.sand}; position: relative; overflow: hidden; border-radius: 16px; }
.weekly-inner::after { content: ''; position: absolute; bottom: -50px; right: -50px; width: 180px; height: 180px; border-radius: 50%; background: ${t.tan}55; pointer-events: none; }
.weekly-img { width: 100%; aspect-ratio: 1/1; background: linear-gradient(135deg, ${t.tan} 0%, ${t.brown}44 100%); display: flex; align-items: center; justify-content: center; position: relative; font-family: 'Playfair Display', serif; font-size: 0.9rem; color: ${t.cream}88; letter-spacing: 0.15em; flex-shrink: 0; }
.weekly-body { padding: 1.75rem 1.5rem 2rem; position: relative; z-index: 1; }
.weekly-eyebrow { font-size: 0.62rem; letter-spacing: 0.2em; text-transform: uppercase; color: ${t.warm}; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
.weekly-name { font-family: 'Playfair Display', serif; font-size: clamp(1.6rem, 5vw, 2.5rem); font-weight: 300; color: ${t.dark}; line-height: 1.15; margin-bottom: 0.75rem; }
.weekly-name em { font-style: italic; }
.weekly-desc { font-size: 0.84rem; font-weight: 300; color: ${t.warmText}; line-height: 1.8; margin-bottom: 1.25rem; }
.weekly-meta { display: flex; gap: 1.25rem; margin-bottom: 1.75rem; flex-wrap: wrap; }
.weekly-meta-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; color: ${t.brown}; }

/* ── ABOUT ── */
.about-section { padding: 3.5rem 1.25rem; border-top: 1px solid ${t.sand}; }
.about-grid { display: flex; flex-direction: column; gap: 1.75rem; }
.about-img { width: 100%; aspect-ratio: 4/3; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, ${t.sand} 0%, ${t.tan} 100%); }
.about-img img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
.about-body { display: flex; flex-direction: column; }
.about-text { font-size: 0.88rem; font-weight: 300; color: ${t.warmText}; line-height: 1.85; margin-bottom: 1rem; }
.about-text:last-child { margin-bottom: 0; }
.about-signoff { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.1rem; color: ${t.dark}; margin-top: 0.75rem; }

/* ── TESTIMONIALS ── */
.testi-section { padding: 3.5rem 1.25rem; background: ${t.sand}55; }
.testi-grid { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; }
.testi-card { background: ${t.cream}; border: 1px solid ${t.sand}; border-radius: 16px; padding: 1.5rem 1.5rem 1.35rem; position: relative; }
.testi-quote-icon { color: ${t.tan}; margin-bottom: 0.75rem; }
.testi-stars { display: flex; gap: 0.15rem; margin-bottom: 0.85rem; color: ${t.warm}; }
.testi-text { font-size: 0.85rem; font-weight: 300; color: ${t.dark}; line-height: 1.75; margin-bottom: 1.1rem; }
.testi-meta { display: flex; align-items: center; justify-content: space-between; }
.testi-name { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 500; color: ${t.dark}; }
.testi-source { font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.warm}; }

/* ── GALLERY ── */
.gallery-section { padding: 3.5rem 1.25rem; border-top: 1px solid ${t.sand}; }
.gallery-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.75rem; }
.gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem; }
.gallery-item { position: relative; aspect-ratio: 1/1; overflow: hidden; border-radius: 16px; background: ${t.sand}; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; object-position: center; transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
.gallery-item:hover img { transform: scale(1.06); }
.gallery-ig-link { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: ${t.brown}; text-decoration: none; transition: color 0.2s; }
.gallery-ig-link:hover { color: ${t.dark}; }

/* ── JOURNAL ── */
.blog-section { padding: 3.5rem 1.25rem; background: ${t.sand}55; }
.blog-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid ${t.sand}; }
.blog-grid { display: flex; flex-direction: column; gap: 1rem; }
.blog-card { background: ${t.cream}; border: 1px solid ${t.sand}; border-radius: 16px; overflow: hidden; position: relative; }
.blog-skeleton-img { width: 100%; height: 160px; background: linear-gradient(90deg, ${t.sand} 25%, ${t.cream} 50%, ${t.sand} 75%); background-size: 200% 100%; animation: shimmer 1.8s infinite; }
.blog-skeleton-body { padding: 1.25rem; }
.blog-skel { border-radius: 8px; margin-bottom: 0.5rem; background: linear-gradient(90deg, ${t.sand} 25%, ${t.cream} 50%, ${t.sand} 75%); background-size: 200% 100%; animation: shimmer 1.8s infinite; }
.coming-soon-badge { position: absolute; top: 0.75rem; right: 0.75rem; font-size: 0.58rem; letter-spacing: 0.15em; text-transform: uppercase; color: ${t.brown}; background: ${t.cream}; border: 1px solid ${t.tan}; padding: 0.25rem 0.6rem; border-radius: 20px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* ── FOOTER ── */
.footer { background: ${t.esp}; padding: 2.5rem 1.25rem 2rem; display: flex; flex-direction: column; gap: 1.5rem; border-top: 1px solid ${t.dark}; }
.footer-brand { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; letter-spacing: 0.1em; color: ${t.cream}; text-transform: uppercase; }
.footer-tagline { font-size: 0.73rem; font-weight: 300; color: ${t.tan}; line-height: 1.6; margin-top: 0.3rem; }
.footer-links { list-style: none; display: flex; flex-wrap: wrap; gap: 0.4rem 1.25rem; }
.footer-links a { font-size: 0.67rem; letter-spacing: 0.1em; text-transform: uppercase; color: ${t.tan}; text-decoration: none; transition: color 0.2s; }
.footer-links a:hover, .footer-links a:focus-visible { color: ${t.cream}; }
.footer-col-title { font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: ${t.tan}; margin-bottom: 0.65rem; }
.footer-contact { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
.footer-contact li { display: flex; align-items: flex-start; gap: 0.5rem; font-size: 0.72rem; color: ${t.tan}; line-height: 1.5; }
.footer-contact a { color: ${t.tan}; text-decoration: none; transition: color 0.2s; }
.footer-contact a:hover, .footer-contact a:focus-visible { color: ${t.cream}; }
.footer-contact svg { flex-shrink: 0; margin-top: 0.15rem; color: ${t.tan}; }
.footer-bottom { font-size: 0.62rem; color: ${t.tan}cc; padding-top: 0.75rem; border-top: 1px solid ${t.dark}88; }

/* ── DESKTOP 768+ ── */
@media (min-width: 768px) {
  .nav { padding: 1rem 3rem; }
  .nav-brand-name { font-size: 1.2rem; }
  .nav-brand-sub { font-size: 0.62rem; }
  .nav-menu-btn span { display: inline; }
  .sidebar { width: 50vw; max-width: 640px; }
  .nav-wa { display: flex; opacity: 0; pointer-events: none; transform: translateY(-4px); }
  .nav-right { gap: 1.5rem; }
  .cart-toast { left: auto; right: 2rem; bottom: 1.5rem; max-width: 360px; }

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
  .hero-badge-value { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 400; color: ${t.dark}; }

  /* MENU INTRO + SHOWCASE — desktop */
  .menu-intro { padding: 8rem 3rem 3rem; }
  .showcase-row-section { padding: 3rem; }
  .showcase-card { padding: 4rem; overflow: visible; }
  .showcase-grid { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 4rem; }
  .showcase-photo-block { width: 100%; max-width: none; aspect-ratio: 1/1; border-radius: 20px; margin: 0 0 0 -6rem; box-shadow: 0 20px 44px ${t.esp}22; }
  .showcase-reverse .showcase-photo-block { order: 2; margin: 0 -6rem 0 0; }
  .showcase-row-body { padding: 0; }
  .showcase-reverse .showcase-row-body { order: 1; }

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

  /* ABOUT */
  .about-section { padding: 6rem 3rem; }
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .about-img { aspect-ratio: 1/1; }
  .about-body { justify-content: center; }

  /* TESTIMONIALS */
  .testi-section { padding: 6rem 3rem; }
  .testi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }

  /* GALLERY */
  .gallery-section { padding: 6rem 3rem; }
  .gallery-grid { grid-template-columns: repeat(6, 1fr); gap: 0.75rem; }

  /* JOURNAL */
  .blog-section { padding: 6rem 3rem; }
  .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; flex-direction: unset; }

  /* FOOTER */
  .footer { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 2.5rem; flex-direction: unset; align-items: start; padding: 3rem; }
  .footer-bottom { grid-column: 1 / -1; text-align: right; }
}
`;

// Two variant models, matching how prices actually depend on choices:
//  - `flavors`: a single attribute where each option may carry its own price
//    (e.g. Mini Cakes — price depends only on which flavour you pick).
//  - `flavorGroups` + `quantities`: two independent attributes (flavour and
//    pack size) where price depends on the combination of both — flavour
//    determines a price "tier", quantity picks a price within that tier.
const products = [
  { tag: "This Week", name: "Donut Bites", image: "donuts.webp", squareImage: "donuts-square.webp", showcaseColor: "#955431", flavors: [{ name: "Cinnamon Sugar" }, { name: "Vanilla Glaze" }, { name: "Lemon Glaze" }, { name: "Chocolate Dip" }], desc: "Freshly fried donut bites in your choice of glaze — golden, warm and impossible to stop at one. Limited batches.", price: "Coming soon" },
  {
    tag: "Bite Sized", name: "Mini Cakes", image: "mini-cakes.webp", squareImage: "mini-cakes-square.webp", showcaseColor: "#7F5C41",
    flavors: [
      { name: "Chocolate", price: 45, image: "choc.webp" },
      { name: "Red Velvet", price: 48, image: "redvelvet.webp" },
      { name: "Mocha", price: 45 },
      { name: "Hot Chocolate", price: 48, image: "hotchocholate.webp" },
      { name: "Burfi", price: 42, image: "burfee.webp" },
      { name: "Vanilla", price: 42 },
      { name: "Carrot Cake", price: 45, image: "carrotclosup.webp" },
    ],
    desc: "Perfectly portioned mini cakes for any occasion, baked fresh to order.", price: "From R42",
  },
  {
    tag: "Signature", name: "Cinnamon Rolls", image: "cinnamon-rolls.webp", squareImage: "cinnamon-rolls-square.webp", showcaseColor: "#8A4C24",
    flavorGroups: [
      { tier: "Classic", label: "Classic Rolls", flavors: [
        { name: "Classic", price: 25 },
        { name: "Classic + Nuts/Coconut", price: 35 },
        { name: "Iced", price: 30 },
        { name: "CinnaCream", price: 45 },
      ] },
      { tier: "Speciality", label: "Speciality Rolls", flavors: [
        { name: "Almond Delight", price: 55 },
        { name: "Chocolate Dream", price: 55 },
        { name: "Royal Oreo", price: 55 },
        { name: "Caramel Swirl", price: 55 },
      ] },
    ],
    quantities: [
      { key: "single", label: "Single" },
      { key: "pack4", label: "4-Pack", tierPrice: { Classic: 90, Speciality: 200 } },
      { key: "pack6", label: "6-Pack", tierPrice: { Classic: 130, Speciality: 290 } },
      { key: "pack12", label: "12-Pack", tierPrice: { Classic: 250, Speciality: 580 } },
    ],
    desc: "Our signature soft & fluffy cinnamon rolls. Choose from our classic glazes, decadent speciality flavours, or grab a value pack.", price: "From R25",
  },
  { tag: "Classic", name: "Chunky Cookies", image: "cookies.webp", squareImage: "cookies-square.webp", showcaseColor: "#815937", basePrice: 35, flavors: [{ name: "Brown Butter Choc Chip" }, { name: "Double Chocolate" }, { name: "Macadamia Nut" }, { name: "Oatmeal Raisin" }], desc: "Thick, chewy, and loaded with goodness. Our cookies are baked to have a crispy edge and a gooey center.", price: "From R35" },
  { tag: "Decadent", name: "Tres Leches Milk Cake", image: "milk-cake.webp", squareImage: "milk-cake-square.webp", showcaseColor: "#7D5128", basePrice: 350, flavors: [{ name: "Pistachio" }, { name: "Almond" }, { name: "Coconut" }, { name: "Strawberry" }, { name: "Blueberry (coming soon)" }, { name: "Chocolate (coming soon)" }], desc: "A rich and moist sponge cake soaked in three kinds of milk, topped with a light whipped cream layer.", price: "From R350" },
]

function flavorTier(product, flavorName) {
  const group = product.flavorGroups.find(g => g.flavors.some(f => f.name === flavorName));
  return group?.tier;
}
function flavorPrice(product, flavorName) {
  for (const g of product.flavorGroups) {
    const f = g.flavors.find(f => f.name === flavorName);
    if (f) return f.price;
  }
  return null;
}
function unitPrice(overlay) {
  const { product, flavor, quantity } = overlay;
  if (product.flavorGroups) {
    if (!quantity || quantity === "single") return flavorPrice(product, flavor);
    const q = product.quantities.find(q => q.key === quantity);
    return q ? q.tierPrice[flavorTier(product, flavor)] : null;
  }
  return product.flavors.find(f => f.name === flavor)?.price ?? product.basePrice ?? null;
}
function priceLabel(overlay) {
  const p = unitPrice(overlay);
  return p != null ? `R${p}` : overlay.product.price;
}
function overlayImage(overlay) {
  const { product, flavor } = overlay;
  const flavors = product.flavorGroups ? product.flavorGroups.flatMap(g => g.flavors) : product.flavors;
  return flavors.find(f => f.name === flavor)?.image ?? product.image;
}

const testimonials = [
  {
    name: "Maneesha Domun",
    source: "Google Reviews",
    stars: 5,
    text: "Five stars for Kind Crumb! The cakes are incredible, but the packaging is what truly sets them apart. Seeing each item so thoughtfully and securely wrapped was impressive. Highly recommend!",
  },
  {
    name: "Lakshmi Mohan",
    source: "Facebook",
    stars: 5,
    text: "All her cakes are vegetarian with vegan options — as a vegetarian it's difficult to find nice treats. The burfee cake was decadent with delicious frosting and cardamom flavour. Everyone loved the carrot cake best, rich and moist. The hot chocolate cake was to die for, with a rich chocolate ganache.",
  },
];

const aboutStory = {
  eyebrow: "Our story",
  paragraphs: [
    "Kind Crumb started the way most good things do — in a home kitchen, with a family recipe and no intention of becoming anything more than a treat for friends.",
    "Every order is still baked in small batches, always eggless, and packed with the same care whether it's a single box of cookies or a full celebration order. Nothing sits pre-made — it's made when you ask for it.",
  ],
  signoff: "— Renata, founder of Kind Crumb",
};

// Orders are taken 7:30am-5pm daily and need 24hrs notice. Since a same-day
// "tomorrow" order placed after closing wouldn't get a full working day of
// notice, the cutoff rolls forward an extra day once we're past close.
const ORDER_HOURS = { openHour: 7.5, closeHour: 17 };

function getMinOrderDate(now = new Date()) {
  const hours = now.getHours() + now.getMinutes() / 60;
  const daysAhead = hours < ORDER_HOURS.closeHour ? 1 : 2;
  const min = new Date(now);
  min.setDate(min.getDate() + daysAhead);
  return min.toISOString().slice(0, 10);
}

function upcomingSunday(from = new Date()) {
  const d = new Date(from);
  const diff = d.getDay() === 0 ? 0 : 7 - d.getDay();
  d.setDate(d.getDate() + diff);
  return d;
}

const weeklyBake = {
  name: "Fresh\nDonut Bites",
  desc: "This week's featured bake — golden fried donut bites rolled in cinnamon sugar. A limited batch, available until Sunday.",
  meta: [
    { icon: Clock, label: `Until ${upcomingSunday().toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short" })}` },
    { icon: Flame, label: "Fried fresh" },
    { icon: Wheat, label: "Eggless" },
  ],
  productIdx: 0,
};

// Scrolls to a #hash target on navigation — needed because plain <a href="#id">
// anchors only work within the current page; moving content across routes
// (e.g. a footer link from "/" to "/story#about") needs this to run the
// scroll after the target route has actually mounted.
function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location]);
  return null;
}

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

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Drives a .local-scroll-thumb to mirror a container's own scroll position —
// the same custom-scrollbar treatment the page itself uses, applied to any
// internally-scrolling element (product overlay, cart drawer, ...) so native
// browser scrollbars never have a chance to render there either.
function useLocalScrollThumb(containerRef, thumbRef, active) {
  useEffect(() => {
    const container = containerRef.current;
    const thumb = thumbRef.current;
    if (!container || !thumb || !active) return;
    let hideTimer;
    const measure = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight <= clientHeight + 1) { thumb.style.opacity = "0"; return; }
      const thumbHeight = Math.max(30, (clientHeight / scrollHeight) * clientHeight);
      const maxTop = clientHeight - thumbHeight;
      const ratio = maxTop > 0 ? scrollTop / (scrollHeight - clientHeight) : 0;
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.top = `${ratio * maxTop}px`;
    };
    const onScroll = () => {
      measure();
      thumb.style.opacity = "0.7";
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => { thumb.style.opacity = "0"; }, 1000);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    measure();
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      ro.disconnect();
      clearTimeout(hideTimer);
    };
  }, [containerRef, thumbRef, active]);
}

function useFocusTrap(active, containerRef, onClose) {
  const prevFocus = useRef(null);
  useEffect(() => {
    if (!active) return;
    prevFocus.current = document.activeElement;
    const el = containerRef.current;
    const focusables = () => el ? Array.from(el.querySelectorAll(FOCUSABLE)) : [];
    const first = focusables()[0];
    if (first) first.focus(); else el?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const firstEl = items[0], lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      prevFocus.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- containerRef is stable; onClose is re-created per render but we intentionally only re-arm on `active` change
  }, [active]);
}

// Makes the mobile/browser back button close an open overlay (product card,
// cart drawer, nav sidebar) instead of leaving the page. Opening pushes a
// throwaway history entry; the back button pops it (caught via popstate,
// which just closes the overlay). Closing via any other control (X, Escape,
// backdrop click) consumes that same entry with history.back() so it never
// lingers and a real subsequent back press doesn't require two taps.
function useBackButtonClose(active, onClose) {
  const pushedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (active && !pushedRef.current) {
      window.history.pushState({ overlay: true }, "");
      pushedRef.current = true;
    } else if (!active && pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    }
  }, [active]);

  useEffect(() => {
    const onPopState = () => {
      if (pushedRef.current) {
        pushedRef.current = false;
        onCloseRef.current();
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
}

function ShowcaseRow({ product: p, reverse, onOpen }) {
  const open = () => onOpen(p);
  return (
    <section className="showcase-row-section">
      <R className={`showcase-row${reverse ? " showcase-reverse" : ""}`} style={{ "--pcolor": p.showcaseColor }}>
        <div className="showcase-card">
          <div className="showcase-grid">
            <div className="showcase-photo-block">
              <img src={`/images/${p.squareImage || p.image}`} alt={p.name} loading="lazy" width="500" height="500" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="showcase-row-body">
              <p className="showcase-badge">{p.tag}</p>
              <h3 className="showcase-row-name">{p.name}</h3>
              <p className="showcase-row-desc">{p.desc}</p>
              <p className="showcase-row-price">{p.price}</p>
              <div className="showcase-row-links">
                <button className="showcase-link" onClick={open}>Learn More</button>
                <button className="showcase-link showcase-link-primary" onClick={open}>Order Now</button>
              </div>
            </div>
          </div>
        </div>
      </R>
    </section>
  );
}

function FlavorCard({ flavor, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`flavor-card${selected ? " selected" : ""}`}
      aria-pressed={selected}
      aria-label={flavor.price ? `${flavor.name}, R${flavor.price}` : flavor.name}
      onClick={onSelect}
    >
      {flavor.image && <img src={`/images/${flavor.image}`} alt="" loading="lazy" width="96" height="96" />}
      {selected && <span className="flavor-card-check"><Check size={11} strokeWidth={2.5} /></span>}
      <span className="flavor-card-label">
        {flavor.name}
        {flavor.price != null && <span className="flavor-card-price">R{flavor.price}</span>}
      </span>
    </button>
  );
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



function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overlay, setOverlay] = useState(null);
  const [overlayClosing, setOverlayClosing] = useState(false); // { product, flavor, qty, added }
  const [toast, setToast] = useState(null); // { name, flavor } — transient "added to cart" confirmation
  const [orderSent, setOrderSent] = useState(false);

  const [formData, setFormData] = useState({ name: "", phone: "", date: "", notes: "" });

  const [navScrolled, setNavScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  useFocusTrap(drawerOpen, drawerRef, () => setDrawerOpen(false));
  useFocusTrap(!!overlay && !overlayClosing, overlayRef, () => closeOverlay());
  useFocusTrap(sidebarOpen, sidebarRef, () => setSidebarOpen(false));

  useBackButtonClose(drawerOpen, () => setDrawerOpen(false));
  useBackButtonClose(!!overlay && !overlayClosing, () => closeOverlay());
  useBackButtonClose(sidebarOpen, () => setSidebarOpen(false));

  // Local custom scrollbars for the product overlay and cart drawer — which
  // element actually scrolls varies by breakpoint (po-card on mobile,
  // po-body on the desktop side-by-side layout), so both get a thumb and
  // whichever one has no overflow simply stays hidden.
  const poCardThumbRef = useRef(null);
  const poBodyRef = useRef(null);
  const poBodyThumbRef = useRef(null);
  const drawerBodyRef = useRef(null);
  const drawerBodyThumbRef = useRef(null);
  useLocalScrollThumb(overlayRef, poCardThumbRef, !!overlay);
  useLocalScrollThumb(poBodyRef, poBodyThumbRef, !!overlay);
  useLocalScrollThumb(drawerBodyRef, drawerBodyThumbRef, drawerOpen);

  useEffect(() => {
    if (location.pathname !== "/") {
      setNavScrolled(true);
      return;
    }
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

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
  const toastTimer = useRef(null);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

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

  const openOverlay = (product) => {
    setOverlayClosing(false);
    const flavor = product.flavorGroups ? product.flavorGroups[0].flavors[0].name : product.flavors[0].name;
    setOverlay({ product, flavor, quantity: "single", qty: 1, added: false });
  };
  const closeOverlay = () => { setOverlayClosing(true); setTimeout(() => { setOverlay(null); setOverlayClosing(false); }, 260); };

  const addToCart = (name, flavor, qty, price, unit) => {
    setCart(prev => {
      const idx = prev.findIndex(c => c.name === name && c.flavor === flavor);
      if (idx >= 0) { const u = [...prev]; u[idx].qty += qty; return u; }
      return [...prev, { name, flavor, qty, price, unitPrice: unit }];
    });
    // A toast instead of force-opening the drawer — popping the cart open on
    // every add blocks the menu underneath, which makes building a multi-item
    // order tedious (close, browse, add, drawer pops again, close...).
    setToast({ name, flavor });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  const addFromOverlay = () => {
    if (!overlay) return;
    const qtyLabel = overlay.product.quantities?.find(q => q.key === overlay.quantity)?.label;
    const flavorLabel = qtyLabel && overlay.quantity !== "single" ? `${overlay.flavor} · ${qtyLabel}` : overlay.flavor;
    addToCart(overlay.product.name, flavorLabel, overlay.qty, priceLabel(overlay), unitPrice(overlay));
    setOverlay(o => ({ ...o, added: true }));
    setTimeout(() => closeOverlay(), 1100);
  };

  const updateCartQty = (i, d) => {
    const u = [...cart]; u[i].qty = Math.max(0, u[i].qty + d);
    setCart(u.filter(c => c.qty > 0));
  };

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const cartTotal = cart.reduce((s, c) => s + (c.unitPrice != null ? c.unitPrice * c.qty : 0), 0);
  const cartHasUnpriced = cart.some(c => c.unitPrice == null);
  const phoneDigits = formData.phone.replace(/\D/g, "");
  const canSubmit = formData.name.trim().length > 0 && phoneDigits.length >= 9;

  const handleSubmit = () => {
    if (!canSubmit || orderSent) return;
    const items = cart.map(c => `- ${c.name} (${c.flavor}) x${c.qty}${c.unitPrice != null ? ` — R${c.unitPrice * c.qty}` : " — priced on collection"}`).join("%0A");
    const totalLine = cartHasUnpriced ? `Estimated total: R${cartTotal} + items priced on collection` : `Total: R${cartTotal}`;
    const msg = `Hello Kind Crumb!%0A%0AOrder:%0A${items}%0A${totalLine}%0A%0AName: ${formData.name}%0APhone: ${formData.phone}%0ADate needed: ${formData.date}%0ANotes: ${formData.notes}`;
    window.open(`https://wa.me/27689536500?text=${msg}`, "_blank");
    setOrderSent(true);
    setTimeout(() => {
      setCart([]);
      setFormData({ name: "", phone: "", date: "", notes: "" });
      setOrderSent(false);
      setDrawerOpen(false);
    }, 1800);
  };

  return (
    <>
      <style>{fonts}{css}</style>

      <div ref={thumbRef} className="scroll-thumb" />

      {/* ADD-TO-CART TOAST */}
      {toast && (
        <div className="cart-toast" role="status" aria-live="polite">
          <span className="cart-toast-text">Added <strong>{toast.name}</strong> — {toast.flavor}</span>
          <button className="cart-toast-btn" onClick={() => { setToast(null); setDrawerOpen(true); }}>View cart</button>
        </div>
      )}

      {/* CART DRAWER OVERLAY */}
      <div className={`drawer-overlay${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />

      {/* PRODUCT OVERLAY */}
      <div className={`product-overlay${overlay ? " open" : ""}${overlayClosing ? " closing" : ""}`} onClick={e => { if (e.target === e.currentTarget) closeOverlay(); }}>
        {overlay && (
          <div className="po-card" ref={overlayRef} role="dialog" aria-modal="true" aria-label={`${overlay.product.name} details`}>
            <div ref={poCardThumbRef} className="local-scroll-thumb" />
            <div className="po-img"><img src={`/images/${overlayImage(overlay)}`} alt={`${overlay.product.name} — ${overlay.flavor}`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} /></div>
            <div className="po-body" ref={poBodyRef}>
              <div ref={poBodyThumbRef} className="local-scroll-thumb" />
              <button className="po-close" onClick={closeOverlay} aria-label="Close"><X size={16} strokeWidth={1.5} /></button>
              <p className="po-tag">{overlay.product.tag}</p>
              <h2 className="po-name">{overlay.product.name}</h2>
              <p className="po-desc">{overlay.product.desc}</p>
              {overlay.product.flavorGroups ? (
                <>
                  <p className="po-flavor-label">Choose your flavour</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
                    {overlay.product.flavorGroups.map((g) => (
                      <div key={g.tier}>
                        <p className="po-flavor-sublabel">{g.label}</p>
                        <div className="flavor-grid" style={{ marginBottom: 0 }}>
                          {g.flavors.map((f) => (
                            <FlavorCard key={f.name} flavor={f} selected={overlay.flavor === f.name} onSelect={() => setOverlay(o => ({ ...o, flavor: f.name }))} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="po-flavor-label">Quantity</p>
                  <div className="po-flavors">
                    {overlay.product.quantities.map((q) => (
                      <button key={q.key} type="button" className={`po-flavor-pill${overlay.quantity === q.key ? " selected" : ""}`} aria-pressed={overlay.quantity === q.key} onClick={() => setOverlay(o => ({ ...o, quantity: q.key }))}>{q.label}</button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="po-flavor-label">Choose your flavour</p>
                  <div className="flavor-grid">
                    {overlay.product.flavors.map((f) => (
                      <FlavorCard key={f.name} flavor={f} selected={overlay.flavor === f.name} onSelect={() => setOverlay(o => ({ ...o, flavor: f.name }))} />
                    ))}
                  </div>
                </>
              )}
              <div className="po-order-row">
                <span className="po-price">{priceLabel(overlay)}</span>
                <button className="po-qty-btn" onClick={() => setOverlay(o => ({ ...o, qty: Math.max(1, o.qty - 1) }))} aria-label="Decrease quantity"><Minus size={12} strokeWidth={2} /></button>
                <span className="po-qty-val" aria-live="polite">{overlay.qty}</span>
                <button className="po-qty-btn" onClick={() => setOverlay(o => ({ ...o, qty: o.qty + 1 }))} aria-label="Increase quantity"><Plus size={12} strokeWidth={2} /></button>
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
      <div className={`drawer${drawerOpen ? " open" : ""}`} ref={drawerRef} role="dialog" aria-modal="true" aria-label="Your order" aria-hidden={!drawerOpen}>
        <div className="drawer-head">
          <h2 className="drawer-title">Your <em>order</em></h2>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close cart"><X size={20} strokeWidth={1.5} /></button>
        </div>
        <div className="drawer-body" ref={drawerBodyRef}>
          <div ref={drawerBodyThumbRef} className="local-scroll-thumb" />
          {orderSent ? (
            <div className="drawer-empty">
              <span className="drawer-sent-check"><Check size={28} strokeWidth={2} /></span>
              <p className="drawer-empty-text">Order sent!<br />Finish sending the message in WhatsApp — we'll reach out within 24 hours.</p>
            </div>
          ) : cart.length === 0 ? (
            <div className="drawer-empty">
              <ShoppingCart size={36} strokeWidth={1} className="drawer-empty-icon" />
              <p className="drawer-empty-text">Nothing here yet.<br />Pick something from the menu.</p>
              <button className="drawer-empty-cta" onClick={() => { setDrawerOpen(false); navigate("/#products"); }}>View Menu</button>
            </div>
          ) : (
            <>
              {cart.map((c, i) => (
                <div key={i} className="drawer-line">
                  <div className="drawer-line-info">
                    <p className="drawer-line-name">{c.name}</p>
                    <p className="drawer-line-flavor">{c.flavor}</p>
                    <p className="drawer-line-price">{c.unitPrice != null ? `R${c.unitPrice * c.qty}` : c.price}</p>
                  </div>
                  <div className="drawer-line-actions">
                    <button className="dqty-btn" onClick={() => updateCartQty(i, -1)} aria-label={`Decrease quantity of ${c.name}`}><Minus size={11} strokeWidth={2} /></button>
                    <span className="dqty-val" aria-live="polite">{c.qty}</span>
                    <button className="dqty-btn" onClick={() => updateCartQty(i, 1)} aria-label={`Increase quantity of ${c.name}`}><Plus size={11} strokeWidth={2} /></button>
                  </div>
                </div>
              ))}
              <div className="drawer-total-row">
                <span>{cartHasUnpriced ? "Estimated total" : "Total"}</span>
                <span>R{cartTotal}{cartHasUnpriced ? "+" : ""}</span>
              </div>
              {cartHasUnpriced && <p className="drawer-total-note">Some items are priced on collection and aren't included above.</p>}
              <div className="drawer-form-wrap">
                <h3 className="drawer-form-title">Your <em>details</em></h3>
                <div className="d-form">
                  <div className="d-form-group"><label className="d-label">Name *</label><input className="d-input" type="text" required aria-required="true" placeholder="Full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
                  <div className="d-form-group"><label className="d-label">Phone / WhatsApp *</label><input className="d-input" type="tel" required aria-required="true" placeholder="+27 000 000 0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>
                  <div className="d-form-group">
                    <label className="d-label">Date needed</label>
                    <input className="d-input" type="date" min={getMinOrderDate()} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                    <span className="d-hint">Orders need 24hrs notice · we bake 7:30am–5pm daily</span>
                  </div>
                  <div className="d-form-group"><label className="d-label">Notes</label><textarea className="d-textarea" placeholder="Vegan requirements, allergies, quantities…" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} /></div>
                </div>
                <p className="d-privacy">Your details are only used to prepare and confirm this order — never shared or sold.</p>
              </div>
            </>
          )}
        </div>
        {cart.length > 0 && !orderSent && (
          <div className="drawer-foot">
            <p className="drawer-note">{canSubmit ? "Pricing confirmed on collection. We'll reach out within 24 hours." : "Add your name and a valid phone number so we can reach you."}</p>
            <button className="drawer-wa-btn" onClick={handleSubmit} disabled={!canSubmit} aria-disabled={!canSubmit}><MessageCircle size={15} strokeWidth={1.5} />Send Order via WhatsApp</button>
            <a href="https://wa.me/27689536500" className="drawer-wa-alt" target="_blank" rel="noreferrer">Or message us directly <ArrowRight size={12} strokeWidth={1.5} /></a>
          </div>
        )}
      </div>

      {/* NAV */}
      <nav className={`nav${navScrolled ? " scrolled" : ""}`}>
        <div className="nav-left">
          <button className="nav-menu-btn" onClick={() => setSidebarOpen(true)} aria-expanded={sidebarOpen} aria-controls="nav-sidebar">
            <MenuIcon size={18} strokeWidth={1.5} /> <span>Menu</span>
          </button>
        </div>
        <Link to="/" className="nav-brand">
          <span className="nav-brand-name">Kind Crumb</span>
          <span className="nav-brand-sub">The Treat Table</span>
        </Link>
        <div className="nav-right">
          <a href="https://wa.me/27689536500" className="nav-wa" target="_blank" rel="noreferrer">
            <MessageCircle size={13} strokeWidth={1.5} /> Order Now
          </a>
          <button className="nav-cart-btn" onClick={() => setDrawerOpen(true)} aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}>
            <ShoppingCart size={19} strokeWidth={1.5} />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </button>
        </div>
      </nav>

      {/* NAV SIDEBAR */}
      <div className={`sidebar-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />
      <div id="nav-sidebar" className={`sidebar${sidebarOpen ? " open" : ""}`} ref={sidebarRef} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!sidebarOpen}>
        <div className="sidebar-head">
          <span className="sidebar-brand">Kind Crumb</span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={22} strokeWidth={1.5} /></button>
        </div>
        <ul className="sidebar-links">
          <li><Link to="/" onClick={() => setSidebarOpen(false)}>Menu</Link></li>
          <li><Link to="/story#about" onClick={() => setSidebarOpen(false)}>Our <em>Story</em></Link></li>
          <li><Link to="/story#testimonials" onClick={() => setSidebarOpen(false)}>Reviews</Link></li>
          <li><Link to="/story#blog" onClick={() => setSidebarOpen(false)}>Journal</Link></li>
        </ul>
      </div>

      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage openOverlay={openOverlay} />} />
        <Route path="/story" element={<StoryPage openOverlay={openOverlay} />} />
      </Routes>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <p className="footer-brand">Kind Crumb · The Treat Table</p>
          <p className="footer-tagline">Small-batch baking, made to order.<br />Ladysmith, KZN.</p>
        </div>
        <ul className="footer-links">
          <li><Link to="/">Menu</Link></li>
          <li><Link to="/story#about">Our Story</Link></li>
          <li><Link to="/story#testimonials">Reviews</Link></li>
          <li><Link to="/story#blog">Journal</Link></li>
        </ul>
        <div>
          <p className="footer-col-title">Get in touch</p>
          <ul className="footer-contact">
            <li><MapPin size={13} strokeWidth={1.5} /> Ladysmith, KwaZulu-Natal</li>
            <li><MessageCircle size={13} strokeWidth={1.5} /> <a href="https://wa.me/27689536500" target="_blank" rel="noreferrer">Order via WhatsApp — we reply within 24 hours</a></li>
            <li><Instagram size={13} strokeWidth={1.5} /> <a href="https://www.instagram.com/kind_crumb/" target="_blank" rel="noreferrer">@kind_crumb</a></li>
            <li><Clock size={13} strokeWidth={1.5} /> Orders taken 7:30am–5pm daily · 24hrs notice needed</li>
          </ul>
        </div>
        <p className="footer-bottom">© {new Date().getFullYear()} Kind Crumb. All rights reserved.</p>
      </footer>


      {/* BOTTOM TAB BAR */}
    </>
  );
}
function HomePage({ openOverlay }) {
  const tickerItems = ["Baked to order", "Pickup available", "Ladysmith", "Always eggless", "Small batch", "No artificial additives"];
  return (
    <>
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
            <Link to="/story#how" className="btn-ghost">How it works <ArrowDown size={13} strokeWidth={1.5} /></Link>
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

      {/* MENU INTRO — breathing room after the hero before the showcase starts */}
      <section id="products" className="menu-intro">
        <R>
          <p className="section-label">What we make</p>
          <h2 className="section-title">The <em>menu</em></h2>
        </R>
      </section>

      {/* MENU SHOWCASE — the entire menu, alternating rows, photo tinted with
          that product's matched color, text always visible */}
      {products.map((p, i) => (
        <ShowcaseRow key={p.name} product={p} reverse={i % 2 === 1} onOpen={openOverlay} />
      ))}
    </>
  );
}

function StoryPage({ openOverlay }) {
  return (
    <>
      {/* HOW IT WORKS */}
      <section id="how" className="how-section">
        <R>
          <p className="section-label">How it works</p>
          <h2 className="section-title">Three steps.<br /><em>That's it.</em></h2>
        </R>
        <div className="how-steps">
          {[
            { n: "01", icon: ShoppingBag, title: "Choose & add", desc: "Browse the menu, tap a flavour, set your quantity. Add directly from the card — no extra pages." },
            { n: "02", icon: MessageCircle, title: "Send your order", desc: "Your cart holds everything. Fill in your details and send directly to us on WhatsApp. We take orders 7:30am–5pm daily and need at least 24 hours notice." },
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
            <div className="weekly-img"><img src={`/images/${products[weeklyBake.productIdx].image}`} alt={weeklyBake.name.replace("\n", " ")} loading="lazy" width="600" height="600" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} /></div>
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

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="about-grid">
          <R className="about-img">
            <img src="/images/burfeecloseup.webp" alt="Close-up of a freshly baked Kind Crumb burfee mini cake, showing the frosting and texture" loading="lazy" width="600" height="600" />
          </R>
          <R d={1} className="about-body">
            <p className="section-label">{aboutStory.eyebrow}</p>
            <h2 className="section-title" style={{ marginBottom: "1.25rem" }}>Baked with <em>kindness</em>,<br />by hand, in Ladysmith.</h2>
            {aboutStory.paragraphs.map((p, i) => <p key={i} className="about-text">{p}</p>)}
            <p className="about-signoff">{aboutStory.signoff}</p>
          </R>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="testi-section">
        <R>
          <p className="section-label">What people say</p>
          <h2 className="section-title">Loved by <em>Ladysmith</em></h2>
        </R>
        <div className="testi-grid">
          {testimonials.map((tm, i) => (
            <R key={i} d={i + 1} className="testi-card">
              <Quote size={20} strokeWidth={1.5} className="testi-quote-icon" />
              <div className="testi-stars" aria-label={`${tm.stars} out of 5 stars`}>
                {Array.from({ length: tm.stars }).map((_, s) => <Star key={s} size={13} strokeWidth={1.5} fill="currentColor" />)}
              </div>
              <p className="testi-text">"{tm.text}"</p>
              <div className="testi-meta">
                <span className="testi-name">{tm.name}</span>
                <span className="testi-source">{tm.source}</span>
              </div>
            </R>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="gallery-section">
        <R className="gallery-header">
          <div>
            <p className="section-label">Follow along</p>
            <h2 className="section-title">From our <em>kitchen</em></h2>
          </div>
        </R>
        <R d={1}>
          <div className="gallery-grid">
            {["cinnamon-rolls", "redvelvet", "cookies", "milk-cake", "donuts", "carrotclosup"].map((img, i) => (
              <div key={i} className="gallery-item">
                <img src={`/images/${img}.webp`} alt={`Kind Crumb bake — ${img.replace(/[-.]/g, " ")}`} loading="lazy" width="300" height="300" />
              </div>
            ))}
          </div>
        </R>
        <R d={2} style={{ marginTop: "1.5rem" }}>
          <a href="https://www.instagram.com/kind_crumb/" className="gallery-ig-link" target="_blank" rel="noreferrer">
            <Instagram size={14} strokeWidth={1.5} /> See more of our bakes on Instagram
          </a>
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
    </>
  );
}

export default function KindCrumb() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
