# Backend guide: property leads (tenant enquiries)

The Next.js app expects a **REST API** on the same base URL as other routes (`NEXT_PUBLIC_API_URL` or dev default). Implement the following so **tenants** can create enquiries and **agents** see only their own leads.

## Data model (suggested)

| Field | Type | Notes |
|-------|------|--------|
| `id` | int (PK) | Auto-increment / UUID |
| `property_id` | FK | Must exist; drives which **agent** receives the lead |
| `tenant_user_id` | FK → users | From JWT on `POST` (do not trust client body for identity) |
| `agent_user_id` | FK → users | Resolved from property (listing owner / assigned agent—**your domain rule**) |
| `message` | text, nullable | Optional note from tenant |
| `status` | enum | `new`, `contacted`, `closed`, `archived` |
| `created_at`, `updated_at` | timestamps | ISO strings in JSON |

**Assigning the agent:** When a property is created/updated, store which **agent user** owns or manages it. On `POST /leads`, look up `property_id` → `agent_user_id`. Reject if property has no assignee.

**Uniqueness (optional):** You may enforce one open lead per `(tenant_user_id, property_id)` and return `409` if duplicate; the frontend shows the error message from the API.

---

## Endpoints

### 1. `POST /leads` — tenant creates an enquiry

**Auth:** Bearer JWT required.

**Authorization:** User role must be **`tenant`** (or your product may allow other roles—then adjust the frontend).

**Body (JSON):**

```json
{
  "propertyId": 123,
  "message": "Optional text"
}
```

**Behavior:**

1. Resolve authenticated user → `tenant_user_id`.
2. Load property by `propertyId`; 404 if missing.
3. Resolve `agent_user_id` from property (your listing/agent field).
4. Create lead with `status: "new"`.
5. Optionally copy tenant name/email/phone from user profile into the lead row or join at read time.

**Response:** `201` + lead JSON (camelCase or snake_case—see [Response shape](#response-shape)).

**Errors:**

| Code | When |
|------|------|
| 400 | Invalid body, missing `propertyId` |
| 401 | No/invalid token |
| 403 | Role not allowed (e.g. agent calling POST) |
| 404 | Property not found |
| 409 | Duplicate enquiry (if you enforce) |

---

### 2. `GET /leads` — agent lists their leads

**Auth:** Bearer JWT required.

**Authorization:** User role **`agent`**. Return only rows where `agent_user_id` matches the authenticated user’s id.

**Response:** `200` + array of lead objects (newest first recommended).

**Errors:** `401`, `403` if not an agent.

---

### 3. `PATCH /leads/:id` — agent updates status

**Auth:** Bearer JWT required.

**Authorization:** User is **`agent`** and `lead.agent_user_id` matches the JWT user (404 or 403 otherwise).

**Body (JSON):**

```json
{ "status": "contacted" }
```

Allowed `status` values: `new`, `contacted`, `closed`, `archived`.

**Response:** `200` + updated lead JSON.

**Errors:** `400` invalid status, `401`, `403`, `404`.

---

## Response shape

The frontend mapper in `lib/api.ts` accepts **either** camelCase or snake_case:

- `propertyId` / `property_id`
- `propertyTitle` / `property_title` (denormalize or join property title for display)
- `tenantId` / `tenant_id`
- `tenantName` / `tenant_name`
- `tenantEmail` / `tenant_email`
- `tenantPhone` / `tenant_phone`
- `message`, `status`
- `createdAt` / `created_at`, `updatedAt` / `updated_at`

Ensure at least: `id`, `propertyId`, `propertyTitle`, `tenantId`, `tenantName`, `tenantEmail`, `status`, `createdAt`.

---

## Properties table reminder

To route leads correctly, the backend should expose (internally) which **user id** is the listing agent for each property—e.g. `assigned_agent_id` or “owner is tenant user X, agent is Y” depending on your product. The frontend does **not** send `agentId` on create; the server derives it from `propertyId`.

---

## Testing checklist

1. Tenant JWT → `POST /leads` with valid `propertyId` → `201`.
2. Same tenant + same property again → your chosen behavior (`201` or `409`).
3. Agent JWT (assigned to that property) → `GET /leads` includes the new row.
4. Different agent JWT → `GET /leads` does **not** include that row.
5. Agent → `PATCH /leads/:id` with `status` → row updates; tenant cannot call `PATCH`.
