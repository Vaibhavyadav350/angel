# Home Page — Section-by-Section Plan

No code has been changed. This is the proposal to review first.

Mobile is treated as the primary case throughout, per the brief. The existing
mobile layout works; the aim is to keep that and raise it, not to rebuild it.

---

## The principle behind every change

The horizontal auto-scroll was solving a genuine problem: without it nobody
realised there was more content off the right edge. Removing it without
replacing that signal would make things worse.

So the replacement is **peek** — size the cards so the next one is visibly cut
off at the screen edge. A half-visible card is the clearest possible "there is
more this way", it works identically on touch and desktop, and it never moves.
Add arrows on pointer devices and a thin progress rule on touch, and the shopper
is in control of a rail that no longer animates by itself.

That single pattern replaces both auto-scrollers.

---

## 1. Hero — keep

**Now:** three slides, 6s autoplay, `loading="eager"`.

**Change:** almost nothing. It is the strongest section.

- Add `fetchpriority="high"` and explicit `width`/`height` to the first slide —
  it is the Largest Contentful Paint element and currently has no priority hint.
- Pause the 6s timer when the tab is hidden, and when the visitor prefers
  reduced motion.
- Mobile: reduce the headline from three lines to two so the CTA sits above the
  fold on a 360px-wide phone.

**Risk:** very low.

---

## 2. Circular Categories — replace

**Now:** eight small circles labelled A-LINE, FISHTAIL, BANARASI, SILK, VELVET,
GEORGETTE, NET, ORGANZA, in a horizontally scrolling strip.

**Problem:** these are fabric and silhouette names, but the catalogue is not
organised by fabric — so the labels promise a way of shopping the site cannot
deliver. Eight small circles is also the least luxurious device on the page;
it reads as a marketplace app, not a fashion house.

**Proposal:** replace with **four editorial category tiles** drawn from the real
taxonomy — Lehengas, Sarees, Salwar Kameez, Menswear. Tall portrait crops, the
name set in the editorial serif over the base of the image, one line of context
beneath.

- **Desktop:** four across, full width, no scrolling.
- **Mobile:** two across, square crops. No scroll at all — everything visible.

**Copy suggestion** (an eyebrow above the row):

> *Four houses of craft, one archive.*

**Risk:** low. Needs four good portrait images.

---

## 3. Category Showcase — remove the auto-scroll

**Now:** `AutoCarousel` runs an infinite `requestAnimationFrame` loop that
ping-pongs `scrollLeft` at 0.7px per frame — it slides right, hits the end, then
reverses. It runs every frame whether or not the section is on screen, and the
`isHovered` dependency tears the loop down and rebuilds it on every mouse
enter/leave.

**Problem:** the reversal is what makes it feel broken rather than designed. It
also fights anyone trying to scroll it themselves.

**Proposal:** two options, and I would take the first.

**Option A — static asymmetric grid (recommended).** Per category, one large
feature tile beside two smaller ones. No scrolling, no motion, everything
visible at once. This is the most "quiet luxury" of the options and removes the
rAF loop entirely.

**Option B — the shared rail.** Keep it horizontal but with peek + arrows +
progress, no autoplay. Choose this if the number of sub-categories is likely to
grow.

- **Mobile:** Option A becomes a two-column grid; Option B keeps the peek.

**Risk:** medium — this is the largest section (274 lines).

---

## 4. Occasions Strip — simplify

**Now:** four occasions in an accordion, with the labels set in `-rotate-90`
vertical text.

**Problem:** rotated text is hard to read and reads as an effect rather than a
decision. The accordion hides three of the four options at any moment, on a row
that should be scannable in one glance.

**Proposal:** a **four-up row of full-height portrait images**, label and
one-line subtitle at the base of each, no accordion and no rotation. Hover lifts
the image very slightly and reveals the link underline.

- **Mobile:** two-up grid, or a peek rail if the images are tall.

**Copy suggestion** (section eyebrow):

> *Dressed for the occasion — every occasion.*

**Risk:** low.

---

## 5. Customer Diaries — decide first

**Now:** four horizontally scrolling cards with an animated `→` that looks like
a control but is not one.

**The real problem is not the layout — the content is invented.** The names,
quotes and photographs are placeholders. Showing fabricated reviews as genuine
customers is misleading, and in Australia it risks breaching consumer law.

**Proposal — pick one:**

- **A. Hide the section** until real reviews exist. Cleanest, honest, and the
  home page loses nothing structurally.
- **B. Keep the layout, change the framing** to something truthful that is not a
  testimonial — e.g. "From the Studio", presenting the same photography as
  campaign imagery rather than as customer quotes.
- **C. Rebuild as real reviews** once the client supplies them, using the shared
  rail with arrows.

I would take **A** now and **C** later. **B** is a reasonable middle path if the
page feels empty without it.

**Risk:** none technically; this is a content decision.

---

## 6. Shop by Category — declutter

**Now:** nine arch cards, three across on mobile, five on desktop, over a
decorative background word set at `25vw` and 3% opacity.

**Problem:** five arches per row is too dense to feel considered, and the giant
background word is noise. Nine tiles also duplicate what section 2 and the
navigation already offer.

**Proposal:**

- Remove the background word entirely.
- Reduce to **six tiles**, three across on desktop, two on mobile.
- Keep the arch — it is a genuine signature and worth protecting.
- Increase the gap and let the arches be taller.

**Risk:** low.

---

## 7. Trust bar — rename, and decide on the newsletter

**Now:** the component is called `TrustNewsletter` but renders only the trust
bar. There is no newsletter signup anywhere on the site, which is why the admin
Newsletter screen can never have subscribers.

**Proposal:**

- Rename the component to `TrustBar` so it stops implying something it does not do.
- Decide separately whether a signup returns. If yes, the working form still
  exists in git history and can be restored into the footer.
- Mobile: the four trust items currently wrap two-by-two, which is fine; give
  them a little more vertical padding.

**Risk:** none.

---

## Global — applies to every section

These matter more than any individual section.

1. **`prefers-reduced-motion` is not honoured anywhere in the codebase.** Every
   transition, the hero autoplay and any rail scrolling should respect it.
2. **No image on the home page declares width/height**, so each one can shift
   the layout as it loads. Reserving space fixes the visible "jump" on a slow
   phone connection — the single biggest perceived-quality win on mobile.
3. **Everything below the hero should be `loading="lazy"`.**
4. **Section rhythm:** standardise vertical padding to one scale
   (`py-16 sm:py-24 lg:py-32`). It currently varies per section, which is why
   the page feels slightly uneven as you scroll.
5. **Touch targets:** confirm every tappable element is at least 44px.

---

## Suggested order

| Step | Work | Why first |
|---|---|---|
| 1 | Global: reduced-motion, image dimensions, lazy-loading, spacing scale | Biggest mobile gain, touches no layout |
| 2 | Remove both auto-scrollers (sections 3, 5) | The main reason the page reads as basic |
| 3 | Circular Categories → four editorial tiles | Weakest section, highest visible lift |
| 4 | Occasions Strip and Shop by Category declutter | Polish |
| 5 | Trust bar rename + newsletter decision | Tidy-up |

Steps 1 and 2 alone would carry most of the improvement.

---

## What I need from you

1. **Section 3** — Option A (static grid) or Option B (rail)?
2. **Section 5** — hide it, reframe it, or keep placeholders for now?
3. **Copy** — are the two suggested lines in the right voice, or should the
   client write them?
4. Confirm there are **four good portrait images** available for section 2.

`frontend/src/components/home/Rail.js` exists as a reference implementation of
the shared rail described above. It is not imported anywhere and changes nothing
until wired in.
