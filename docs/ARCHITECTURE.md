# Aman — Architecture

Aman is a **layered Flutter monorepo**: business logic is written once in a shared core and hosted natively across five apps on one Firebase backend.

## Package dependency graph

```
aman (root: refugee mobile app + shared Firestore services, models, cubits)
 ├── dashboard_organization  → aman              (org admin logic + UI; phone binary)
 │     └── dashboard_web_organization → dashboard_organization, aman   (org web host)
 └── dashboard_phone         → aman, dashboard_organization            (super-admin + support; phone binary)
       └── dashboard_web      → dashboard_phone, dashboard_organization, aman  (super-admin web host)
```

- **`aman`** is both the refugee mobile app **and** the shared library every dashboard imports (Firebase services, models, cubits, network layer, localization).
- **`dashboard_organization`** and **`dashboard_phone`** hold the real dashboard business logic.
- **`dashboard_web`** and **`dashboard_web_organization`** are thin GoRouter web hosts that re-render the shared screens/cubits with adaptive web layout — mobile `DashboardNavigator` calls are bridged to GoRouter.

## Layers

```
┌───────────────────────────────────────────────────────────────┐
│  Presentation   Screens · widgets · adaptive layout            │
├───────────────────────────────────────────────────────────────┤
│  State          flutter_bloc — ~59 Cubits (feature-scoped)     │
├───────────────────────────────────────────────────────────────┤
│  Domain/logic   Services, permission gates, ranking, validators│
├───────────────────────────────────────────────────────────────┤
│  Data           Entities + *_firestore_mapper + repositories   │
├───────────────────────────────────────────────────────────────┤
│  Infrastructure Firebase services · Dio · offline queue · cache│
└───────────────────────────────────────────────────────────────┘
```

### Presentation
- Feature-first layout: `lib/features/<feature>/{presentation, cubit, models, ...}`
- Material 3 theming (`lib/theme/`), `Sizer` + a custom `Adaptive` sizing layer, MediaQuery text scale locked to 1.0, portrait-only on mobile
- Responsive web dashboards with content bounding (`DashboardContentBounds`)

### State management
- `flutter_bloc` **Cubits**, one or more per feature (~59 total)
- App-wide providers wired in `lib/app.dart`: `NetworkCubit`, `LocaleCubit`, `AuthCubit`, `ForgotPasswordCubit`, `NotificationUnreadCubit`, `SavedContentSyncCubit`

### Domain / logic services
Located in `lib/core/services/` — pure logic separated from UI, e.g.:
- Eligibility & access gates (`activity_evaluation_gate`, `participation_write_gate`, `psychological_appointment_access_service`)
- Ranking & recommendation (`activity_match_ranking`, `activity_recommendation_explanation`)
- Community rules (`community_group_permissions`, `community_poll_vote_logic`)
- Notification copy (`approval_notification_templates`, `community_notification_copy`)

### Data
- Entities extend `Equatable`; each has a paired `*_firestore_mapper.dart` and often a `*_document_schema.dart` of field-name constants
- Firebase data services grouped under `lib/core/firebase/` (auth, firestore, functions, messaging, storage, crashlytics)

### Infrastructure
- **Network layer** (`lib/core/network/`) — `NetworkManager`, `network_request_queue`, `network_offline_cache`, plus UI: connection overlays, reconnect indicators, retry buttons, weak-connection banners
- **Cache** — `SharedPreferences` wrapper (`cache_helper.dart`)

## Routing

- **Mobile:** imperative named routes (`lib/route/app_routes.dart`) via `MaterialApp.routes` + `onGenerateRoute` for argument-carrying routes; a global `appNavigatorKey` enables navigation without context (used by push notifications)
- **Web dashboards:** `go_router` with refresh streams and route bridges from the shared mobile navigator

## Backend

```
Client apps ──► Cloud Firestore (real-time streams)
                     │
                     ├─► Firestore triggers ─► Cloud Functions (Node 22 / TS)
                     │        • notification router (inbox → FCM push)
                     │        • chat & psych-chat fan-out
                     │        • evaluation aggregation
                     │        • auto-translation (28 triggers)
                     │        • moderation / account deletion
                     │
                     └─► scheduled function (every 5 min) ─► activity reminders
Cloud Storage ◄──── media uploads (users/{uid}/…)
Cloud Messaging ◄── multi-device push
```

## Cross-cutting concerns

- **Localization:** ARB files (12 languages) per package + `intl_utils` generation; runtime language switching via `LocaleCubit`; RTL font selection; Firestore content localization binder
- **Security:** 2,000+ lines of Firestore rules, role-based access (custom claims + community role hierarchy), default-deny
- **Sessions:** layered `SuperAdminSession › OrganizationAdminSession › AmanSupportSession › LegacyAdminSession`; `OrganizationContext.openedBySuperAdmin` lets a super admin act on any org

## Design principles

1. **Write logic once** — shared core imported by every app
2. **Thin web hosts** — dashboards reuse mobile screens/cubits, adding only web routing
3. **Feature-first** — each feature owns its presentation, state, models and services
4. **Offline-first resilience** — queue, retry and recover
5. **Localize everything** — UI strings and dynamic content alike
