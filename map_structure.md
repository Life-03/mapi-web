# Mapa de Estructura del Proyecto (mapi-web)

Este documento resume la estructura real del repo, sus módulos principales y responsabilidades.

## Diagrama de flujo (alto nivel)
```
Navegador
  └─ Next.js (web)
       ├─ App Router (rutas públicas y admin)
       ├─ Components (UI, tabs, sliders, SEO)
       ├─ API Routes (web/src/app/api/*)
       │     ├─ trips (CRUD)
       │     └─ availability (proxy/consulta)
       └─ MongoDB (machupicchuavailability)
             ├─ trips
             └─ availabilities (si aplica)

API externa (api/)
  └─ Node + Mongoose
       ├─ disponibilidad (Database.availabilities)
       └─ trips (si se expone desde API)
```

## Diagrama por capas (arquitectura)
```
Capa UI (Presentación)
  - Next.js App Router
  - Componentes (TourDetailPage, TourList, TripTabs, etc.)
  - i18n (diccionarios ES/EN)

Capa API (Aplicación)
  - Next.js API Routes (web/src/app/api/*)
  - Admin API (web/src/app/admin/api/*)
  - API Node independiente (api/)

Capa Datos (Persistencia)
  - MongoDB: machupicchuavailability.trips
  - MongoDB: Database.availabilities (solo lectura)

Capa Infra / Deploy
  - Docker Compose (web + api)
  - Nginx/Proxy (si aplica)
```

## Mapa de dependencias (rutas clave → handlers → DB)
```
/ (Home)
  └─ web/src/app/page.js
       └─ HomeTourSlider / TourList
            └─ /api/trips (Next API)
                 └─ MongoDB: machupicchuavailability.trips

/[category]/[slug] (Detalle de tour)
  └─ web/src/app/[category]/[slug]/page.js
       └─ TourDetailPage
            └─ TripTabs (parsea secciones)
            └─ /api/trips?slug=...
                 └─ MongoDB: machupicchuavailability.trips

/machupicchu (Landing)
  └─ web/src/app/machupicchu/page.js
       └─ TourList (category=machupicchu)
       └─ /api?idRuta=11&idLugar=1
            └─ API (Next o api/) → Database.availabilities

/signin (Login)
  └─ web/src/app/signin/page.js + SignInClient.js
       └─ /api/auth/login (si aplica)

/admin (Dashboard)
  └─ web/src/app/admin/page.js + AdminClient.js
       └─ /admin/api/trips (CRUD)
            └─ MongoDB: machupicchuavailability.trips
```

## Mapa de endpoints (API)

### Público (Next API)

**GET `/api`**  
Proxy de disponibilidad (CORS).  
Query: `idRuta`, `idLugar`, `idMes` (opcional)  
Origen: `web/src/app/api/route.js` → `INTERNAL_API_BASE_URL` (api:4000)  
Respuesta:
```json
{ "success": true, "data": { "data": [], "updatedAt": "..." } }
```
Ejemplo:
```bash
curl "https://machupicchuavailability.com/api?idRuta=11&idLugar=1"
```

**GET `/api/trips`**  
Lista de tours (filtros por query).  
Query: `category`, `subcategory`, `lang`, `slug`, `slugs`, `q`, `limit`, `mode=admin`  
Origen: `web/src/app/api/trips/route.js`  
Respuesta:
```json
{ "success": true, "data": [ { "title": "...", "slug": "..." } ] }
```
Ejemplo:
```bash
curl "https://machupicchuavailability.com/api/trips?category=inca-trail&lang=es&limit=3"
```

**POST `/api/trips`**  
Crea un tour (solo admin).  
Headers: `authorization: Bearer ...` o `x-admin-token` o cookie `admin_session`  
Body: objeto Trip (ver modelo)  
Origen: `web/src/app/api/trips/route.js`  
Ejemplo:
```bash
curl -X POST "https://machupicchuavailability.com/api/trips" \\
  -H "Content-Type: application/json" \\
  -H "x-admin-token: <TOKEN>" \\
  -d '{\"title\":\"Nuevo Tour\",\"slug\":\"nuevo-tour\",\"lang\":\"es\"}'
```

**GET `/api/trips/:id`**  
Obtiene un tour por ID.  
Origen: `web/src/app/api/trips/[id]/route.js`  
Ejemplo:
```bash
curl "https://machupicchuavailability.com/api/trips/ID_DEL_TOUR"
```

