# eventSystem_Front

Frontend para el Sistema de Control de Eventos (EventSystem).

Este repositorio contiene la implementación del cliente web (MVP) construido con Vite + React + TypeScript. Se integra con el backend existente `eventSystem_Back` (Node.js + Express + PostgreSQL) a través de un *dispatcher* genérico expuesto en POST `http://localhost:3000/api`.

## Resumen

- Nombre: eventSystem_Front
- Propósito: Cliente web modular por Business Objects (BOs) para gestionar eventos (lista, detalle, reservas, estado, dashboards).
- Backend relacionado: `eventSystem_Back` (repo separado). El frontend comunica con el backend mediante llamadas POST al dispatcher: el body es `{ tx, params }`.

## Arquitectura general

- Frameworks: Vite, React, TypeScript (strict).
- Estilo: Tailwind CSS (elegido para MVP por rapidez y consistencia en UI). Ver sección "Estilos".
- Enfoque: arquitectura modular por Business Objects (BOs). Cada BO tiene su propio submódulo con APIs, hooks, tipos y páginas.
- Comunicación con backend: único endpoint dispatcher.

Contrato de llamadas (resumen):
- URL base (ejemplo): `http://localhost:3000/api` (configurable vía env).
- Método: POST
- Body JSON: `{ "tx": "Objeto.metodo", "params": [ ... ] }`
- Cookies de sesión: la app debe enviar `credentials: 'include'` en las llamadas fetch para compartir cookies de sesión.
- Headers: `Content-Type: application/json`.

Ejemplo conceptual de llamada (no es código de implementación):

fetch(VITE_API_BASE_URL, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ tx: 'Auth.login', params: [ { username, password } ] })
})

## Requisitos previos

- Node.js (v16+ recomendado).
- npm (o pnpm) instalado.
- El backend `eventSystem_Back` corriendo y accesible en `http://localhost:3000`.

## Instalación y ejecución (desarrollo)

Clonar el repo y ejecutar en PowerShell:

```powershell
# Clonar
git clone <url-del-repo> eventSystem_Front
cd "eventSystem_Front"

# Instalar dependencias (npm)
npm install

# Alternativa con pnpm
# pnpm install

# Ejecutar en modo desarrollo (Vite)
npm run dev

# Build de producción
npm run build
```

Los scripts esperados en `package.json` (ejemplos):
- `dev`: `vite`
- `build`: `vite build`
- `preview`: `vite preview`

## Configuración de entorno

Variables principales:
- `VITE_API_BASE_URL` (requerida en desarrollo): URL completa del dispatcher del backend. Ejemplo:

```env
VITE_API_BASE_URL="http://localhost:3000/api"
```

Notas importantes:
- Todas las llamadas al backend deben usar `credentials: 'include'` para enviar/recibir cookies de sesión gestionadas por `express-session` en el backend.
- No exponer tokens en el cliente. El backend usa sesiones y control de permisos (users, profiles, methods, profile_method_permissions).

## Estilos

Elección: Tailwind CSS.
- Razones: rápida composición de interfaces, consistencia entre desarrolladores, conveniencia para prototipado del MVP.
- Alternativa para fases posteriores: CSS Modules o diseño de sistema con componentes estilizados (styled-components) si se necesita encapsulación por componente.

## Estructura de carpetas (propuesta)

La organización se alinea a Business Objects (BOs) y permite crecimiento por dominios.

```
src/
├─ api/
│  ├─ client.ts            # helper genérico callTx(tx, params)
│  ├─ authApi.ts          # Auth.* wrappers
│  ├─ userApi.ts          # Users.* wrappers
│  └─ eventApi.ts         # Event.* wrappers
├─ features/
│  ├─ auth/
│  │  ├─ pages/           # Login, etc.
│  │  ├─ components/
│  │  └─ hooks/
│  ├─ event/              # BO: Event
│  │  ├─ pages/           # lista, detalle/dashboard, crear/editar
│  │  ├─ components/
│  │  └─ hooks/
│  └─ common/             # helpers compartidos
├─ components/            # componentes UI compartidos (Table, Modal, Button)
├─ layout/                # Layout principal, Nav, Sidebar
├─ routes/                # configuración de rutas (React Router)
├─ store/                 # Context API o estado global ligero
├─ hooks/                 # hooks globales reutilizables
├─ types/                 # tipos globales y por BO
├─ assets/
└─ main.tsx

public/
README.md
package.json
```

Explicación breve:
- `api/`: capa de comunicación con el dispatcher. `client.ts` expondrá `callTx(tx, params)` que internamente usará `fetch` con `credentials: 'include'`.
- `features/<bo>/`: cada BO agrupa sus páginas, componentes, hooks y tipos.
- `components/`: componentes UI reutilizables entre BOs.
- `store/`: si se necesita estado global (por ejemplo, sesión/usuario), preferir Context API con hooks.

## APIs (métodos del dispatcher) usados por el frontend (MVP)

