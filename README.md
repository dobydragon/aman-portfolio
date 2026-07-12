# Aman — Portfolio Website

A premium, responsive portfolio / landing page that presents **Aman** — a multilingual community and support platform for refugees and newcomers — as a commercial SaaS product. Everything here is generated from a deep analysis of the actual Flutter + Firebase source code; **no features are invented**.

> **أمان** — Arabic for *safety*. One platform, five apps, twelve languages.

## What's inside

```
portfolio/
├── index.html            # Full single-page landing site
├── css/
│   └── styles.css        # Design system (brand palette from the app theme)
├── js/
│   └── main.js           # Theme toggle, reveal animations, counters,
│                         #   role tabs, FAQ, gallery + lightbox
├── assets/
│   └── screenshots/      # 80 optimized screenshots across 5 apps
│       ├── aman/            (33) refugee mobile app
│       ├── org-mobile/      (11) organization app
│       ├── superadmin-mobile/ (17) super-admin app
│       ├── org-web/         (6)  organization web dashboard
│       └── superadmin-web/  (13) super-admin web dashboard
├── icons/
│   └── favicon.svg
├── docs/                 # Product & engineering documentation
│   ├── PRODUCT_OVERVIEW.md
│   ├── FEATURES.md
│   ├── TECH_STACK.md
│   ├── ARCHITECTURE.md
│   ├── API_SUMMARY.md
│   ├── FIREBASE.md
│   ├── USER_ROLES.md
│   ├── SECURITY.md
│   ├── DEPLOYMENT.md
│   └── SCREENSHOTS.md
├── robots.txt            # SEO
├── sitemap.xml           # SEO
└── .nojekyll             # GitHub Pages: serve all assets as-is
```

## Sections

Hero · Trust marquee · Stats · About · Why choose us · Features · Workflow · User types · Architecture · Technology stack · Security · Localization · Notifications & analytics · Screenshots gallery · Admin dashboard · Mobile app · FAQ · Pricing · Contact · Footer.

## Design

- **Brand palette extracted from the app** (`lib/theme/theme_helper.dart`): primary `#3525CD`, indigo `#4F46E5`, mint accent `#6FFBBE`, teal `#006C49`, amber `#F59E0B`.
- **Typography:** Inter (the app's own typeface).
- **Light & dark themes** with a toggle (respects system preference, persists choice).
- **Responsive** from ultra-wide monitors to phones.
- **Accessible & fast** — semantic HTML, lazy-loaded images, `prefers-reduced-motion` respected, no heavy frameworks (vanilla JS/CSS).

## Run locally

It's static — just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy

Works on **GitHub Pages, Netlify, Vercel and Firebase Hosting** — see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). After deploying, replace the placeholder `https://example.com/` URLs in `index.html`, `robots.txt` and `sitemap.xml` with your real domain.

## SEO

Meta description & keywords, Open Graph + Twitter cards, JSON-LD `SoftwareApplication` structured data, `robots.txt`, `sitemap.xml` and an SVG favicon are all included.

---

*Built as a portfolio artifact for the Aman platform. Product © its owners; portfolio content derived from the repository source.*
