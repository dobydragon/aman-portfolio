# Aman — Deployment

This document covers two things: **(A)** deploying the marketing **portfolio site** (this folder), and **(B)** how the actual **Aman product** is deployed.

---

## A. Deploy the portfolio site

The portfolio is a static site — plain HTML, CSS, JS and images. No build step. Any static host works.

### Option 1 — GitHub Pages

```bash
# from the portfolio/ folder
git init
git add .
git commit -m "Aman portfolio"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Then in **Settings → Pages**, set **Source: Deploy from a branch**, **Branch: `main`**, **Folder: `/ (root)`**. The `.nojekyll` file is included so all assets serve correctly. Your site goes live at `https://<user>.github.io/<repo>/`.

> If you deploy from a subfolder of a larger repo, either move `portfolio/` to its own repo, push it to a `gh-pages` branch, or point Pages at `/portfolio`.

### Option 2 — Netlify

```bash
npm i -g netlify-cli
netlify deploy --dir=. --prod
```

Or drag-and-drop the `portfolio/` folder onto <https://app.netlify.com/drop>. No build command; publish directory is the folder root.

### Option 3 — Vercel

```bash
npm i -g vercel
vercel --prod
```

Framework preset: **Other**. Build command: *(none)*. Output directory: `.`.

### Option 4 — Firebase Hosting

```bash
firebase init hosting     # public dir: . ; single-page app: No
firebase deploy --only hosting
```

### After deploying

Update the absolute URLs in `index.html` (`og:url`, `og:image`, `canonical`), `robots.txt` and `sitemap.xml` from `https://example.com/` to your real domain for correct SEO and social previews.

---

## B. Deploy the Aman product

The product is a Flutter monorepo + Firebase backend (project `aman-fbefc`).

### Mobile apps (Flutter)

```bash
flutter pub get
flutter build appbundle          # Android (root aman app)
flutter build ios                # iOS

# Dashboards are separate binaries:
cd dashboard_phone && flutter build appbundle       # super-admin app
cd dashboard_organization && flutter build appbundle # organization app
```

> Before an iOS release archive, run `flutter clean` to avoid shipping stale simulator native assets, and switch `aps-environment` to `production`.

### Web dashboards

```bash
cd dashboard_web && flutter build web              # super-admin dashboard
cd dashboard_web_organization && flutter build web # organization dashboard
```

### Firebase (functions, rules, hosting)

The repo's `deploy-web.sh` and `firebase.json` orchestrate this. Manually:

```bash
# Cloud Functions (Node 22, TypeScript — predeploy runs `npm run build`)
firebase deploy --only functions

# Security rules & indexes
firebase deploy --only firestore:rules,firestore:indexes,storage

# Hosting (three sites)
firebase deploy --only hosting:dashboard,hosting:org-dashboard,hosting:assets
```

Hosting targets (`.firebaserc`):

| Target | Site | Content |
|--------|------|---------|
| `dashboard` | `aman-super-admin` | `dashboard_web/build/web` |
| `org-dashboard` | `aman-org-admin` | `dashboard_web_organization/build/web` |
| `assets` | `aman-fbefc` | `public/` |

### Seed & migrate

```bash
node scripts/seed_dashboard_auth.mjs        # super admins, org admins, roles, default orgs
node scripts/seed_refugee_locations.mjs     # cities & camps
node scripts/backfill_auto_translation.mjs  # translate existing content
```
