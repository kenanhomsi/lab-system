# Cursor Bootstrap Prompt Pack (Clone This Architecture)

Use these prompts in a new project to reproduce the same architecture and design patterns as this repository.

How to use:
1. Paste Prompt 1 once at the start (project contract).
2. Run prompts in order.
3. Do not skip validation prompts.

---

## Prompt 1: Architecture Contract (Paste First)

```md
You are the architecture implementation agent for this project.

Goal:
Build this app with a strict layered architecture:
UI -> feature hooks/state -> frontend service layer (DI) -> Next.js /api BFF routes -> backend service layer (DI) -> external backend API.

Mandatory rules:
1) Next.js App Router + TypeScript.
2) Browser must call only `/api/*` (never direct upstream backend from client).
3) Use Inversify with:
   - root container
   - frontend child container
   - backend child container
4) Use class-based OOP design:
   - `Service` classes for use-cases
   - `Client` classes for transport
5) Each domain must have mirrored folder shape:
   - abstraction/
   - frontend/
   - backend/
6) API routes only do request mapping, token extraction, service call, and response mapping.
7) Use typed event bus on frontend for cross-feature decoupled behavior.
8) Keep provider pipeline pattern in feature factory:
   State -> Api -> Observer -> Utils -> UIFactory.
9) Keep DI names/tokens centralized in each module `names.ts`.
10) Keep all methods typed; avoid `any` unless unavoidable.

When implementing:
- Always scaffold one full vertical slice first (projects module).
- Then replicate for other modules.
- After each step, print what files were created/updated and why.
- If a requested change violates rules, stop and explain conflict.
```

---

## Prompt 2: Scaffold Core Foundation

```md
Create the architecture skeleton now.

Tasks:
1) Setup core dependencies:
   - inversify, reflect-metadata, axios, ramda
   - @tanstack/react-query
   - next-auth
   - next-intl
2) Create folder skeleton:
   - src/container
   - src/container/bindings
   - src/modules
   - src/lib/clients
   - src/hooks
3) Implement:
   - src/container/container.ts
   - src/container/frontend.ts
   - src/container/backend.ts
4) Implement axios instances:
   - frontend instance with baseURL `/api`
   - backend instance with baseURL from env BACKEND_URL
5) Add base module for axios abstraction in:
   - src/modules/axios/abstraction
   - src/modules/axios/frontend
   - src/modules/axios/backend
6) Output a short architecture tree.

Constraints:
- Keep code class-based where relevant.
- No business logic yet, only architecture foundation.
```

---

## Prompt 3: Build Golden Domain (`projects`) End-To-End

```md
Create one full domain called `projects` using exact architecture conventions.

Required files:
src/modules/projects/
  names.ts
  index.ts
  abstraction/client.ts
  abstraction/endpoint.ts
  abstraction/types.ts
  frontend/client.ts
  frontend/service.ts
  frontend/types.ts
  backend/client.ts
  backend/service.ts
  backend/types.ts

Also create:
- frontend DI binder for projects
- backend DI binder for projects
- route handler at src/app/api/projects/route.ts

Implementation requirements:
1) Service methods: Create, Find, FindOne, Update, Delete.
2) Frontend client calls `/api/projects`.
3) Backend client calls upstream backend endpoints.
4) Route handler extracts token for protected requests and delegates to backend service.
5) Normalize error responses via NextResponse.json with status code.

After implementation:
- Show dependency graph from route -> backend service -> backend client.
```

---

## Prompt 4: Feature Composition Pattern

```md
Implement a feature page that follows factory/provider composition pattern.

Create:
- page.tsx
- factory.tsx
- state.tsx
- api.tsx
- observer.tsx
- utils.tsx
- ui/factory.tsx
- store/index.ts
- store/state.ts
- store/api.ts
- store/utils.ts

Rules:
1) Factory composes providers in this order:
   State -> Api -> Observer -> Utils -> UIFactory
2) UI components are presentational.
3) Service/API calls happen in Api layer, not in leaf UI components.
4) Keep store split into state/api/utils and combine in index.

Provide a quick explanation of where each concern lives.
```

---

## Prompt 5: Event System + Observer Hook

```md
Implement typed frontend event system and observer hook.

Create:
- src/modules/events/types/*
- src/modules/events/logic.ts
- src/modules/events/service.ts
- frontend DI bindings for event service
- src/hooks/events-observer.ts

Requirements:
1) Event core uses EventEmitter.
2) Event payloads are strongly typed via union map.
3) Hook signature:
   useEventObserver(eventName, handler)
4) Hook auto-subscribes on mount and removes on unmount.
5) Demonstrate one event emit + one listener integration in a feature.
```

---

## Prompt 6: Local Store Provider Factory

```md
Implement reusable store-provider infrastructure like:
- createComponentWithProvider
- useStore
- useStoreApi
- useSyncFrom
- useCallAction
- useSubscribeAction

Constraints:
1) Use useSyncExternalStore for subscriptions.
2) Keep extras context support for provider props.
3) Add pushId support for scoped actions.
4) Include minimal usage example inside one feature module.
```

---

## Prompt 7: Add New Domain By Template

```md
Add domain `<replace_with_domain>` by copying the projects domain pattern exactly.

Steps:
1) Copy module folder template and rename symbols.
2) Add names.ts tokens.
3) Add front/back clients and services.
4) Add front/back DI binders and register in frontend.ts/backend.ts pipe.
5) Add /api route.
6) Add one feature-level integration call.

Return:
- List of created files
- Confirmed parity with projects module
```

---

## Prompt 8: Architecture Verification Audit

```md
Run an architecture audit and return PASS/FAIL per rule.

Rules to verify:
1) Client code calls only `/api/*`
2) DI containers exist and are used (no manual new Service in app layer)
3) Each domain has abstraction/frontend/backend shape
4) Service/client classes exist and are separated by responsibility
5) API routes are thin mappers + service delegates
6) Event bus typed and integrated with observer hook
7) Feature factory/provider pipeline exists
8) Token extraction pattern is consistent for protected routes

Output format:
- Rule
- Status (PASS/FAIL)
- Evidence (file paths)
- Fix suggestion if FAIL
```

---

## Prompt 9: Generate README_ARCHITECTURE For New Repo

```md
Generate README_ARCHITECTURE.md for this repository.

Include sections:
1) Architecture at a glance (diagram)
2) Layer responsibilities
3) OOP/class model
4) DI containers and binders
5) Event system
6) Hooks catalog
7) End-to-end flows
8) Domain template
9) Strict replication rules
10) Architecture parity checklist

Use concrete file paths from this repo.
Keep it implementation-focused.
```

---

## Prompt 10: Pre-Production Drift Check

```md
Before release, perform architecture drift check:

1) Compare every domain module structure to golden `projects` module.
2) Detect direct axios/fetch usage in UI components.
3) Detect API routes with business logic leakage.
4) Detect event names used without typed definition.
5) Detect services instantiated without DI.

Return:
- Drift findings by severity
- Refactor actions
- Final architecture fidelity score out of 100
```

---

## Fast Copy/Paste Sequence

If you only want the shortest workflow, run prompts in this order:
1. Prompt 1
2. Prompt 2
3. Prompt 3
4. Prompt 4
5. Prompt 5
6. Prompt 6
7. Prompt 8
8. Prompt 9

Use Prompt 7 repeatedly for each new domain.

---

## Architecture Parity Checklist (Copy To PR)

```md
## Architecture Parity Checklist

- [ ] Client-side code only calls `/api/*`
- [ ] `frontendContainer` and `backendContainer` are present and used
- [ ] No manual service instantiation in app layer (`new Service(...)`)
- [ ] Every domain has `abstraction/frontend/backend` structure
- [ ] Every domain has `names.ts` DI tokens
- [ ] Service and client classes are split by responsibility
- [ ] API routes remain thin (mapping + delegation only)
- [ ] Protected routes consistently extract and pass token
- [ ] Feature pages use provider pipeline (`State -> Api -> Observer -> Utils -> UIFactory`)
- [ ] Typed event bus is used for cross-feature decoupling
- [ ] Event names and payloads are centrally typed
- [ ] Store/hook patterns are consistent with golden module
- [ ] No direct upstream backend calls from UI/hooks
```