Autenticación / usuario:
- `Auth.login` (login)
- `Auth.logout` (logout)
- `Auth.reloadSecurity` (refrescar permisos/seguridad)
- `Users.me` (obtener datos de usuario logueado)

Event (BO1 - foco del MVP):
- `Event.list` (lista de eventos)
- `Event.get` (detalle de evento)
- `Event.create` (crear evento)
- `Event.update` (actualizar evento)
- `Event.changeStatus` (cambiar estado/estado de reserva)
- `Event.getDashboardSummary` (resumen/dashboard del evento)

## Flujo funcional inicial (MVP)

1. Login de usuario
   - Pantalla: `/login`
   - Llamada: `Auth.login` -> backend crea sesión en cookie.
   - Tras login, llamar `Users.me` para obtener perfil y permisos.

2. Obtención de datos del usuario
   - Llamada: `Users.me`
   - Uso: mostrar nombre, permisos y condicionar rutas/acciones.

3. Lista de eventos
   - Pantalla: `/events`
   - Llamada: `Event.list`
   - Mostrar tabla con operaciones permitidas según permisos.

4. Detalle / Dashboard del evento
   - Pantalla: `/events/:id`
   - Llamada: `Event.get`, `Event.getDashboardSummary`
   - Mostrar resumen, reservas y estado.

5. Crear / editar evento (fases siguientes)
   - Pantallas: `/events/new`, `/events/:id/edit`
   - Llamadas: `Event.create`, `Event.update`

6. Cambio de estado
   - Llamada: `Event.changeStatus`
   - Uso: activar/cancelar/reservar lugares, con control por permisos.

## Pantallas prioritarias para el MVP

- Login (Auth)
- Lista de eventos (Event.list)
- Detalle / Dashboard de evento (Event.get, Event.getDashboardSummary)

Pantallas para siguientes fases:
- Crear evento
- Editar evento
- Gestión de personas/roles
- Pagos y reportes avanzados

## Flujo de ejemplo (detallado)

1. Usuario accede a `/login` y completa credenciales.
2. Frontend hace `callTx('Auth.login', [{ username, password }])` con `credentials: 'include'`.
3. Backend responde y setea cookie de sesión.
4. Frontend hace `callTx('Users.me', [])` para obtener datos y permisos.
5. Dependiendo de permisos, frontend muestra enlaces a las páginas de Event.
6. En `/events`, frontend solicita `callTx('Event.list', [filters])` y renderiza la tabla.

## Convenciones de código (breve)

- TypeScript: activar `strict` y tipos en los props y respuestas de API.
- Componentes: usar componentes funcionales y hooks.
- Hooks: `useAuth`, `useEvents` para abstracciones de lógica y llamadas API.
- API: centralizar en `api/client.ts` la función `callTx(tx, params)` y wrappers por BO en `api/*.ts`.
- Formatos: Prettier/ESLint con reglas compartidas del equipo.

## Flujo de trabajo con Git

- Ramas principales:
  - `main`: código estable listo para producción.
  - `develop`: integración y pruebas del equipo.
  - `feature/<ticket>`: ramas para nuevas funcionalidades.
- Cada PR debe incluir descripción, referencia a ticket, y al menos 1 review de otro desarrollador.
- Revisión de PR: pruebas locales y comprobar que no rompe rutas ni flujos de login.

## Seguridad y permisos

- No almacenar credenciales en localStorage.
- Confiar en sesiones gestionadas por cookies (backend). Siempre usar `credentials: 'include'`.
- El backend controla acceso por `profiles` y `profile_method_permissions`; el frontend debe mostrar/ocultar acciones según los permisos que `Users.me` devuelva.

## Roadmap (funcionalidades futuras)

- BOs adicionales: Person (personales), Venue (lugares), Booking (reservas detalladas).
- Gestión de roles y permisos desde UI (profiles & methods).
- Integración de pasarela de pagos y facturación.
- Reportes avanzados y exportación (CSV/PDF).
- Internationalization (i18n) y soporte multi-idioma.
- Tests E2E (Cypress) y pruebas unitarias más completas.

## Notas para el equipo (3 devs frontend)

- Mantener el `api/client.ts` como la única entrada para llamadas al dispatcher.
- Componentes UI deben ser lo más desacoplados posible; preferir props y callbacks.
- Usa `tailwind.config.js` para tokens de diseño compartidos.
- Compartir patrones de diseño/UX tempranamente en PRs para coherencia.

---

Si quieres, puedo:
- Añadir plantillas de `client.ts`, `authApi.ts` y `eventApi.ts` (esqueleto) en el repo.
- Crear la estructura de carpetas y archivos iniciales con Vite + Tailwind configurado.

Indica si quieres que proceda a generar el scaffolding inicial (Vite + TS + Tailwind) y/o plantillas de API y hooks. ¡Puedo generar y validar los archivos ya en tu workspace!
