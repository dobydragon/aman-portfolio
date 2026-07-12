# Aman — Technology Stack

Everything below is declared in the project's `pubspec.yaml` files and `functions/package.json` — nothing is aspirational.

## Frontend (Flutter / Dart)

| Technology | Package | Purpose |
|-----------|---------|---------|
| **Flutter** | `flutter` (SDK ^3.11.5) | Cross-platform UI for iOS, Android, web, macOS, Windows, Linux |
| **Bloc / Cubit** | `flutter_bloc ^8.1.6` | State management (~59 cubits) |
| **Equatable** | `equatable ^2.0.5` | Value equality for states & entities |
| **Dio** | `dio ^5.9.0` | HTTP networking |
| **Connectivity** | `connectivity_plus ^7.1.1`, `internet_connection_checker_plus ^2.9.1` | Offline detection & recovery |
| **Charts** | `fl_chart ^1.0.0` | Dashboard analytics & charts |
| **Localization** | `flutter_localizations`, `intl ^0.20.2`, `intl_utils ^2.8.14` | 12-language i18n |
| **Images** | `cached_network_image ^3.4.1`, `flutter_svg ^2.0.12`, `image_picker ^1.2.2` | Media loading, SVG, uploads |
| **Video** | `video_player ^2.10.0` | Community media playback |
| **Phone input** | `intl_phone_field ^3.2.0` | International phone entry |
| **Local storage** | `shared_preferences ^2.3.3` | Locale, cache, preferences |
| **UI utilities** | `gradient_borders ^1.0.2`, `fluttertoast ^9.0.0`, `url_launcher ^6.3.1`, `universal_html ^2.2.4` | Styling & platform helpers |
| **Web routing** | `go_router ^16.0.0` | Routing in the two web dashboards |
| **Image editing** | `crop_your_image ^2.0.0`, `image ^4.8.0` | Organization logo cropping/processing |

## Firebase (client SDKs)

| Service | Package |
|---------|---------|
| **Core** | `firebase_core ^4.7.0` |
| **Authentication** | `firebase_auth ^6.4.0` |
| **Cloud Firestore** | `cloud_firestore ^6.3.0` |
| **Cloud Storage** | `firebase_storage ^13.3.0` |
| **Cloud Functions** | `cloud_functions ^6.0.6` |
| **Cloud Messaging** | `firebase_messaging ^16.2.2` |
| **Local notifications** | `flutter_local_notifications ^21.0.0` |
| **Crashlytics** | `firebase_crashlytics ^5.2.2` |
| **App Check** | `firebase_app_check ^0.4.4+1` *(dependency present)* |

## Backend (Cloud Functions)

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 22 | Runtime |
| **TypeScript** | — | Type-safe function source |
| **firebase-functions** | ^7.2.5 | Function framework |
| **firebase-admin** | ^13.8.0 | Server-side Firebase access |
| **@google-cloud/translate** | ^8.5.0 | Automatic content translation |

## Fonts & design

- **Inter** (weights 400–900) — primary Latin typeface
- **Cairo** and **IBM Plex Sans Arabic** — Arabic-script typefaces for RTL languages
- **Material 3** color scheme; brand seed **#4F46E5** / primary **#3525CD**

## Tooling

- **flutter_native_splash** — native splash screens
- **flutter_launcher_icons** — app icons
- **intl_utils** — ARB → Dart localization generation
- **fake_cloud_firestore**, `flutter_test`, `integration_test` — testing
- **Python & Node localization tooling** (`tools/l10n/`) — translation-memory harvest/merge/apply/verify pipeline

## Tech at a glance

```
Flutter ──┬── flutter_bloc (state)
          ├── Dio + connectivity (network / offline)
          ├── fl_chart (analytics)
          ├── intl / intl_utils (12-language i18n)
          └── Firebase SDKs
                 │
Firebase ──┬── Auth
           ├── Cloud Firestore (real-time)
           ├── Cloud Storage (media)
           ├── Cloud Functions (Node 22 / TS)
           ├── Cloud Messaging (push)
           ├── Cloud Translation
           ├── Crashlytics
           └── Hosting (3 sites)
```
