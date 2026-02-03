# Progress Log

Este archivo registra, en orden cronológico, los cambios técnicos y decisiones clave realizadas en el proyecto **mapi-web**. Sirve como historial de trabajo para auditoría, debugging y continuidad.

## Formato recomendado (añadir nuevas entradas arriba)
- **Fecha / Hora (UTC-5):**
- **Área:** (Frontend / Backend / DB / Infra / SEO / QA)
- **Contexto:** breve por qué del cambio.
- **Cambios:** lista concreta de archivos o acciones.
- **Resultado:** qué se logró y cómo se validó.
- **Pendientes:** si quedó algo por cerrar.

---

## 2026-02-03 — Frontend / UX / SEO / Infra

- **Contexto:** Ajustes de UI, SEO, navegación por idioma y estabilización de rutas/admin.
- **Cambios clave (frontend):**
  - Se reorganizaron los “Detalles del tour” para mostrarse como banda horizontal (quick stats) antes del resumen en páginas de tour.
  - Se mejoró el componente de pestañas para reconocer títulos en mayúsculas y variantes en español, incluyendo **PREGUNTAS FRECUENTES**, **ANTES DE VIAJAR** y “F.A.Q./FAQ”.
  - Se agregó botón flotante de WhatsApp con animación pulsante cada 3 segundos.
  - Se ocultó el bloque de disponibilidad en Machu Picchu (flag `showAvailability`).
  - Se eliminó duplicado de “Experiencias curadas / Tours disponibles” en Machu Picchu.
- **Cambios clave (SEO):**
  - Se validó sitemap dinámico y se agregaron metadatos (title/description/canonical/lang) en páginas clave.
  - Se añadieron secciones estructuradas en detalle de tours (tabs) para evitar HTML “vacío”.
- **Cambios clave (Admin/Auth):**
  - Ajuste de flujo `/es/admin` → `/signin` y normalización de sesión por cookie `admin_session`.
  - Endpoints admin (`/admin/api/trips`) verificados con token/cookie.
- **Infra / Deploy:**
  - Rebuilds frecuentes con `docker compose ... up -d --build web`.
  - Se corrigieron errores de JSX en `machupicchu/page.js` que rompían el build.
- **Archivos tocados (principales):**
  - `web/src/app/components/TourDetailPage.js`
  - `web/src/app/components/TripTabs.js`
  - `web/src/app/layout.js`
  - `web/src/app/globals.css`
  - `web/src/app/machupicchu/page.js`
  - `web/src/app/api/trips/route.js`
  - `web/src/app/api/trips/[id]/route.js`
  - `web/src/app/admin/api/trips/route.js`
  - `web/src/app/admin/api/trips/[id]/route.js`
  - `web/src/app/middleware.js`
- **Resultado / Validación:**
  - `next build` exitoso tras corregir JSX.
  - Validaciones HTML con `curl` en páginas principales.
  - UI confirmada con layout actualizado en `/inca-trail/classic-inca-trail` y Machu Picchu.
- **Pendientes:**
  - Verificar cache del navegador tras deploy.
  - Revisar consistencia de textos de tours en DB (ver entrada de DB).

---

## 2026-02-03 — Base de Datos / Contenido de tours

- **Contexto:** Se solicitó reescritura de contenido de tours en **machupicchuavailability.trips** con SEO mejorado y longitud comparable a referencias.
- **Acciones realizadas:**
  - Iteraciones de reescritura y expansión de secciones (RESUMEN, ITINERARIO, INCLUIDOS, FAQ, etc.).
  - Se solicitó conservar estructura pero evitar contenido repetitivo y duplicado entre idiomas.
  - Se pidió priorizar keywords: “Camino Inca Clásico”, “Camino Inca Corto”, “Machu Picchu Tours”, “Salkantay Trek”.
- **Estado actual:** **en revisión** por calidad; el usuario reportó textos repetitivos y longitud insuficiente.
- **Pendientes:**
  - Reescritura final, amplia y editorial, sin repeticiones, para ES/EN.
  - Confirmar que los textos reflejan SEO y longitud similares a tours de referencia.

---

## 2026-02-03 — Infra / Backups / VPS

- **Contexto:** Limpieza y gestión de backups y espacio en VPS.
- **Acciones:**
  - Creación y renombrado de backups tar de `/srv/deploy/projects/mapi-web`.
  - Eliminación de backups antiguos cuando se solicitó.
  - Revisión de consumo de disco (snap/paquetes y contenedores).
- **Pendientes:**
  - Monitoreo periódico de espacio y logs.

---

## 2026-02-03 — Documentación del proyecto

- **Contexto:** Se pidió documentación interna para continuidad.
- **Cambios:**
  - Creado `progress.md` (este log).
  - Creado `map_structure.md` con mapeo completo de arquitectura, rutas y endpoints.
  - Actualizado `AGENTS.md` para incluir documentación, comandos reales de rebuild y rutas clave.
- **Resultado:**
  - Documentación base consolidada y lista para uso operativo.

---

## Notas operativas
- Mantener este archivo actualizado tras cada sesión de cambios.
- Para nuevas entradas, copiar el bloque de formato recomendado.
- Registrar siempre: fecha/hora, archivos, motivo, validación y pendientes.

---

## Estado actual (checklist)
- **Frontend UI (tours):** ✓ quick stats horizontal, ✓ tabs FAQ ES/EN, ✓ botón WhatsApp, ✓ duplicados removidos.
- **Machu Picchu disponibilidad:** ✓ bloque oculto con flag (showAvailability=false).
- **Build en VPS:** ✓ compila después de corrección JSX; ⚠️ requiere rebuild tras cada cambio.
- **Admin / Auth:** ✓ `/signin` y cookies admin funcionando; ✓ endpoints admin verificados.
- **SEO técnico:** ✓ sitemap dinámico, ✓ metadata base, ✓ canonical/lang en rutas clave.
- **Contenido tours (DB):** ⚠️ pendiente reescritura editorial final (ES/EN), sin repeticiones, longitud adecuada.

---

## 2026-02-03 — Documentación / Env

- **Contexto:** Faltaba plantilla de variables de entorno.
- **Cambios:**
  - Se añadieron `.env.example` en raíz, `api/` y `web/`.
- **Archivos:**
  - `.env.example`
  - `api/.env.example`
  - `web/.env.example`
- **Resultado:** Plantillas listas para nuevos entornos.
