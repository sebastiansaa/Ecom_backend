# Módulo de Productos (Products Domain)

Este módulo implementa la gestión de productos siguiendo una **Arquitectura en Capas** estricta, diseñada para ser escalable, mantenible y fácil de probar. Es un ejemplo canónico de cómo estructurar un recurso en NestJS con Prisma.

## 🏗 Arquitectura y Flujo de Datos

El flujo de datos es unidireccional y cada capa tiene una responsabilidad única (**Separation of Concerns**):

`Request` ➡️ **Controller** ➡️ **Service** ➡️ **Repository** ➡️ **Database**

### 1. Capa de Presentación (Controller)

- **Archivo**: [`products.controller.ts`](./products.controller.ts)
- **Responsabilidad**: Recibir peticiones HTTP, validar DTOs y coordinar la respuesta.
- **Regla de Oro**: **NO** contiene lógica de negocio. Solo coordina.

### 2. Capa de Negocio (Service)

- **Archivo**: [`products.service.ts`](./products.service.ts)
- **Responsabilidad**: El "cerebro" del módulo. Contiene todas las reglas de negocio, validaciones lógicas y orquestación.
- **Regla de Oro**: **NO** accede a la base de datos directamente (usa el Repository). **NO** maneja HTTP directamente.

### 3. Capa de Datos (Repository)

- **Archivo**: [`products.repository.ts`](./products.repository.ts)
- **Responsabilidad**: Abstraer el acceso a datos. Es el único componente que interactúa con `PrismaService`.
- **Beneficio**: Si mañana cambias de ORM o base de datos, solo tocas este archivo. El Service no se entera.

### 4. Transformación (Mappers & Entities)

- **Mapper** ([`mappers/product.mapper.ts`](./mappers/product.mapper.ts)): Convierte datos entre capas (DTO ↔ Entity ↔ Prisma Input). Mantiene el Service limpio de "fontanería" de datos.
- **Entity** ([`entities/product.entity.ts`](./entities/product.entity.ts)): Representación pura del dominio. Controla qué datos se exponen al cliente (ej. ocultar campos sensibles, formatear fechas).

## Estructura de Archivos

```text
src/products/
├── dto/                # Contratos de entrada/salida (Validación con class-validator)
├── entities/           # Modelos de dominio (Salida controlada)
├── helpers/            # Funciones puras de utilidad (Validaciones, normalizaciones)
├── interfaces/         # Tipos de TypeScript compartidos
├── mappers/            # Convertidores de objetos (Pattern Mapper)
├── products.controller.ts
├── products.module.ts
├── products.repository.ts
└── products.service.ts
```

## Buenas Prácticas Implementadas

1.  **Inyección de Dependencias**:
    - `ProductsModule` provee `ProductsService` y `ProductsRepository`.
    - El acoplamiento es bajo y la testabilidad alta.

2.  **Validación Declarativa**:
    - Uso de DTOs con decoradores (`@IsString`, `@Min`, etc.) para validar datos antes de que lleguen al Service.

3.  **Tipado Estricto (TypeScript)**:
    - No se usa `any`.
    - Interfaces claras para entradas y salidas.
    - Uso de `unknown` y Type Guards para el manejo de errores.

4.  **Helpers Puros**:
    - Las funciones en `helpers/` son puras (sin efectos secundarios ni dependencias de clases), lo que las hace fáciles de testear y reutilizar.

---