**PUT `/api/trips/:id`**  
Actualiza un tour (solo admin).  
Headers: auth admin  
Body: objeto Trip  
Origen: `web/src/app/api/trips/[id]/route.js`  
Ejemplo:
```bash
curl -X PUT "https://machupicchuavailability.com/api/trips/ID_DEL_TOUR" \\
  -H "Content-Type: application/json" \\
  -H "x-admin-token: <TOKEN>" \\
  -d '{\"title\":\"Tour actualizado\"}'
```

**DELETE `/api/trips/:id`**  
Elimina un tour (solo admin).  
Headers: auth admin  
Origen: `web/src/app/api/trips/[id]/route.js`  
Ejemplo:
```bash
curl -X DELETE "https://machupicchuavailability.com/api/trips/ID_DEL_TOUR" \\
  -H "x-admin-token: <TOKEN>"
```

### Admin (Next API proxy)

**GET `/admin/api/trips`**  
Proxy autenticado hacia `api:4000/api/trips`.  
Headers internos: `x-admin-token` si existe.  
Origen: `web/src/app/admin/api/trips/route.js`  
Ejemplo:
```bash
curl "https://machupicchuavailability.com/admin/api/trips?limit=5" \\
  -H "Cookie: admin_session=<SESSION>"
```

**POST `/admin/api/trips`**  
Crea tour vía API externa (solo admin).  
Origen: `web/src/app/admin/api/trips/route.js`  
Ejemplo:
```bash
curl -X POST "https://machupicchuavailability.com/admin/api/trips" \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_session=<SESSION>" \\
  -d '{\"title\":\"Nuevo Tour\",\"slug\":\"nuevo-tour\",\"lang\":\"es\"}'
```

**GET `/admin/api/trips/:id`**  
Obtiene tour vía API externa (solo admin).  
Origen: `web/src/app/admin/api/trips/[id]/route.js`  
Ejemplo:
```bash
curl "https://machupicchuavailability.com/admin/api/trips/ID_DEL_TOUR" \\
  -H "Cookie: admin_session=<SESSION>"
```

**PUT `/admin/api/trips/:id`**  
Actualiza tour vía API externa (solo admin).  
Origen: `web/src/app/admin/api/trips/[id]/route.js`  
Ejemplo:
```bash
curl -X PUT "https://machupicchuavailability.com/admin/api/trips/ID_DEL_TOUR" \\
  -H "Content-Type: application/json" \\
  -H "Cookie: admin_session=<SESSION>" \\
  -d '{\"title\":\"Tour actualizado\"}'
```

**DELETE `/admin/api/trips/:id`**  
Elimina tour vía API externa (solo admin).  
Origen: `web/src/app/admin/api/trips/[id]/route.js`  
Ejemplo:
```bash
curl -X DELETE "https://machupicchuavailability.com/admin/api/trips/ID_DEL_TOUR" \\
  -H "Cookie: admin_session=<SESSION>"
```

### API externa (Node)

**GET `/api`**  
Disponibilidad (Database.availabilities).  
Origen: `api/index.js` (Node)  

**GET/POST/PUT/DELETE `/api/trips`**  
CRUD de tours en `machupicchuavailability.trips` (si está habilitado en el API).  
Origen: `api/index.js` + modelos `api/module/tripModel.js`  

## Raíz
- `docker-compose.yml`: orquesta servicios `web` (Next.js) y `api` (Node/Express + MongoDB).
- `AGENTS.md`: guía de trabajo para agentes.
- `progress.md`: historial de cambios.
- `map_structure.md`: este documento.

## API (`api/`)
Servicio Node.js (ESM) para disponibilidad y tours.
- `api/index.js`: entrypoint del servidor.
- `api/db/mainDB.js`: conexión principal a MongoDB (Mongoose).
- `api/module/availabilityModel.js`: modelo de disponibilidad.
- `api/module/tripModel.js`: modelo de tours (trips).
- `api/Dockerfile`: build de contenedor API.
- `api/package.json`, `api/package-lock.json`: dependencias y scripts.

## Web (`web/`)
Next.js App Router + Tailwind. UI, SEO, i18n, admin y rutas públicas.

