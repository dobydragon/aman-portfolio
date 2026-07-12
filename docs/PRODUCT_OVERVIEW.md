# Aman — Product Overview

> **أمان** (Arabic for *safety / security*) — a multilingual community and support platform for refugees and newcomers.

## The problem

Arriving in a new country means facing a wall of language barriers, complex paperwork, social isolation, and fragmented services. The organizations that can help, the activities that welcome newcomers, the community that understands them, and the specialists who support them are scattered across disconnected channels — and rarely available in a language the newcomer actually reads.

## The solution

Aman brings the entire support ecosystem into **one platform**:

- **Organizations** that provide help and run programs
- **Activities & workshops** tailored to who a newcomer is (age, gender, camp, interests, language)
- **Community groups** with real-time chat, posts, polls, events and Q&A
- **Human support tracks** — psychological appointments, legal support, a rights information hub, the *Bakje Troost* camp comfort-visit program, and volunteering
- **A technical-support helpdesk** so no one is left stuck

Everything is delivered in **12 languages** (including full right-to-left support), on mobile and web, with real-time updates and graceful offline behavior.

## One platform, five apps

| # | App | Audience | Surface |
|---|-----|----------|---------|
| 1 | **Aman Mobile** | Refugees & newcomers | iOS · Android |
| 2 | **Organization App** | Organization admins & staff | iOS · Android |
| 3 | **Organization Web Dashboard** | Organization admins | Web |
| 4 | **Super-Admin App** | Platform operators & Aman Support | iOS · Android |
| 5 | **Super-Admin Web Dashboard** | Platform operators | Web |

All five share **one Firebase backend** and **one Flutter code core**, so business logic is written once and hosted natively across every surface.

## Who it's for

- **Refugees & newcomers** — the primary end users
- **Humanitarian organizations** — running activities, communities and support programs
- **Organization teams** — managers, admins, employees and view-only members, each with scoped permissions
- **Volunteers** — matched to needs by skill and language
- **Platform operators (super admins)** — managing many organizations, content and users across the whole platform

## What makes it stand out

- **Genuinely multilingual** — 12 languages with automatic server-side translation of dynamic content
- **Eligibility-aware** — activities are gated by age, gender, camp and profile so people only see what's right for them
- **Safe by design** — role-based access, moderation queues, append-only audit logs and account governance protect a vulnerable community
- **Real-time & resilient** — live Firestore streams plus an offline queue-and-retry layer
- **Data-driven** — KPI dashboards, engagement trends, leaderboards and auto-generated insights for operators

## Technical snapshot

- **Frontend:** Flutter (Material 3), `flutter_bloc` state management (~59 cubits), Dio networking with an offline queue
- **Backend:** Firebase — Cloud Firestore (60+ collections), Cloud Functions (Node 22 / TypeScript), Cloud Messaging, Cloud Storage, Authentication, Crashlytics, Cloud Translation, Hosting
- **Scale of the codebase:** 28 feature areas in the mobile app, four dashboard packages, 2,000+ lines of Firestore security rules, and a translation pipeline covering 2,700+ localized strings

See [FEATURES.md](FEATURES.md), [ARCHITECTURE.md](ARCHITECTURE.md), [TECH_STACK.md](TECH_STACK.md), [SECURITY.md](SECURITY.md) and [FIREBASE.md](FIREBASE.md) for detail.
