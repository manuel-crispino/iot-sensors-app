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

Copia y pega este script en tu terminal.

```bash
git clone git@github.com:manuel-crispino/iot-sensors-app.git
cd iot-sensors-app
npm i
npx vite --open

```

## Credenciales de prueba

Puedes iniciar sesión con las siguientes credenciales:
username: admin
password: password


## Estructura del proyecto
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
│       ├── auth/               # Componentes específicos de autenticación
│       │   ├── LoginForm.svelte
│       │
│       ├── common/             # Componentes genéricos reutilizables
│       │   ├── Button.svelte
│       │   ├── Form.svelte
│       │   ├── Card.svelte
│       │   ├── Input.svelte
│       │   └── Modal.svelte
│       │
│       ├── dashboard/          # Componentes específicos del dashboard
│       │   ├── SensorTable.svelte
│       │   ├── SensorForm.svelte
│       │   └── SensorCard.svelte
│       │
│       │
│       └── feedback/           # Componentes para UI dinámica o retroalimentación
│       │   ├── Loading.svelte
│       │   ├── Overlay.svelte
│       │
│       ├── layout/             # Componentes relacionados con el layout global
│       │   ├── Container.svelte
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
