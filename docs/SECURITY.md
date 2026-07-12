# Aman — Security & Governance

Aman protects a vulnerable community with a defense-in-depth model spanning authentication, **2,000+ lines of Firestore security rules** (`firestore.rules`), moderation, and account governance.

## Authentication & identity

- **Firebase Authentication** with email verification
- Dashboard staff identified via **custom claims**: `request.auth.token.role` ∈ { `super_admin`, `organization_admin`, `support_admin` }, with a legacy fallback reading `users/{uid}.role == 'superAdmin'`
- Helper `isDashboardStaff()` combines super-admin, org-admin and support-admin claims

## Firestore security rules — highlights

- **Default deny** — `match /{document=**} { allow read, write: if false; }` closes everything not explicitly opened
- **Role-based access** — community role hierarchy `owner > admin > moderator > member` (`memberRoleRank`, `isCommunityModerator`, `isCommunityAdmin`, `canModeratorUpdateMember`), mirrored server-side in `executeGroupAdminAction`
- **Notification integrity** (`canCreateInboxNotification`) — approval/moderation types require dashboard staff; community types require `actorId == auth.uid` and recipient ≠ actor; chat `message` type can only be created by a Cloud Function; payloads must be well-formed and start unread
- **Moderation writes** (`isModerationFieldChange`) — user-document moderation limited to `isBanned`, `isSuspended`, `suspensionEndDate`, `banReason`, `role`; muted/banned members blocked from posting/voting/messaging; frozen communities block writes
- **Append-only audit trails** — `account_moderation_logs` and community `auditLogs` allow no updates or deletes; message deletion is soft (`isDeleted: true, text: ""`)
- **Poll integrity** — vote deltas constrained to ±1 per option, sums non-decreasing, 2–10 options, immutable poll fields during a vote
- **Evaluations** — only accepted participants; rating an integer 1–5; review ≤ 1000 chars; aggregates (`averageRating`, `totalResponses`) writable by the server only
- **Private psychological chats** — access gated on an `accepted` appointment and canonical `{patientUid}_{specialistUid}` chat id

## Cloud Storage

- Authenticated read on objects; users may write only under their own `users/{userId}/…` prefix
- **CORS** limited to `GET`/`HEAD` with a 3600s max-age

## Moderation & community safety

- **Content & member reporting** across communities
- **Org-scoped moderation queues** — org admins act only on their organization's reports; super admins act platform-wide
- **Community governance** — freeze/unfreeze groups, set roles, remove members, delete or bulk-delete messages, warn owners — all role-gated and logged
- **Account governance** — ban, suspend (with end-date) and reactivate; blocked users routed to a dedicated screen

## Application-level protection

- **Access gates & validators** in `lib/core/services/` (participation write gates, evaluation gates, appointment access services) enforce eligibility before writes
- **Crashlytics** captures uncaught Flutter and platform errors in production (`FlutterError.onError` + `PlatformDispatcher.onError`), disabled in debug

## Privacy by design

- **User-generated content is never machine-translated** — posts, comments, chat and Q&A are excluded from auto-translation
- **Account deletion cascade** (`deleteUserFirestoreData`) anonymizes authored content to "Deleted User" and removes chats, appointments, tickets, memberships and Storage objects

## Operational notes (transparency)

The codebase documents its own hardening roadmap honestly:

- `firebase_app_check` is a declared dependency but **not yet activated** in the client
- Some admin-content collections currently rely on **dashboard-app gating** plus signed-in checks rather than fully staff-gated rules (custom-claim tightening is noted as the next step)
- iOS `aps-environment` is set to `development` and should be switched to `production` for release

These are the kinds of items a security review would flag before a production launch — surfaced here rather than hidden.
