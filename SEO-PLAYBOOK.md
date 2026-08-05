# Kind Crumb — SEO Playbook (Local, Content, Off-Page)

Companion to the technical work already shipped on this branch (per-route
meta/canonical, hero image optimization, expanded FAQ schema). This doc is
the copy-paste-ready material for everything that happens *outside* the
codebase — your Google Business Profile, directories, reviews, and content.
See `/root/.claude/plans/buzzing-launching-wind.md` for the full reasoning
behind each piece if you want the "why," not just the "what."

**Full plan reference:** the SEO strategy plan this playbook implements is
saved at `/root/.claude/plans/buzzing-launching-wind.md` — kept there rather
than duplicated here since it's the working plan, not the launch artifact.

---

## 1. NAP — use this exact format everywhere

Every listing, directory, and profile below needs to match this **exactly**.
Inconsistent formatting (abbreviations, different phone formats) actively
hurts local ranking.

```
Business name : Kind Crumb: The Treat Table
Address       : Ladysmith, KwaZulu-Natal, South Africa
Phone         : +27 68 953 6500
Website       : https://kindcrumbtreats.co.za
```

---

## 2. Google Business Profile — optimization checklist

Your GBP already exists, so this is an audit list — go through it and fix
whatever's missing or stale:

- [ ] **Primary category:** Bakery
- [ ] **Secondary category:** Cake shop (also consider "Dessert shop" if
      GBP offers it in your region)
- [ ] **Business description** (paste this, ~650 characters, under the
      750-char limit):

  > Kind Crumb is a small-batch home bakery in Ladysmith, KwaZulu-Natal —
  > always eggless, always made fresh to order. We bake signature cinnamon
  > rolls, mini cakes, chunky cookies, Tres Leches milk cake, and weekly
  > donut bites, all in small batches with no pre-made stock. Perfect for
  > birthdays, celebrations, and anyone looking for genuinely eggless
  > desserts in Ladysmith. Orders are taken 7:30am–5pm daily and need at
  > least 24 hours notice — browse the menu and order directly on WhatsApp.

- [ ] **Service area:** Ladysmith + realistic surrounding towns you'll
      actually collect-serve (don't set a vague province-wide radius — it
      dilutes your relevance signal for "near me" searches)
- [ ] **Products** — add each of these as a GBP Product (name / price /
      photo). This is a direct local-pack ranking lever most competitors
      skip:
  - Cinnamon Rolls — From R25
  - Mini Cakes — From R42
  - Chunky Cookies — From R35
  - Tres Leches Milk Cake — From R350
  - Donut Bites — Coming soon (update price once set)
- [ ] **Primary action button:** set to your WhatsApp link
      (`https://wa.me/27689536500`), not a generic "website" link
- [ ] **Q&A section** — seed these yourself before a customer has to ask:
  - "Is everything eggless?" → "Yes, always — vegan options available on
    request."
  - "How do I order?" → "Browse the menu on our website and send your order
    via WhatsApp — link is on our profile."
  - "How much notice do you need?" → "At least 24 hours — we bake 7:30am to
    5pm daily."
- [ ] **Photos** — post **2x/week minimum** going forward. This is an
      ongoing habit, not a one-time setup step; posting frequency is a real
      ranking signal in 2026. Reuse whatever you're already shooting for
      Instagram.

---

## 3. Citation building — priority directory list (South Africa)

Best practice is 15–20 *quality* citations, not 100+ low-quality ones. Submit
to these in order — all use the exact NAP block from section 1:

1. Google Business Profile — done
2. Bing Places for Business
3. Brabys
4. SAYellow (SA Yellow Pages)
5. Hotfrog South Africa
6. Cylex South Africa
7. HelloPeter (also doubles as a review platform — see section 5)
8. Yalwa South Africa
9. ShowMe

**Listing copy to reuse across all of them** (trim to fit each site's
character limit):

> Small-batch home bakery in Ladysmith, KwaZulu-Natal. Always eggless,
> always made fresh to order — cinnamon rolls, mini cakes, Tres Leches milk
> cake, chunky cookies, and weekly donut bites. Order via WhatsApp.

Category, where asked: **Bakery** (secondary: Cake Shop / Dessert Shop).

---

## 4. Review generation

**Rule from Google's own guidelines: never incentivize reviews** (no
discounts/freebies in exchange) — risks a profile penalty. Ask, don't bribe.

