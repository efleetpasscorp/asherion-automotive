# Asherion Automotive

Marketing website for Asherion Automotive — a used-car dealership. Built with
**Next.js 16** (App Router), React 19, and TypeScript. Dark charcoal theme, red accent,
Inter typography, rounded white header, and a "Book Now" call-to-action.

## Pages

| Route | Page |
|-------|------|
| `/` | Home — hero, about teaser, rental collection, cars we sell, services, CTA |
| `/about` | About Us — story, stats, values |
| `/stock` | Our Stock — rental collection + cars for sale |
| `/contact` | Contact Us — enquiry form, contact info, location |

## Structure

- `app/` — routes, root layout, and global styles (`globals.css`)
- `components/` — shared UI (`site-header`, `site-footer`, `car-card`, `cta-band`, `contact-form`, `icons`)
- `lib/cars.ts` — vehicle data for the rental and sale grids
- `public/images/` — vehicle and showroom imagery

## Development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Build

```bash
pnpm build
pnpm start
```

## Deploying on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import this repository.
2. Vercel auto-detects Next.js — leave the defaults and click **Deploy**.
3. Attach a custom domain under **Project → Settings → Domains**.
