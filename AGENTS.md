# Guía del Repositorio

## Estructura del Proyecto y Organización de Módulos
- `api/`: Servicio Node.js (ES modules) que expone una API HTTP simple en el puerto 4000. Archivos clave: `api/index.js`, `api/collectData.js`, y lógica de BD en `api/db/` y `api/module/`.
- `web/`: App Next.js (App Router) con código en `web/src/`, assets en `web/public/`, y configuración Tailwind/PostCSS en `web/tailwind.config.mjs` y `web/postcss.config.mjs`.
- `docker-compose.yml`: Composición orientada a producción para `api` y `web`.
- `map_structure.md`: Mapa completo de arquitectura, rutas y endpoints.
- `progress.md`: Registro cronológico de cambios.

## Comandos de Build, Test y Desarrollo
Ejecuta los comandos desde la raíz del repo salvo que se indique lo contrario.
- `cd web && npm install`: Instala dependencias del front (usa `web/package-lock.json`).
- `cd web && npm run dev`: Inicia el servidor de desarrollo en http://localhost:3000.
- `cd web && npm run build`: Genera un build de producción.
- `cd web && npm run start`: Levanta el servidor de producción después de `build`.
- `cd web && npm run lint`: Ejecuta ESLint de Next.js.
- `cd api && npm install`: Instala dependencias del API (usa `api/package-lock.json`).
- `cd api && npm run start`: Inicia el API con nodemon en el puerto 4000.
- `docker compose -f /srv/deploy/projects/mapi-web/docker-compose.yml up -d --build web`: Rebuild rápido del front en VPS.
- `docker compose -f /srv/deploy/projects/mapi-web/docker-compose.yml up -d --build`: Compila y ejecuta ambos servicios con Docker.

## Estilo de Código y Convenciones de Nombres
- Usa indentación de 2 espacios y sintaxis ES modules (`import`/`export`), como en `api/index.js`.
- Mantén nombres descriptivos de módulos y archivos (`availabilityModel.js`, `next-seo.config.js`).
- Ejecuta `npm run lint` en `web/` antes de enviar cambios de UI.
 - Para UI, preferir componentes reutilizables en `web/src/app/components/`.

## Guías de Testing
- No hay tests automatizados configurados. El script `npm test` en `api` es un placeholder.
- Si agregas tests, colócalos cerca del código (p. ej., `web/src/**/__tests__` o `api/**/__tests__`) y documenta el comando aquí.

## Guías de Commits y Pull Requests
- Este repo no define convenciones de commits; sigue el estándar de tu equipo.
- Los PRs deben incluir: resumen breve, notas de testing (comandos + resultados) y capturas para cambios de UI en `web/`.

## Seguridad y Configuración
- Las variables de entorno viven en `web/.env`; no subas secretos.
- Docker usa filesystems `read_only` y tmpfs; evita escribir a disco en runtime salvo que haya un volumen montado.

## Rutas y endpoints clave
- Páginas públicas: `/`, `/machupicchu`, `/incatrail`, `/chachabamba`, `/qoriwayrachina`, `/salkantay`.
- Tours dinámicos: `/:category/:slug`.
- Admin: `/signin`, `/admin`, `/admin/api/trips`.
- API pública: `/api`, `/api/trips`, `/api/trips/:id`.
