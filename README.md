# mapi-web

Sitio web y API para disponibilidad de Machu Picchu y tours, construido con Next.js (App Router) y Node.js + MongoDB.

## Estructura
- `web/`: Next.js (frontend + API routes)
- `api/`: Node.js (servicios y modelos)
- `docker-compose.yml`: orquestación local/producción
- `map_structure.md`: mapa completo de arquitectura y endpoints
- `progress.md`: historial de cambios

## Comandos rápidos
Desde la raíz del repo:

### Frontend (Next.js)
```bash
cd web
npm install
npm run dev
```

### API (Node)
```bash
cd api
npm install
npm run start
```

### Docker (rebuild rápido del front)
```bash
docker compose -f /srv/deploy/projects/mapi-web/docker-compose.yml up -d --build web
```

## SEO y rutas clave
- Páginas públicas: `/`, `/machupicchu`, `/incatrail`, `/chachabamba`, `/qoriwayrachina`, `/salkantay`
- Tours dinámicos: `/:category/:slug`
- Admin: `/signin`, `/admin`
- API pública: `/api`, `/api/trips`

## Notas
- Variables sensibles van en `.env` (no se versionan).
- Ver `map_structure.md` para rutas, flujo de datos y endpoints.

## Deploy (VPS)
Rebuild rápido del frontend:
```bash
docker compose -f /srv/deploy/projects/mapi-web/docker-compose.yml up -d --build web
```

Rebuild completo:
```bash
docker compose -f /srv/deploy/projects/mapi-web/docker-compose.yml up -d --build
```

## Variables de entorno (referencia)
### `api/.env`
```
PORT=4000
MONGODB_URI=...
ADMIN_TOKEN=...
ADMIN_SESSION_TOKEN=...
```

### `web/.env`
```
NEXT_PUBLIC_SITE_URL=https://machupicchuavailability.com
```

### `.env` en raíz (Docker)
```
ENABLE_PUPPETEER=0
```
