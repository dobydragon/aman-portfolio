# Aman — Firebase Backend

Firebase project: **`aman-fbefc`**. Firebase is Aman's entire backend — no separate server.

## Services in use

| Service | Role |
|---------|------|
| **Authentication** | Email/password identity, email verification; dashboard roles via custom claims |
| **Cloud Firestore** | Primary real-time datastore — 60+ collections |
| **Cloud Storage** | User media under `users/{userId}/…` |
| **Cloud Functions** | Node 22 / TypeScript — triggers, callables, one scheduled job (see [API_SUMMARY.md](API_SUMMARY.md)) |
| **Cloud Messaging (FCM)** | Multi-device push notifications |
| **Cloud Translation** | Server-side auto-translation of dynamic content |
| **Crashlytics** | Crash & error reporting (disabled in debug) |
| **Hosting** | Three sites (see below) |

> Notes: `firebase_app_check` is a declared dependency but is **not activated** in the client. There is **no Firebase Analytics or Remote Config** — operational metrics are computed from Firestore and charted with `fl_chart`.

## Hosting sites

| Target | Site | Serves |
|--------|------|--------|
| `assets` | `aman-fbefc` | `public/` (email assets, 1-year immutable cache) |
| `dashboard` | `aman-super-admin` | `dashboard_web/build/web` (SPA rewrite) |
| `org-dashboard` | `aman-org-admin` | `dashboard_web_organization/build/web` (SPA rewrite) |

## Firestore data model (main collections)

**Platform & orgs:** `organizations`, `organizationMembers`, `organizationAdmins`, `superadmin`, `aman_support_staff`, `dashboardRoles`, `platform_config`, `account_moderation_logs`

**Activities:** `activities`, `activityParticipationRequests`, `activityCategories`, `activityTypes`, `activityDateFilters`, `activity_reports` (+ `feedback`), `activity_evaluations` (+ `responses`)

**Community:** `communities` (+ `members`, `auditLogs`, `posts`→`comments`→`reactions`, `polls`→`votes`, `events`), `conversations` (+ `messages`, `typing`, `reads`), `qaQuestions` (+ `answers`, `comments`, `reactions`), `reports`

**Support tracks:** `psychological_specialists`, `psychological_specialist_requests`, `psychological_appointment_requests`, `psychological_private_chats` (+ `messages`), `rights_sections` / `rights_items`, `legal_support_sections` / `legal_support_items`, `support_faqs` / `support_urgent_actions`, `bakje_troost_visits`, `bakje_troost_participation_requests`, `bakje_troost_visit_reports` (+ `feedback`), `bakje_troost_evaluations` (+ `responses`), `bakje_troost_success_stories`, `volunteers`, `volunteer_requests`, `technical_support_tickets` (+ `replies`, `status_logs`)

**Catalog:** `registration_interests`, `registration_languages`, `cities`, `camps`, `home_partners`

**User subcollections** (`users/{uid}/…`): `notifications`, `fcmTokens`, `chatInbox`, `activityRequests`, `bakjeTroostRequests`, `psychological_specialist_request`, `volunteer_request`, `profile_change_requests`, `savedPosts`, `savedContent`, `joinedCommunities`, `technical_support_history`

## Composite indexes

`firestore.indexes.json` defines composite indexes for high-traffic queries on `conversations`, `qaQuestions` (×4), `posts` (incl. collection-group), `comments`, `reports` (×5 — status/community/organization variants), `home_partners`, `technical_support_tickets`, `notifications`, `savedContent`, `psychological_private_chats`, `psychological_appointment_requests` (×6), `registration_interests`, `registration_languages`, `cities`, `camps`, plus a `members.userId` collection-group override.

## Notifications architecture (two tiers)

1. **Inbox tier** — every notification is written to `users/{uid}/notifications/{id}` (drives the in-app list and unread badge)
2. **Push tier** — `onUserNotificationCreated` auto-converts each inbox doc into an FCM multicast push

- **Device tokens:** `users/{uid}/fcmTokens/{tokenDocId}` (multi-device); stale tokens pruned on `registration-token-not-registered`
- **Android channels:** `chat_messages` and `app_notifications` (both high importance)
- **~31 notification types**; deep links via `targetRoute`; client copy localized via ARB

## Seed & migration scripts

`scripts/` (firebase-admin, Node ESM) includes: `seed_dashboard_auth.mjs` (super admins, org admins, roles, default orgs), `seed_refugee_locations.mjs`, `migrate_localized_content.mjs`, `migrate_psychological_specialist_uids.mjs`, `backfill_auto_translation.mjs`, phased migrations and cleanup scripts.

See [SECURITY.md](SECURITY.md) for the rules model and [DEPLOYMENT.md](DEPLOYMENT.md) for deploying functions & hosting.
