# Aman — Features

Every capability below is present in the source code. The mobile app alone is organized into **28 feature areas** (`lib/features/`).

## Onboarding & identity

- **Splash & onboarding** flow introducing the platform
- **Authentication** — Firebase Auth login, registration, email verification and forgot-password
- **Interest selection** — pick topics that shape recommendations
- **Refugee registration** — camp and city selection from a managed catalog
- **Registration catalog** — localized interests and languages
- **User profile** — view/edit profile, profile completion, and an **admin-approved profile-change request** workflow
- **Account management** — account states (active / suspended / banned) with a dedicated blocked-account screen

## Home & discovery

- **Home feed** — upcoming activities + partner organizations
- **Home partners** — featured partner organizations
- **Organization profiles** — browse refugee-support organizations and their detail pages

## Activities & workshops

- Browse and **filter** activities by date, type and category
- **Eligibility gating** — activities restricted by age range, gender audience (everyone / women-only / men-only / youth / children / families), allowed camps and profile completeness
- **Participation requests** and **waiting lists**
- **Reminders** — configurable minutes-before-start, delivered by a scheduled Cloud Function
- **Activity evaluations** — post-event rating (1–5) and review, with admin review and server-computed averages
- **Activity reports** — a reports feed with detail views and feedback

## Community (the richest module)

- **Groups** — join/leave, group types, featured groups, frozen-group handling
- **Real-time group chat** with message receipts and an offline pending-message queue
- **Posts** — text + images, anonymous option, pinning, 8 reaction types (like, love, fire, laugh, brilliant, support, sad, angry), comments, shares, saving
- **Polls** — server-validated voting with tallying
- **Events** — community events with broadcast notifications
- **General Q&A** — ask questions, answers, best-answer marking
- **Media gallery** — images and video
- **Search** — with recent-search history
- **Saved content** — synced across sessions
- **Moderation** — report content and members; queues for admins

## Support tracks

- **Psychological support** — request appointments with verified specialists; a private, gated one-to-one chat opens once accepted
- **Legal support** — structured, localized legal-support sections and items
- **Rights hub** — localized rights information with sections and items
- **Bakje Troost** — camp comfort-visit program: visits, visit reports, success stories and participation requests (plus its own evaluations)
- **Volunteers** — volunteer directory and requests, matched by skill and language
- **Support center & help hub** — FAQs, urgent actions and platform settings
- **Technical support** — full ticketing: tickets, replies, status logs and history

## Notifications

- **Two-tier system** — a Firestore inbox (single source of truth for the badge and list) + automatic FCM push conversion
- **~31 notification types** across community, Q&A, approvals, activity lifecycle, groups/broadcast, platform, moderation, chat, psychological appointments and technical support
- **Deep links** straight to the relevant screen
- **Scheduled activity reminders** (every-5-minute cron)
- Foreground, background and terminated-state handling on both platforms

## Organization dashboard features

- **Activity management** — create, edit, hide/show, delete; manage categories, types and date-filter presets
- **Participation** — review requests and waiting lists with applicant profile snapshots
- **Moderation queue** — org-scoped live report queue with delete / dismiss / warn-owner actions
- **Team management** — add/update/remove admins and members with role assignment
- **Communities & profile community** management
- **Bakje Troost** visit scheduling, reports, success stories and requests
- **Read-only mode** for view-only members

## Super-admin platform features

- **Organizations & organization admins** — full CRUD, deactivate/reactivate
- **Platform analytics** — KPI cards (growth %, trend), daily/weekly/monthly/yearly time series, engagement leaderboards and auto-generated insight cards
- **Content management** — rights, legal support, psychology FAQs, psychological specialists, volunteers, home partners, support/platform groups, registration interests and languages, profile community
- **Users & moderation** — user management, moderation logs, account governance
- **Technical-support helpdesk** — ticket management with metrics, filtering and assignment
- **Platform tools** — one-click seeders for default communities, registration interests and refugee locations
- **Cross-org access** — open any organization's workspace with elevated context

## Platform-wide qualities

- **12-language localization** with RTL and automatic content translation
- **Offline support** — connectivity detection, request queue, retries and reconnect indicators
- **Real-time** everywhere via Firestore streams
- **Rich media** — image upload (13+ storage services), cached network images, SVG and video
- **Crashlytics** stability monitoring in production
- **Material 3** theming with adaptive sizing and locked text scaling
