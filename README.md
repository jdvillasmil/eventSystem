# Sistema de Gestión de Eventos

Bienvenido al repositorio del **Sistema de Gestión de Eventos**. Esta aplicación web permite administrar eventos, reservas y usuarios de manera eficiente, proporcionando una interfaz moderna y una arquitectura robusta.

## 🚀 Tecnologías Utilizadas

El proyecto está construido utilizando un stack moderno y escalable:

### Backend (`eventSystem_Back`)
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Base de Datos**: PostgreSQL (vía `pg` y `connect-pg-simple`)
-   **Seguridad**: `helmet`, `cors`, `express-rate-limit`
-   **Validación**: `zod`

### Frontend (`eventSystem_Front`)
-   **Framework**: React (v19)
-   **Build Tool**: Vite
-   **Lenguaje**: TypeScript / JavaScript
-   **Estilos**: CSS Moderno / TailwindCSS (según configuración)
-   **Routing**: React Router v7

---

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente antes de comenzar:
-   [Node.js](https://nodejs.org/) (v18 o superior recomendado)
-   [NPM](https://www.npmjs.com/) (incluido con Node.js)
-   Una instancia de PostgreSQL corriendo (local o remota)

---

## 🛠️ Instalación y Configuración

Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

### 1. Clonar el Repositorio

```bash
git clone https://github.com/jdvillasmil/eventSystem.git
cd eventSystem
```

### 2. Configuración del Backend

Navega a la carpeta del backend e instala las dependencias:

```bash
cd eventSystem_Back
npm install
```

**Configuración de Base de Datos:**
1.  Crea un archivo `.env` en `eventSystem_Back` basado en tus credenciales de PostgreSQL.
2.  Ejecuta los scripts de inicialización (si es la primera vez):
    ```bash
    node scripts/setup_db.js
    node scripts/seed_data.js
    ```

### 3. Configuración del Frontend

En una nueva terminal, navega a la carpeta del frontend e instala las dependencias:

```bash
cd eventSystem_Front
npm install
```

---

## ▶️ Ejecución

Para iniciar la aplicación, necesitarás dos terminales abiertas (una para el backend y otra para el frontend).

### Iniciar Backend
Desde `eventSystem_Back`:
```bash
npm run dev
```
*El servidor iniciará en modo vigilancia (watch mode).*

### Iniciar Frontend
Desde `eventSystem_Front`:
```bash
npm run dev
```
*Vite iniciará el servidor de desarrollo, generalmente en `http://localhost:5173`.*

---

## 📂 Estructura del Proyecto

-   `/eventSystem_Back`: Contiene toda la lógica del servidor, API REST, conexión a base de datos y Business Objects (BO) del lado del servidor.
-   `/eventSystem_Front`: Contiene la interfaz de usuario (SPA) construida con React, incluyendo páginas, componentes y la integración con los BOs.

## 👥 Autores

Desarrollado por el equipo de **Web 2**.
