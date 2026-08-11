# Book Explorer — Design Spec

**Date:** 2026-08-11
**Context:** Full-stack assessment (4–6h scope). Backend aggregates Open Library + Google Books into one clean API; responsive frontend displays books with ratings. Submission: public GitHub repo, README with setup instructions. No live deployment. Deadline: 2026-08-13.

## Goals

- Single merged `/api/books` endpoint combining Open Library book data with Google Books ratings.
- Professional, polished, responsive UI: default browse listing, search, subject filters, sort, pagination, book detail view.
- Code that reads as the work of an experienced developer: layered but not over-engineered, self-documenting (no comments), typed end to end, tested on both sides.

## Stack

| Layer | Choice |
|---|---|
| Backend | Node.js, Express 5, TypeScript |
| Frontend | React 18+, Vite, TypeScript |
| UI library | MUI v7, custom light theme only |
| Server state | TanStack Query v5 |
| UI state | Zustand (single small store) |
| Testing | Vitest + Supertest (server), Vitest + React Testing Library (client) |
| Tooling | npm workspaces, root `dev` script via `concurrently` |

## Repo Layout

```
/
├── client/                  # React + Vite + TS
├── server/                  # Express + TS
├── package.json             # npm workspaces; npm run dev starts both
└── README.md
```

## Backend

### Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /api/books?q=&subject=&sort=&page=` | Merged, paginated book list (~20/page) |
| `GET /api/books/:workId` | Work detail: description, subjects, publish year |
| `GET /api/health` | Liveness check |

Query params: `q` (free-text search), `subject` (browse category; used when `q` absent), `sort` (`relevance` \| `rating` \| `new`), `page` (1-based). No `q` and no `subject` defaults to `subject=fiction` so the landing page is never empty.

Response shape (list):

```json
{
  "books": [
    {
      "id": "OL45883W",
      "title": "...",
      "authors": ["..."],
      "firstPublishYear": 1997,
      "coverUrl": "https://covers.openlibrary.org/...",
      "isbn": "...",
      "averageRating": 4.2,
      "ratingsCount": 1234,
      "ratingsSource": "google-books"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalResults": 4321,
  "totalPages": 217
}
```

`averageRating`, `ratingsCount`, and `ratingsSource` are `null` when Google Books has no data — never fabricated zeros.

Errors: consistent `{ "error": { "message": "...", "code": "..." } }` with appropriate HTTP status. Upstream failure of Google Books degrades gracefully (books return with `null` ratings); upstream failure of Open Library returns 502.

### Structure

```
server/src/
├── index.ts               # bootstrap only
├── app.ts                 # express app factory (testable without listening)
├── routes/books.ts        # HTTP concerns: param parsing/validation, status codes
├── services/bookService.ts# orchestration: fetch, enrich, merge, sort, paginate
├── clients/openLibrary.ts # OL search + work detail, response mapping
├── clients/googleBooks.ts # volume lookup by ISBN, fallback title+author
├── lib/cache.ts           # in-memory TTL cache (Map-based, no dependency)
└── types.ts               # API contract types
```

### Data flow per list request

1. Cache lookup keyed by normalized query string (TTL 10 min). Hit → return.
2. Open Library search (`search.json`) — one call returns title, authors, year, cover id, ISBNs, total count. Upstream sort passed through for `rating`/`new`.
3. Enrich each of the ~20 results with Google Books (`volumes?q=isbn:...`, fallback `intitle:+inauthor:`) via `Promise.allSettled` with a concurrency cap of 5. Failures → `null` rating for that book only.
4. Merge into the `Book` contract type; stable-sort page by displayed rating when `sort=rating` (nulls last).
5. Cache and return.

Upstream calls use a shared fetch helper with a timeout (~8s) — native `fetch`, no axios.

### Sort-by-rating trade-off (documented in README)

Open Library sorts globally by its own rating signal; the displayed rating comes from Google Books. The merged page is re-sorted by the displayed rating so visible ordering is always correct; cross-page ordering is approximate.

## Frontend

### Structure

```
client/src/
├── main.tsx               # providers: theme, QueryClient
├── App.tsx                # layout: AppBar, filters, grid, pagination
├── theme.ts               # MUI light theme
├── api/books.ts           # typed fetch functions
├── api/types.ts           # mirror of server API contract
├── hooks/useBooks.ts      # useQuery wrappers (list + detail)
├── store/filtersStore.ts  # Zustand: query, subject, sort, page
└── components/
    ├── SearchBar.tsx      # debounced 400ms, clear button
    ├── SubjectChips.tsx   # category filter chips
    ├── SortSelect.tsx
    ├── BookGrid.tsx       # responsive grid, 2-col mobile → 5-col desktop
    ├── BookCard.tsx       # cover, title, authors, MUI Rating or "No ratings yet"
    ├── BookDetailDialog.tsx # fetches work detail; basics passed from card
    ├── SkeletonGrid.tsx   # loading state
    └── StatusMessage.tsx  # empty / error states with retry
```

### Behavior

- **State split:** TanStack Query owns server data (list keyed by `[books, query, subject, sort, page]`, detail keyed by work id). Zustand owns UI state only; filter-changing actions reset `page` to 1. No URL state syncing — deliberate scope decision.
- **Default view:** loads immediately with the Fiction subject browse; never an empty landing page.
- **Search:** debounced 400ms; while a search query is active, subject chips are visually deselected; clearing search returns to browse.
- **Detail view:** clicking a card opens `BookDetailDialog`; already-known fields render instantly, description/subjects stream in from the detail endpoint with a small skeleton.
- **States:** skeleton grid on load, `keepPreviousData` behavior while paginating, empty state with guidance, error state with retry button.
- **Cover fallback:** books without covers render a styled placeholder (title on a tinted background), not a broken image.

### Theme

Light theme only. Restrained professional palette (indigo/slate primary, off-white background, subtle card elevation on hover), `borderRadius` slightly raised, system font stack or Inter. No dark mode toggle — out of scope by decision.

## Testing

| Area | Tests |
|---|---|
| Server — merge logic | rating present, rating missing, ISBN fallback to title+author, malformed upstream item skipped |
| Server — cache | hit within TTL, miss after expiry |
| Server — route | `GET /api/books` happy path + Google-down degradation, clients mocked |
| Client — BookCard | renders rating; renders "No ratings yet" when `null` |
| Client — SearchBar | debounces store updates |
| Client — App/grid | shows skeletons then books with mocked fetch |

## README (part of the deliverable)

Setup (`npm install && npm run dev`), architecture overview with a small diagram, key decisions with reasoning (server-side merge, TTL cache, `allSettled` degradation, state split, sort trade-off), and screenshots.

## Out of Scope

Live deployment, authentication, database, dark mode, URL state syncing, i18n, favorites/bookmarks.