### Configuración
- `web/next.config.mjs`: configuración de Next.js.
- `web/ecosystem.config.js`: PM2 (si aplica fuera de Docker).
- `web/package.json`: scripts de build/dev/lint.

### App Router (`web/src/app/`)
- `layout.js`: layout global (Navbar, Footer, JSON-LD, botón WhatsApp).
- `page.js`: home.
- `globals.css`: estilos globales + animaciones.
- `robots.js`, `sitemap.js`: SEO técnico.

#### Rutas públicas
- `/machupicchu`, `/salkantay`, `/incatrail`, `/chachabamba`, `/qoriwayrachina`: landings por destino.
  - Cada una tiene `layout.js` + `page.js`.
- `/[category]/[slug]`: detalle dinámico de tour (SSR/DB).
- `/tours/[slug]`: detalle legacy/alternativo de tour.

#### Admin
- `/signin`: login de administración.
- `/admin`: dashboard para trips (CRUD).
- `/admin/api/trips`: endpoints internos de admin.

#### API (Next)
- `/api`: proxy de disponibilidad.
- `/api/trips` y `/api/trips/[id]`: API pública de tours.

### Componentes (`web/src/app/components/`)
UI reutilizable y lógica de secciones:
- `TourDetailPage.js`: layout de detalle de tour (hero, resumen, tabs).
- `TripTabs.js`: tabs dinámicos desde contenido (OVERVIEW/ITINERARY/FAQ/etc).
- `TourList.js`: listado/slider de tours por categoría.
- `HomeTourSlider.js`: slider de tours en home.
- `LightboxGallery.js`: galería con lightbox.
- `PackingListSection.js`: bloque de equipaje.
- `Navbar.js`, `footer.js`, `LocaleSwitcher.js`: navegación + idioma.
- `JsonLd.js`, `SEO.js`: datos estructurados y SEO.

### i18n (`web/src/i18n/`)
Diccionarios ES/EN por destino y globales.
- `es.json`, `en.json`: global.
- `machu.*`, `salkantay.*`, `incatrail.*`, `chachabamba.*`, `qoriwayrachina.*`

### DB (frontend)
- `web/src/db/mongodb.js`: conexión Mongo (para API routes).
- `web/src/models/tripModel.js`, `availabilityModel.js`: modelos usados por API routes.

## Rutas y responsabilidades clave
- **Home** (`/`): slider principal de tours + secciones informativas.
- **Landings** (destinos): CTA + contenido editorial + listados filtrados de tours.
- **Detalle de tour** (`/[category]/[slug]`):
  - Hero + resumen + quick stats + tabs de contenido (OVERVIEW/ITINERARY/FAQ).
  - Galería con lightbox.
  - Datos estructurados (JSON‑LD TouristTrip si está activado).
- **Admin**:
  - Autenticación en `/signin`.
  - CRUD de tours en `/admin` (usa endpoints internos `/admin/api/trips`).

## Flujo de datos (trips)
1. UI solicita tours a `/api/trips` (Next API).
2. API conecta a Mongo (`machupicchuavailability.trips`).
3. La UI renderiza cards/listados o detalle por slug.
4. En detalle, `TripTabs` convierte secciones en pestañas.

## Flujo de datos (availability)
1. UI solicita disponibilidad (por ruta y lugar).
2. API (Next o api/) consulta `Database.availabilities` según configuración.
3. Se renderiza en calendario (MultiCalendar).

## SEO / Indexación
- `sitemap.js`: genera sitemap dinámico.
- `robots.js`: reglas de rastreo.
- `lib/seo.js`: helpers de metadata, JSON‑LD, Open Graph.
- `layout.js` y layouts de rutas: metadata específica por página.

## Infra / Deploy
- Docker Compose:
  - `web`: Next.js (build y runtime)
  - `api`: Node API (Mongoose)
  - `nginx` (si está en el compose global)
- Rebuild recomendado tras cambios front:
  - `docker compose -f /srv/deploy/projects/mapi-web/docker-compose.yml up -d --build web`

## Entorno (env)
- `api/.env`: variables del backend (Mongo, puertos, credenciales).
- `web/.env`: variables frontend (NEXT_PUBLIC_*).
- `.env` en raíz: build args o docker compose.

## Otros
- `progress.md`: log de cambios.
- `AGENTS.md`: reglas de trabajo.

---

Nota: se excluyen `node_modules` y builds (`.next`, `dist`) por tamaño.
