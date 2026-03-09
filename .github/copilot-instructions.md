# Copilot Instructions — CoreFlow

## Contexto del Proyecto
Estás ayudando a desarrollar **CoreFlow**, una aplicación de gestión financiera personal/empresarial.
El módulo inicial es **Cuentas por Cobrar**, con planes de expansión a Cuentas por Pagar,
cálculo de tiempo trabajado por hora, y otros módulos financieros.

El desarrollo se realiza con GitHub Copilot en modo agente (Claude Sonnet 4.6 en VS Code).
Genera siempre código completo, funcional y consistente con la arquitectura definida en este documento.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | Angular | 21 (latest) |
| Backend | NestJS + TypeScript | latest |
| ORM | Prisma | latest |
| Base de datos | MySQL | 8+ |
| Autenticación | JWT con `@nestjs/jwt` | — |
| Estilos | SCSS | — |
| Testing | Vitest (default Angular 21) | — |

---

## Características Angular 21 que DEBES usar

- **Zoneless Change Detection** — Zone.js está desactivado por defecto. Usa `OnPush` y Signals para reactividad
- **Signal Forms** — usar en lugar de `ReactiveFormsModule` tradicional para todos los formularios
- **Standalone Components** — todos los componentes son standalone, sin `NgModule`
- **HttpClient por defecto** — disponible globalmente sin configuración adicional
- **Control Flow nativo** — usar `@if`, `@for`, `@switch` en templates, NUNCA `*ngIf` o `*ngFor`
- **Angular MCP Server** — integrado con herramientas de IA para generación de código
- **Signals** — usar `signal()`, `computed()` y `effect()` para todo el estado local del componente

---

## Estructura de Carpetas

```
coreflow/
├── coreflow-api/              ← Proyecto NestJS
│   ├── src/
│   │   ├── auth/              ← Autenticación JWT
│   │   ├── usuarios/
│   │   ├── clientes/
│   │   ├── cuentas/
│   │   ├── cuenta-detalle/
│   │   ├── movimientos/
│   │   └── conceptos/
│   └── prisma/
│       └── schema.prisma      ← Fuente de verdad del modelo de datos
│
└── coreflow-app/              ← Proyecto Angular 21
    └── src/
        └── app/
            ├── core/          ← Guards, interceptors, servicios globales, auth
            ├── shared/        ← Componentes, pipes y directivas reutilizables
            └── modules/
                ├── dashboard/
                ├── clientes/
                ├── cuentas/
                ├── cuenta-detalle/
                ├── movimientos/
                └── conceptos/
```

Cada módulo contiene:
```
modulo/
├── components/    ← componentes visuales reutilizables del módulo
├── pages/         ← páginas/rutas del módulo
├── services/      ← servicio HTTP del módulo
└── interfaces/    ← tipos TypeScript del módulo
```

---

## Modelo de Base de Datos — `coreflow_db`

Estas son las tablas existentes. Prisma las importa con `prisma db pull`.

### `usuarios`
- `idUsuario` INT PK AUTO_INCREMENT
- `nombre` VARCHAR(100)
- `email` VARCHAR(100) UNIQUE
- `passwordHash` VARCHAR(255)
- `rol` ENUM('ADMIN', 'USUARIO') DEFAULT 'USUARIO'
- `activo` TINYINT(1) DEFAULT 1
- `fechaRegistro` DATETIME DEFAULT NOW()

### `clientes`
- `idCliente` INT PK AUTO_INCREMENT
- `idUsuario` INT FK → usuarios ← **aislamiento multi-usuario**
- `nombre`, `apellidoPaterno`, `apellidoMaterno` VARCHAR
- `telefono` VARCHAR(15)
- `email` VARCHAR(100)
- `tipo` ENUM('CLIENTE', 'PROVEEDOR', 'AMBOS')
- `activo` TINYINT(1)
- `fechaRegistro`, `fechaActualizacion` DATETIME

### `conceptos`
- `idConcepto` INT PK AUTO_INCREMENT
- `idUsuario` INT FK → usuarios (NULL = concepto global del sistema)
- `nombre` VARCHAR(100)
- `tipo` ENUM('PRODUCTO', 'SERVICIO', 'HORA_TRABAJO', 'OTRO')
- `precioDefault` DECIMAL(10,2)
- `activo` TINYINT(1)

### `cuentas`
- `idCuenta` INT PK AUTO_INCREMENT
- `idCliente` INT FK → clientes
- `tipo` ENUM('POR_COBRAR', 'POR_PAGAR')
- `estado` ENUM('ABIERTA', 'PAGADA', 'VENCIDA', 'CANCELADA')
- `descripcion` VARCHAR(200)
- `importeTotal` DECIMAL(10,2)
- `importePagado` DECIMAL(10,2)
- `saldo` DECIMAL(10,2) ← mantenido por triggers de BD
- `fechaEmision`, `fechaVencimiento`, `fechaActualizacion` DATETIME

### `cuenta_detalle`
- `idDetalle` INT PK AUTO_INCREMENT
- `idCuenta` INT FK → cuentas
- `idConcepto` INT FK → conceptos (nullable)
- `descripcion` VARCHAR(200)
- `tipoConcepto` ENUM('PRODUCTO', 'SERVICIO', 'HORA_TRABAJO', 'OTRO')
- `cantidad` DECIMAL(10,2)
- `precioUnitario` DECIMAL(10,2)
- `importe` DECIMAL(10,2) ← cantidad × precioUnitario
- `fecha` DATETIME

