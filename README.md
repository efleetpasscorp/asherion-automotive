# Asherion Automotive

Marketing website for Asherion Automotive — a used-car dealership. Static, multi-page
site (no build step) modelled on the design language of the reference site
asherionautomotive.com.au: dark charcoal theme, red accent, Inter typography,
rounded white header, and a "Book Now" call-to-action.

## Pages

| File | Page |
|------|------|
| `index.html` | Home — hero, about teaser, rental collection, cars we sell, services, CTA |
| `about.html` | About Us — story, stats, values |
| `stock.html` | Our Stock — rental collection + cars for sale |
| `contact.html` | Contact Us — enquiry form, contact info, location |
| `styles.css` | Shared design system / styling |

> Copy and car images are placeholders by design — swap in real content and photos when ready.

## Deploying on Vercel

This is a plain static site, so no framework or build command is required.

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import this repository.
3. Leave the build settings empty (Framework Preset: **Other**) and click **Deploy**.

`vercel.json` enables clean URLs (`/about` instead of `/about.html`). Every push to the
default branch triggers an automatic redeploy.

## Custom domain

After the first deploy, attach `asherionauto.com.au` under
**Project → Settings → Domains** in Vercel.
