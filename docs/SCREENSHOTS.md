# Aman — Screenshots

The portfolio ships **80 real screenshots** captured from all five apps, optimized for the web (resized + JPEG) and organized by app under `assets/screenshots/`.

| App | Folder | Count | Source device |
|-----|--------|:-----:|---------------|
| Aman Mobile (refugee app) | `assets/screenshots/aman/` | 33 | iPhone 16 Plus |
| Organization App | `assets/screenshots/org-mobile/` | 11 | Android phone |
| Super-Admin App | `assets/screenshots/superadmin-mobile/` | 17 | iPhone 16 Plus |
| Organization Web Dashboard | `assets/screenshots/org-web/` | 6 | Desktop web |
| Super-Admin Web Dashboard | `assets/screenshots/superadmin-web/` | 13 | Desktop web |

## Naming convention

Files are sequentially numbered per app, e.g.:

```
aman/aman-01.jpg … aman-33.jpg
org-mobile/org-mobile-01.jpg … org-mobile-11.jpg
superadmin-mobile/sa-mobile-01.jpg … sa-mobile-17.jpg
org-web/org-web-01.jpg … org-web-06.jpg
superadmin-web/sa-web-01.jpg … sa-web-13.jpg
```

## In the portfolio

- The **Screenshots** section renders a responsive masonry gallery with per-app filter chips (All · Aman Mobile · Organization App · Org Dashboard · Super-Admin App · Super-Admin Web).
- Clicking any image opens a **lightbox** with keyboard navigation (`←` / `→` / `Esc`) and prev/next controls.
- The **hero** and section showcases use selected phone and browser mockups.

## Regenerating / re-optimizing

Originals live in the repo folder `portofolio aman/`. To re-optimize (macOS `sips`):

```bash
# phone screenshots → width 760, JPEG q80
sips -Z 760 -s format jpeg -s formatOptions 80 "input.png" --out "output.jpg"
# desktop screenshots → width 1500, JPEG q80
sips -Z 1500 -s format jpeg -s formatOptions 80 "input.png" --out "output.jpg"
```

Total optimized gallery weight: ~5.5 MB across all 80 images. To add screenshots, drop optimized files into the matching folder and bump the `count` for that group in `js/main.js` (`GROUPS` array).