### `movimientos`
- `idMovimiento` INT PK AUTO_INCREMENT
- `idCuenta` INT FK → cuentas
- `tipo` ENUM('ABONO', 'CARGO', 'AJUSTE', 'CANCELACION')
- `importe` DECIMAL(10,2)
- `referencia` VARCHAR(100)
- `notas` VARCHAR(200)
- `fecha` DATETIME

---

## Reglas de Negocio

1. **Multi-usuario**: Cada cliente pertenece a un `idUsuario`. Todas las queries deben
   filtrar por el `idUsuario` extraído del JWT. Nunca exponer datos de otros usuarios.
2. **Saldo calculado por triggers**: `cuentas.saldo` se actualiza automáticamente en la BD
   al insertar en `cuenta_detalle` o `movimientos`. El backend NO recalcula el saldo manualmente.
3. **Importe en detalle**: `cuenta_detalle.importe` siempre es `cantidad × precioUnitario`.
   Calcularlo en el servicio antes de insertar.
4. **Conceptos globales**: Los conceptos con `idUsuario = NULL` son del sistema y visibles
   para todos los usuarios. Los demás son privados del usuario dueño.
5. **Estado de cuenta**: El trigger actualiza el estado a `PAGADA` automáticamente cuando
   `importePagado >= importeTotal`. El backend puede cambiar estado a `CANCELADA` o `VENCIDA`.

---

## Convenciones — Backend (NestJS)

- Cada recurso tiene su propio módulo: `*.module.ts`, `*.controller.ts`, `*.service.ts`
- DTOs con `class-validator` para toda entrada de datos:
  ```typescript
  export class CreateClienteDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsEnum(['CLIENTE', 'PROVEEDOR', 'AMBOS'])
    tipo: string;
  }
  ```
- Los servicios reciben `idUsuario: number` como parámetro en métodos que accedan a datos privados
- Usar `PrismaService` como servicio global inyectable
- Respuestas HTTP estandarizadas: `{ data, message, statusCode }`
- Manejo de errores con `HttpException` o filtros globales

---

## Convenciones — Frontend (Angular 21)

- **Todos los componentes son Standalone** — sin NgModule
- **Signals para todo el estado local**:
  ```typescript
  export class ClientesComponent {
    clientes = signal<Cliente[]>([]);
    loading  = signal(false);
    total    = computed(() => this.clientes().length);
  }
  ```
- **Signal Forms** para formularios:
  ```typescript
  form = signalForm({
    nombre: ['', Validators.required],
    email:  ['', Validators.email],
  });
  ```
- **Control flow nativo en templates**:
  ```html
  @if (loading()) {
    <app-spinner />
  } @else {
    @for (cliente of clientes(); track cliente.idCliente) {
      <app-cliente-card [cliente]="cliente" />
    }
  }
  ```
- Interceptor HTTP global que agregue `Authorization: Bearer <token>` a todas las requests
- `AuthGuard` que valide JWT almacenado en `localStorage` bajo la clave `coreflow_token`
- Servicios tipados con interfaces que reflejen exactamente los modelos del backend

---

## Autenticación

- El backend genera un JWT al hacer login con `email` + `password`
- El JWT incluye en el payload: `{ idUsuario, email, rol }`
- El frontend guarda el token en `localStorage` bajo la clave `coreflow_token`
- Todas las rutas del backend excepto `POST /auth/login` y `POST /auth/register` requieren JWT válido
- Usar `JwtAuthGuard` en todos los controladores protegidos

---

## Módulos Futuros Planificados

Considerar al diseñar para no bloquear expansión:

- **Cuentas por Pagar** — ya soportado en BD con `tipo ENUM('POR_COBRAR','POR_PAGAR')`
- **Tiempo trabajado** — usando `cuenta_detalle` con `tipoConcepto = 'HORA_TRABAJO'`
- **Reportes y dashboard** — resumen de saldos, cuentas vencidas, cobros del mes
- **Múltiples usuarios** — ya soportado con `idUsuario` en `clientes`

---

## Comandos de Referencia

```bash
# Importar schema existente desde la BD
npx prisma db pull

# Generar cliente Prisma
npx prisma generate

# Nuevo módulo NestJS completo
nest generate resource <nombre>

# Nuevo componente Angular 21 standalone
ng generate component modules/<nombre>/components/<nombre>
```

---

## Lo que NO debes hacer

- ❌ No usar `any` en TypeScript — tipar siempre correctamente
- ❌ No usar `*ngIf` ni `*ngFor` — usar `@if` y `@for` (Angular 21)
- ❌ No usar `NgModule` — todos los componentes son standalone
- ❌ No usar `Zone.js` ni depender de detección de cambios automática — usar Signals
- ❌ No usar `ReactiveFormsModule` tradicional — usar Signal Forms
- ❌ No calcular `saldo` en el backend — los triggers de BD lo manejan
- ❌ No guardar passwords en texto plano — usar `bcrypt` siempre
- ❌ No exponer `passwordHash` en ninguna respuesta HTTP
- ❌ No omitir el filtro `idUsuario` en queries de datos privados
- ❌ No usar `var` — solo `const` y `let`
