## Iot Senors App 


Aplicación demo para la gestión y visualización de sensores IoT. 

## Índice

<a href='#inicio-rápido'>Inicio rápido</a>
<br/>
<a href='#estructura-del-proyecto'>Estructura del proyecto</a>
<br/>
<a href='#npm-packages'>Paquetes NPM utilizados</a>
<br/>
<a href='#credenciales-de-prueba'>credenciales</a>
<br/>


## Inicio rápido

###  Requisitos

Antes de ejecutar la aplicación, asegúrate de tener instaladas las siguientes herramientas:


| **Node.js**  ≥ `v24.8.0`  `node -v` 
| **npm**  ≥ `11.6.0`  `npm -v` 
| **nodemon**  ≥ `3.1.10`  `nodemon -v` 
| **Git**  última  `git --version` 

> 💡 Si alguno de estos programas no está instalado, sigue la guía de instalación más abajo.

```bash

# MacOs

# Instalar Node.js y nodemon
brew install node
npm install -g nodemon

#------------------------

# Linux (Ubuntu / Debian)
sudo apt update
sudo apt install -y nodejs npm
sudo npm install -g nodemon

#-------------------------

# Window

# 1️⃣ Descarga e instala Node.js desde:
# 👉 https://nodejs.org/es/download/
# 2️⃣ Abre PowerShell como administrador y ejecuta:

# Abre PowerShell como administrador y ejecuta:
npm install -g nodemon

```
### Ejecución rápida

Una vez instalado Node, npm y Nodemon, puedes iniciar la aplicación con:

Copia y pega este script en tu terminal.

```bash
git clone git@github.com:manuel-crispino/iot-sensors-app.git
cd iot-sensors-app
npm i
npm run quick

```

## Credenciales de prueba

Puedes iniciar sesión con las siguientes credenciales:
username: admin
password: password


## Estructura del proyecto
```bash
src/
├── application/                # Lógica de la aplicación (servicios, casos de uso)
│   ├── sensorService.ts        # Funciones CRUD y lógica de sensores
│
├── domain/                     # Modelos y tipos del dominio
│   └── form.ts                 # Definición del tipo form
│   └── sensor.ts               # Definición del tipo Sensor
│   └── user.ts                 # Definición del tipo User
│
├── infrastructure/             # Acceso a backend, almacenamiento, NATS
│   ├── mockDatabase.ts         # Backend simulado (simula DB)
│
├── lib/
│   └── components/             # Componentes reutilizables
│       ├── auth/               # Componentes específicos de autenticación
│       │   ├── LoginForm.svelte
│       │
│       ├── common/             # Componentes genéricos reutilizables
│       │   ├── Button.svelte
│       │   ├── Card.svelte
│       │   ├── Form.svelte
│       │   ├── Input.svelte
│       │   └── Modal.svelte
│       │
│       ├── dashboard/          # Componentes específicos del dashboard
│       │   └── FilterSelect.svelte
│       │   ├── SensorForm.svelte
│       │   ├── TablaSensor.svelte
│       │
│       │
│       └── feedback/           # Componentes para UI dinámica o retroalimentación
│       │   ├── Loading.svelte
│       │   ├── Overlay.svelte
│       │
│       ├── layout/             # Componentes relacionados con el layout global
│       │   ├── Container.svelte
│       │   ├── Footer.svelte
│       │   ├── Nav.svelte
│
├── routes/                     # Páginas y layout de SvelteKit
│   ├── +layout.svelte          # Layout global (header, footer, slot)
│   ├── login/
│   │   ├── +page.svelte        # Página de login
│   │   
│   └── dashboard/
│       ├── +page.svelte        # Página del dashboard
│       └── +page.ts            # Función load, autenticación, fetch de sensores
│
└── stores/                     # Stores de Svelte (patrón Flux)
    ├── sensorsStore.ts         # Estado de los sensores y funciones reactivas
    └── authStore.ts            # Estado de autenticación del usuario
    └── themeStore.ts           # Estado de tema 

```
## npm packages 

- nats.ws   // socket
- uuid      // Universally Unique Identifier
- lucide-svelte // icons

## Data Flow (Clean + Flux)

La aplicación sigue un flujo **unidireccional de datos**, inspirado en la arquitectura **Clean Architecture** combinada con el patrón **Flux**.  
Esto garantiza una separación clara entre capas y facilita la escalabilidad.

🧩 Componentes Svelte (acciones / eventos)
<br/>
↓
<br/>
⚙️ Stores (sensorsStore / authStore)
<br/>
↓
<br/>
🧠 Capa de aplicación (sensorService / authService)
<br/>
↓
<br/>
🗄️ Capa de infraestructura (mockBackend / NATS)
<br/>
↓
<br/>
🔁 Retorno al Store → Actualización reactiva de la UI
<br/>

### Explicación por capas

- **UI Components** → Capturan la interacción del usuario (formularios, botones, etc.)  
- **Stores (Flux)** → Mantienen el estado global y notifican cambios a la UI  
- **Application Layer** → Contiene la lógica de negocio (casos de uso, validaciones, etc.)  
- **Infrastructure Layer** → Se comunica con el backend o servicios externos (mock DB, NATS, etc.)  
- **UI Update** → Cuando el store cambia, la UI se actualiza automáticamente gracias a la reactividad de Svelte  
