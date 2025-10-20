## app structure 
src/
├── domain/                     # Modelos y tipos del dominio
│   └── Sensor.ts               # Definición del tipo Sensor
│
├── application/                # Lógica de la aplicación (servicios, casos de uso)
│   ├── sensorService.ts        # Funciones CRUD y lógica de sensores
│   └── authService.ts          # Funciones de login/logout
│
├── infrastructure/             # Acceso al backend, almacenamiento, NATS
│   ├── mockBackend.ts          # Backend simulado (simula DB)
│   ├── natsClient.ts           # Conexión a NATS
│   └── storage.ts              # Helpers para localStorage/sessionStorage
│
├── lib/                        # Componentes reutilizables y utilidades
│   ├── components/
│   │   ├── SensorTable.svelte
│   │   ├── SensorForm.svelte
│   │   └── LoginForm.svelte
│   └── utils/
│       └── validators.ts
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

## npm packages

- nats.ws  // socket
- uuid      // Universally Unique Identifier

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

