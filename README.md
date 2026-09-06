# PRAVAH — Frontend

Road conditions, incident reports and safer routes for the Northeast Region of India.

This is the web interface for the PRAVAH backend in `../pravah-backend`. Every screen is
driven by that backend; nothing on it is simulated.

## Requirements

- Node.js 20 or newer
- The PRAVAH backend running locally (see below)

## Running it

```bash
npm install
cp .env.example .env    # adjust VITE_API_BASE_URL if the backend is elsewhere
npm run dev
```

The app runs on <http://localhost:5173>.

### Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Base URL of the backend, without a trailing slash. The app appends `/api/v1` and `/health` itself. | `http://localhost:8000` |

No secrets belong in this file — only `VITE_`-prefixed public configuration, which is
embedded in the built JavaScript and visible to anyone using the app.

### Running the backend it talks to

From `../pravah-backend`:

```bash
docker compose up -d db
```

```bash
cd backend && DATABASE_URL=postgresql://pravah:pravah123@localhost:5433/pravah_db venv/bin/python -m uvicorn app.main:app --port 8000
```

Sign in with an account seeded by `backend/scripts/seed_user.py`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reloading |
| `npm run build` | Type-checks with `tsc -b`, then builds to `dist/` |
| `npm run preview` | Serves the built output |
| `npm run lint` | Runs oxlint |

## Backend endpoints used

Everything under `/api/v1` needs a bearer token; the health endpoints do not.

| Endpoint | Used by |
| --- | --- |
| `GET /health/live`, `GET /health/ready` | Service status in the header and on Settings |
| `POST /api/v1/auth/login` | Sign-in (OAuth2 password form, not JSON) |
| `GET /api/v1/roads/risk` | Dashboard summary, risk colouring on the map |
| `GET /api/v1/roads/geojson` | Road outlines, route geometry, incident placement |
| `GET /api/v1/incidents/` | Incidents list, dashboard, map markers |
| `POST /api/v1/incidents/` | Report an incident |
| `POST /api/v1/shipments/` | Creates the journey a route is planned for |
| `POST /api/v1/routes/recommend` | The recommended route itself |
| `GET /api/v1/alerts/` | Route warnings on the dashboard |

`GET /api/v1/roads/geojson` was added to the backend for this frontend. Road geometry is
stored in the database but was not part of any response schema, so there was no way to draw
a road or a route. It is an additive, read-only endpoint; no existing contract changed.

## How the code is arranged

```
src/
├── components/
│   ├── common/      Card, badges, loading / error / empty states
│   ├── dashboard/   Summary tiles and the risk breakdown
│   ├── incidents/   Incident card used on small screens
│   ├── layout/      Header, sidebar drawer, service status
│   ├── map/         Leaflet layers, legend, risk detail panel
│   ├── reports/     Incident report form
│   └── routing/     Route request panel and result summary
├── context/         Sign-in state
├── hooks/           Data loading and auth helpers
├── pages/           One file per route
├── services/        Axios instance, one function per endpoint, error wording
├── types/           TypeScript mirrors of the backend schemas
└── utils/           Risk presentation, formatting, geometry
```

### Notes worth knowing

- **Coordinate order.** GeoJSON is `[longitude, latitude]`; Leaflet is `[latitude, longitude]`.
  All conversion goes through `utils/geo.ts`.
- **Risk state is the backend's.** A road's `state` is displayed exactly as returned. A route
  only carries an average score, so `bandRouteScore` bands it using the same thresholds the
  backend's own risk engine uses.
- **Route geometry.** A recommendation returns segment IDs. The app fetches those exact
  segments at full precision and joins them in travel order, flipping each line where needed.
  Where a segment's outline is missing the line is broken rather than bridged, so the map
  never shows a straight line that is not a real road.
- **Routable points.** The backend snaps a requested point to the nearest road node, which can
  sit in a small isolated cluster. The app builds the connected road network in the browser and
  snaps to it first, then sends that node directly.
- **Map performance.** Roads are drawn onto a canvas renderer through Leaflet directly rather
  than as React elements — the layer holds a few thousand lines.
