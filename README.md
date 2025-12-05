# eventSystem

Sistema de control y gestión de eventos que permite administrar reservas de lugares, registro de personas, asignación de personal, pagos, gastos, reportes y asistencia.

## 🚀 Tecnologías

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL
- **Seguridad**: helmet, cors, express-rate-limit, express-session
- **Validación**: Zod
- **Autenticación**: bcryptjs

### Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **Lenguaje**: TypeScript
- **Routing**: React Router v7
- **Estilos**: CSS Moderno

---

## 📐 Arquitectura

El proyecto sigue un patrón de **Business Objects (BO)** con un dispatcher centralizado:

### Flujo de Comunicación

```
Frontend → API Call (tx = "Objeto.metodo") → Backend /api → Dispatcher → BO → Database
```

1. **Frontend**: Los componentes React invocan métodos de los BOs del cliente
2. **API Layer**: Las llamadas se envían al endpoint `/api` con formato `{ tx: "NombreBO.metodo", payload: {...} }`
3. **Dispatcher**: El backend resuelve dinámicamente qué BO y método ejecutar
4. **Business Objects**: Cada BO encapsula la lógica de negocio de un dominio específico
5. **Database**: PostgreSQL almacena toda la información del sistema

### Business Objects Disponibles

**Backend** (`eventSystem_Back/src/BO/`):

- `Auth.js` - Autenticación y sesiones
- `Users.js` - Gestión de usuarios
- `Events.js` - Eventos
- `Reservations.js` - Reservas de lugares
- `Registrations.js` - Registro de asistentes
- `Staffing.js` - Asignación de personal
- `Roles.js` - Roles de personal
- `Payments.js` - Pagos
- `Expenses.js` - Gastos
- `Reports.js` - Reportes financieros y de asistencia
- `Attendance.js` - Control de asistencia

**Frontend** (`eventSystem_Front/src/BO/`):

- Wrappers de cliente que se comunican con el backend vía `/api`

### Seguridad

- **Autenticación basada en sesiones**: express-session con almacenamiento en PostgreSQL
- **Control de acceso**: Sistema de perfiles y permisos por usuario
- **Protección de rutas**: Middleware de autenticación en backend y frontend
- **Rate limiting**: Protección contra ataques de fuerza bruta

---

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- PostgreSQL (instancia corriendo con base de datos ya configurada)

---

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/jdvillasmil/eventSystem.git
cd eventSystem
```

### 2. Configurar Backend

```bash
cd eventSystem_Back
npm install
```

**Configurar variables de entorno:**

Crea un archivo `.env` en `eventSystem_Back/` con el siguiente contenido:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_base_datos
SESSION_SECRET=tu_secreto_aleatorio_seguro
PORT=3000
```

> **Nota**: La base de datos debe estar previamente configurada con todas las tablas y datos necesarios.

**Iniciar el servidor:**

```bash
npm run dev    # Modo desarrollo con auto-reload
# o
npm start      # Modo producción
```

El servidor estará disponible en `http://localhost:3000`

### 3. Configurar Frontend

En una nueva terminal:

```bash
cd eventSystem_Front
npm install
```

**Iniciar el servidor de desarrollo:**

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

---

## 🔄 Flujo Principal

### 1. Autenticación

- El usuario accede a la página de login
- Ingresa credenciales (usuario/contraseña)
- El backend valida y crea una sesión
- El usuario es redirigido al dashboard

### 2. Navegación

- **Dashboard**: Vista principal con resumen del sistema
- **Eventos**: Gestión de eventos (crear, editar, listar)
- **Reservaciones**: Reserva de lugares para eventos
- **Registros**: Registro de asistentes a eventos
- **Personal**: Asignación de staff y roles
- **Asistencia**: Control de asistencia de registrados
- **Reportes**: Reportes financieros y de asistencia
- **Gastos**: Registro y seguimiento de gastos

### 3. Comunicación Frontend-Backend

Todas las operaciones siguen el patrón:

```typescript
// Frontend
const result = await Events.list();

// Se traduce a:
POST /api
{
  "tx": "Events.list",
  "payload": {}
}

// Backend dispatcher resuelve:
const [boName, method] = tx.split('.');
const BO = require(`./BO/${boName}`);
const result = await BO[method](ctx, payload);
```

### 4. Seguridad y Permisos

- Cada usuario tiene un perfil asignado
- Los perfiles tienen permisos específicos sobre operaciones
- El middleware de seguridad valida permisos antes de ejecutar operaciones
- Las rutas protegidas requieren autenticación activa

---

## 📂 Estructura del Proyecto

```
eventSystem/
├── eventSystem_Back/          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── BO/               # Business Objects
│   │   ├── data/             # Capa de acceso a datos
│   │   ├── middlewares/      # Middlewares de Express
│   │   ├── services/         # Servicios auxiliares
│   │   ├── utils/            # Utilidades
│   │   └── server.js         # Punto de entrada
│   ├── configs/              # Configuraciones
│   ├── public/               # Archivos estáticos
│   └── package.json
│
└── eventSystem_Front/         # Frontend (React + Vite)
    ├── src/
    │   ├── BO/               # Wrappers de Business Objects
    │   ├── components/       # Componentes React
    │   ├── context/          # Contextos (Auth, etc.)
    │   ├── pages/            # Páginas de la aplicación
    │   └── main.tsx          # Punto de entrada
    └── package.json
```

---

## 🧪 Desarrollo

### Backend

```bash
# Modo desarrollo con auto-reload
npm run dev

# Verificar sintaxis
node --check src/server.js
```

### Frontend

```bash
# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## Contribuidores

- [Carlos Diaz](https://github.com/cgds1)
- [Juan Villasmil](https://github.com/jdvillasmil)
- [Alberto Martinez](https://github.com/Betico1323)
- [Renny Zambrano](https://github.com/zambranorenn)
