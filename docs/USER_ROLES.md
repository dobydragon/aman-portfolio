# Aman — User Roles & Permissions

Aman serves everyone from a newcomer to a platform operator through a **layered role and session model**, with UI gated by a real permission matrix (`dashboard_organization/lib/presentation/logic/dashboard_permissions.dart`).

## The five audiences

| Role | App(s) | Scope |
|------|--------|-------|
| **Refugee / Newcomer** | Aman Mobile | Their own profile, activities, communities and support |
| **Organization Admin** | Organization App + Web Dashboard | One organization's programs, communities and team |
| **Employee / Moderator** | Scoped org access | Sub-set of org capabilities per role tier |
| **Super Admin** | Super-Admin App + Web Dashboard | The entire platform, all organizations |
| **Aman Support** | Super-Admin App | Support & technical-support desk |

## Organization role matrix (`OrgRole`)

Surfaced to users as **Manager / Admin / Employee / View-only**.

| Capability | Owner | Admin | Staff | Viewer |
|-----------|:-----:|:-----:|:-----:|:------:|
| Manage activities | ✓ | ✓ | | |
| Manage participants | ✓ | ✓ | ✓ | |
| Manage reports | ✓ | ✓ | | |
| Manage team | ✓ | ✓ | | |
| Read-only | | | | ✓ |

`DashboardPermissions` gates: view dashboard, manage activities, moderate participation, manage team, manage catalog, view reports, moderate community content, view/manage communities, manage profile community, manage Bakje Troost — each with a denial message for read-only users.

## Community role hierarchy

Within any community group, roles rank **owner › admin › moderator › member**, enforced both in Firestore rules (`memberRoleRank`, `isCommunityModerator`, `isCommunityAdmin`) and in the `executeGroupAdminAction` Cloud Function. Moderators/admins can freeze groups, set roles, remove members and delete messages within their authority; hard-delete is super-admin only.

## Super-admin elevation

- **Platform org registry** (create/update/deactivate/delete organizations) is **super-admin only** (`OrganizationManagementPermissions`).
- A super admin can **open any organization's workspace** via `OrganizationContext.openedBySuperAdmin`, which bypasses org-level role checks.
- **Community moderation** is org-scoped for org admins (they may only act on reports whose `organizationId` matches their org); super admins may moderate anywhere.

## Session model

A layered session stack determines identity and capabilities:

```
SuperAdminSession  ─ platform operators
OrganizationAdminSession ─ org admins/staff
AmanSupportSession ─ support & technical-support staff
LegacyAdminSession ─ backward-compatible legacy logins
```

## Account states (end users)

`AppUserEntity` derives an **account status** from moderation fields:

- **Active** — normal access
- **Suspended** — temporary, with a `suspensionEndDate`
- **Banned** — with a `banReason`

Blocked users are routed to a dedicated `AccountBlockedScreen`. Muted or banned community members are prevented from posting, voting or messaging, and all moderation actions are recorded in **append-only** logs.

## How enforcement works today

- **Client-side RBAC** gates dashboard UI via the permission classes above.
- **Firestore security rules** enforce a **default-deny** model and role-based access using **custom claims** (`super_admin`, `organization_admin`, `support_admin`) plus the community role hierarchy, with a legacy fallback that reads `users/{uid}.role`.

See [SECURITY.md](SECURITY.md) for the full rules model.