**Timing:** send the request right after a positive interaction — order
pickup, a WhatsApp "thank you," anything that signals satisfaction. Waiting
days drops response rate sharply.

**WhatsApp message template** (get your direct review link from your GBP
dashboard → "Ask for reviews" → copy link, then swap it in below):

> Thank you so much for your order! 💛 If you enjoyed it, a quick Google
> review would really help other Ladysmith folks find us — here's the
> direct link: [your GBP review link]

Keep a copy of this saved as a WhatsApp quick-reply/canned message if your
WhatsApp Business app supports it, so it's one tap per order rather than
retyping.

---

## 5. Content roadmap (Journal — for when it's ready to fill in)

Per your call, Journal stays a "coming soon" stub for now. This is the
roadmap so it's ready to execute later without a fresh planning pass:

**Topic buckets:**
- Behind-the-scenes / founder story extensions
- Recipes (with full `Recipe` schema — see technical note below)
- Hyperlocal content: Ladysmith events, local ingredient sourcing, community
  involvement — specifically called out in bakery-SEO research as something
  most competitors skip entirely

**First 3 posts to write, in order:**
1. *"What Makes a Cake Eggless (and Why We Never Compromise)"* — explains
   the eggless commitment in depth; naturally targets "eggless cakes
   Ladysmith" search intent already seeded in the FAQ schema.
2. *"A Day Baking to Order in Ladysmith"* — behind-the-scenes, builds trust,
   easy to write since it's just describing an actual day.
3. A **recipe post** (Tres Leches or Cinnamon Rolls) with full `Recipe`
   schema markup — `prepTime`, `cookTime`, `recipeIngredient`,
   `recipeInstructions`. This is the single highest-leverage post type for
   organic recipe-search traffic.

**Cadence:** even 1 post/month sustained beats a burst-then-abandon pattern.
An active Journal is also free GBP-post material (repurpose each post as a
photo + link GBP post).

**Every time a post goes live (mechanical checklist, ask me to do this
part):**
- [ ] Add the post's URL to `public/sitemap.xml`
- [ ] Give it its own title/description via the same `useDocumentMeta`
      pattern already used for `/`, `/about`, `/journal`
- [ ] If it's a recipe post, add `Recipe` schema to its page

---

## 6. Off-page outreach

**Local food blogger / micro-influencer outreach template** (personalize
the bracketed parts — generic mass-outreach gets ignored):

> Hi [name] — I've been following your posts on [specific thing you liked
> about their content, be genuine]. I run Kind Crumb, a small eggless home
> bakery here in Ladysmith — always made fresh to order, no pre-made stock.
> I'd love to send you a box of [specific item] to try, no strings attached
> — if you like it and want to share, amazing, if not, no worries at all.
> Would that be something you're open to?

Target 3–5 **local** KZN accounts whose audience actually looks like your
customer base — a huge follower count with the wrong audience is worse than
a smaller, genuinely local one.

**Instagram cross-promotion:** `@kind_crumb` is already linked site-wide
(footer, gallery). Next step is content cadence on your end, not anything
further needed in code.

**Local press/community:** for a town Ladysmith's size, local Facebook
community groups and any community bulletin/local paper are higher-leverage
than generic link-building aimed at big-city audiences.

---

## 7. Measurement (via Search Console, since that's what you already use)

- **Sitemaps report** (Indexing → Sitemaps): confirm `sitemap.xml` shows
  "Success" once the site is public — resubmit if you add Journal post URLs
  later.
- **Coverage/Indexing report**: catches anything Google can't or won't
  index, and why.
- **Performance report**: the actual payoff — impressions/clicks per query,
  filterable per page. Needs a few weeks of live data before it's useful.
- **Core Web Vitals report** (in GSC, separate from PageSpeed Insights):
  real-user LCP/INP/CLS numbers once there's traffic.

---

## Launch-day checklist (do these together, in this order)

1. [ ] Check Vercel → Project → Settings → Deployment Protection — turn it
       **off for Production** (this is what's currently returning 403 to
       everything, including Googlebot)
2. [ ] Merge this branch to `main`
3. [ ] Confirm `https://kindcrumbtreats.co.za/` loads for a logged-out /
       incognito browser (proof the protection is actually off)
4. [ ] Search Console → Sitemaps → (re)submit `sitemap.xml`
5. [ ] Everything in sections 2–4 above (GBP checklist, citations, review
       template) can happen whenever — no dependency on launch day
