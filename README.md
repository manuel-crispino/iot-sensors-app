## Iot Senors App 

<a href='#quick-start'>Quick start</a>
<br/>
<a href='#app-structure'>App structure</a>
<br/>
<a href='#npm-packages'>Npm packages</a>
<br/>


## Quick start 

Copia y pega este script en tu terminal.

```bash
git clone git@github.com:manuel-crispino/iot-sensors-app.git
cd iot-sensors-app
npm i
npx vite --open

```


## app structure 
```bash
src/
├── domain/                     # Modelos y tipos del dominio
│   └── Sensor.ts               # Definición del tipo Sensor
│   └── User.ts                 # Definición del tipo User
│
├── application/                # Lógica de la aplicación (servicios, casos de uso)
│   ├── sensorService.ts        # Funciones CRUD y lógica de sensores
│   └── authService.ts          # Funciones de login/logout
│
├── infrastructure/             # Acceso a backend, almacenamiento, NATS
│   ├── mockDatabase.ts         # Backend simulado (simula DB)
│   ├── natsClient.ts           # Conexión a NATS
│   └── storage.ts              # Helpers para localStorage/sessionStorage
│
├── lib/
│   └── components/             # Componentes reutilizables
│       ├── common/             # Componentes genéricos reutilizables
│       │   ├── Button.svelte
│       │   ├── Input.svelte
│       │   ├── Heading.svelte
│       │   └── Modal.svelte
│       │
│       ├── layout/             # Componentes relacionados con el layout global
│       │   ├── Navbar.svelte
│       │   ├── Footer.svelte
│       │   └── Sidebar.svelte
│       │
│       ├── auth/               # Componentes específicos de autenticación
│       │   ├── LoginForm.svelte
│       │   └── RegisterForm.svelte
│       │
│       ├── dashboard/          # Componentes específicos del dashboard
│       │   ├── SensorTable.svelte
│       │   ├── SensorForm.svelte
│       │   └── SensorCard.svelte
│       │
│       └── feedback/           # Componentes para UI dinámica o retroalimentación
│           ├── LoadingSpinner.svelte
│           ├── Toast.svelte
│           └── Alert.svelte
│
├── routes/                     # Páginas y layout de SvelteKit
│   ├── +layout.svelte          # Layout global (header, footer, slot)
│   ├── login/
│   │   ├── +page.svelte        # Página de login
│   │   └── +page.ts            # Función load (opcional)
│   └── dashboard/
│       ├── +page.svelte        # Página del dashboard
│       └── +page.ts            # Función load, autenticación, fetch de sensores
│
└── stores/                     # Stores de Svelte (patrón Flux)
    ├── sensorsStore.ts         # Estado de los sensores y funciones reactivas
    └── authStore.ts            # Estado de autenticación del usuario

```
## npm packages 

- nats.ws   // socket
- uuid      // Universally Unique Identifier
- lucide-svelte // icons

## Data (Clean + Flux)

User interaction (UI components)
       ↓
       Actions / Event handlers
       ↓
    Store (sensorsStore / authStore)
       ↓
  Application layer (sensorService / authService)
       ↓
 Infrastructure layer (mockBackend / NATS)
       ↓
       Back to Store → UI updates
