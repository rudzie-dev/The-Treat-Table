# The Treat Table

Home bakery website — handcrafted bakes, made to order. Always vegetarian, vegan on request. Pickup from our Ladysmith kitchen.

---

## Getting started

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Install & run

```bash
# Install dependencies
npm install

# Start dev server (opens at http://localhost:3000)
npm start

# Build for production
npm run build
```

---

## Adding your photos

All product and kitchen photos drop into `/public/images/`. Once you have a file there, update the `img` field in the `MENU` array inside `src/App.jsx`:

```js
// Before (placeholder emoji shown)
{ id: 1, img: null, name: "Country sourdough", ... }

// After (your real photo)
{ id: 1, img: "/images/sourdough.jpg", name: "Country sourdough", ... }
```

### Photo recommendations

| Image | File | Ideal size | Notes |
|---|---|---|---|
| Sourdough | `sourdough.jpg` | 800×600px | Dark board, side-lit |
| Croissant | `croissant.jpg` | 800×600px | Moody, close-up |
| Focaccia | `focaccia.jpg` | 800×600px | Top-down works great |
| Lemon tart | `lemon-tart.jpg` | 800×600px | Slice visible |
| Bostock | `bostock.jpg` | 800×600px | Ganache glistening |
| Kitchen | `kitchen.jpg` | 900×1200px | Portrait, warm light |

**Tips:**
- Natural window light from the side, no flash
- Dark chopping board or slate surface for contrast
- iPhone camera is perfectly fine — shoot in Portrait mode
- Edit in Lightroom/Snapseed: bump shadows, warm the whites slightly

---

## Customising content

### Update the weekly menu
Edit the `MENU` array in `src/App.jsx`. Each item supports:
- `name`, `desc` — product name and description
- `basePrice` — base price in Rands (`null` for "Ask")
- `variants` — array of `{ id, label, priceAdd }` options
- `canVegan` — whether a vegan version is available
- `veganNote` — honest note about what changes for vegan
- `img` — path to image in `/public/images/`

### Update pickup info
Search for `"Ladysmith"` in `src/App.jsx` — update the location details, pickup days, and slot times.

### Update journal posts
Edit the `POSTS` array in `src/App.jsx`.

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | React 18 (Create React App) |
| Fonts | Google Fonts — Caveat, Lora, DM Sans |
| Styling | Plain CSS-in-JS (no extra dependencies) |
| Hosting | Deploy to Vercel, Netlify, or any static host |

### Deploying to Vercel (recommended, free)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Every push to your repo auto-deploys.

---

## Folder structure

```
jour-de-boulange/
├── public/
│   ├── index.html
│   └── images/          ← Drop your photos here
│       ├── sourdough.jpg
│       ├── croissant.jpg
│       └── kitchen.jpg
├── src/
│   ├── App.jsx          ← Everything lives here
│   └── index.js
├── package.json
└── README.md
```

---

## Next steps (planned)

- [ ] Order form with email confirmation (Resend)
- [ ] Weekly menu CMS (Sanity) — update menu without touching code
- [ ] Pickup slot booking with cutoff logic
- [ ] About / story page
- [ ] Individual blog post pages

---

Built with ♥ for The Treat Table, Ladysmith KZN.
