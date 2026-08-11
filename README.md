# Book Explorer

Full-stack app for browsing books with community ratings. An Express backend
aggregates the Open Library API (book data) and the Google Books API (ratings)
into a single clean endpoint; a React frontend consumes it with search, subject
filters, sorting, pagination, and a detail view.

## Quick start

Requires Node 20+.

```bash
npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001/api/books

Run tests and type checks:

```bash
npm run test
npm run typecheck
```

No environment variables are required. `GOOGLE_BOOKS_API_KEY` is optionally
picked up to raise Google Books rate limits.

## Architecture

```
client (React + Vite)                server (Express)
┌──────────────────────┐             ┌──────────────────────────────┐
│ TanStack Query       │  /api/books │ routes    → validation       │
│  (server state)      ├────────────►│ service   → merge/sort/cache │
│ Zustand              │   (proxy)   │ clients   → Open Library     │
│  (filters state)     │             │           → Google Books     │
└──────────────────────┘             └──────────────────────────────┘
```

**Backend** — layered: routes handle HTTP concerns only; `bookService`
orchestrates one Open Library search per request, then enriches each result
with Google Books ratings in parallel (bounded to 5 concurrent lookups),
merges everything into one typed response, and caches it in memory for 10
minutes. **Frontend** — TanStack Query owns all server data (caching, retries,
previous-page placeholders); a single Zustand store owns the four pieces of
filter state; components subscribe only to the slices they need.

## Key decisions

- **Server-side aggregation** keeps the frontend to one request per page and
  hides upstream quirks (ISBN matching, rating fallbacks) behind one contract.
- **Graceful degradation**: if Google Books is slow, rate-limited, or down,
  books still render — rating fields come back `null` and the UI says
  "No ratings yet" rather than showing fake zeros or failing the page.
- **In-memory TTL cache** (10 min list / 60 min detail) keeps repeat browsing
  fast and stays well inside Google Books' unauthenticated rate limits. A
  process-local Map is deliberate — no Redis for a single-instance assessment.
- **Bounded concurrency** (5 parallel rating lookups) balances page latency
  against hammering the ratings API.
- **Sort by rating** asks Open Library for a globally rating-sorted result
  set, then re-sorts the visible page by the Google rating actually displayed
  (unrated last). Within-page ordering is always consistent with what you see;
  cross-page ordering is approximate. This trade-off is intentional — exact
  global ordering would require fetching ratings for every result upfront.
- **No URL state syncing / no dark mode** — cut deliberately to keep the
  scope honest for the time budget.

## Testing

- **Server (Vitest + Supertest):** merge and normalization logic, TTL cache
  expiry, bounded concurrency, both API clients (mocked transport), and route
  tests covering validation errors and upstream-failure degradation.
- **Client (Vitest + Testing Library):** filters store behavior, search
  debounce, rating/no-rating card rendering, and app-level loading → data,
  empty, and error states.
