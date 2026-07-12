# Aman — API & Cloud Functions Summary

Aman's "API" is primarily **Cloud Firestore** (real-time reads/writes governed by security rules) plus a set of **Cloud Functions** — some triggered by Firestore events, some callable, and one scheduled. All functions live in `functions/src/` (Node 22, TypeScript) with `setGlobalOptions({ maxInstances: 10 })`.

## Notification & messaging functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `onUserNotificationCreated` | Firestore `onCreate` `users/{uid}/notifications/{id}` | Unified router — converts any inbox notification into an FCM multicast push (skips `message` type to avoid duplicates) |
| `onChatMessageCreated` | Firestore `onCreate` `conversations/{cid}/messages/{mid}` | Resolves recipients (group members or direct participants), increments unread counts, writes inbox docs and sends push directly |
| `onPsychPrivateChatMessageCreated` | Firestore `onCreate` `psychological_private_chats/{chatId}/messages/{mid}` | Delivers private psychological-chat messages; requires an accepted appointment and canonical `{patientUid}_{specialistUid}` chat id |

## Scheduled functions

| Function | Schedule | Purpose |
|----------|----------|---------|
| `processActivityReminders` | **every 5 minutes** (UTC) | Notifies accepted participants of upcoming activities within the reminder window; idempotent via `reminderSentAt` |
| `onActivityReminderScheduleChanged` | Firestore `onUpdate` `activities/{id}` | Clears `reminderSentAt` when start time or reminder offset changes so reminders re-fire |

## Broadcast functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `onRegistrationInterestCreated` / `onRegistrationInterestUpdated` | Firestore `onCreate` / `onUpdate` `registration_interests/{id}` | Broadcasts a `new_registration_interest` notification to all users (paginated fan-out) when published |

## Callable functions

| Function | Purpose |
|----------|---------|
| `submitActivityEvaluationResponse` | Validates & records an activity evaluation (rating 1–5, review ≤1000 chars, accepted participant, evaluation open) |
| `submitBakjeTroostEvaluationResponse` | Same for Bakje Troost visit evaluations (also requires the visit to have ended) |
| `executeGroupAdminAction` | Role-gated community actions: freeze/unfreeze, hard-delete (super-admin only), set-role, remove-member, delete-message, bulk-delete; writes audit logs |
| `deleteUserAccount` | Self-delete or super-admin delete of a user (Storage + Firestore + Auth) |
| `assignOrganizationGroupAdmin` | *Placeholder — currently throws `unimplemented`* |

## Aggregation functions

| Function | Trigger | Purpose |
|----------|---------|---------|
| `onEvaluationResponseWritten` | Firestore write `activity_evaluations/{aid}/responses/{uid}` | Recomputes `averageRating` and `totalResponses` |
| `onBakjeEvaluationResponseWritten` | Firestore write `bakje_troost_evaluations/{id}/responses/{uid}` | Same for Bakje Troost evaluations |
| `deleteUserFirestoreData` | (invoked during account deletion) | Cascades: anonymizes authored content, deletes chats/appointments/tickets, removes memberships, cleans Storage |

## Auto-translation functions

`functions/src/auto_translation/` exports **28 `onDocumentWritten` triggers** (one per registered collection/subcollection), e.g. `onAutoTranslate_activities`, `onAutoTranslate_organizations`, `onAutoTranslate_communities`, `onAutoTranslate_communities_events`, `onAutoTranslate_communities_polls`, `onAutoTranslate_rights_sections`, `onAutoTranslate_legal_support_*`, `onAutoTranslate_cities`, `onAutoTranslate_camps`, `onAutoTranslate_volunteers`, `onAutoTranslate_psychological_specialists`, `onAutoTranslate_platform_config`, and more.

**Behavior:** admins write English; each trigger translates to the other 11 languages via the Google Cloud Translation API, storing locale-keyed maps. Guards — an English-fields fingerprint plus `_translationMeta` prevent re-translation loops; a per-document `autoTranslate: false` flag skips translation; `SKIP_FIELD_NAMES` protects IDs, URLs and enum values. **User-generated content (posts, comments, chat, Q&A) is deliberately excluded.**

## Firestore as an API

Clients read and write Firestore directly (subject to security rules), using real-time streams for chat, feeds, polls, events, notifications and unread badges. See [FIREBASE.md](FIREBASE.md) for the collection model and [SECURITY.md](SECURITY.md) for how access is enforced.
