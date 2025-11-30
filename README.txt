Arquitectura NestJS + Prisma: Guía del Proyecto
Este documento define la arquitectura en capas del proyecto, enfocada en la Separación de Responsabilidades (SoC), el flujo de datos limpio y la robustez, utilizando Prisma como capa de acceso a datos.

Principio                                       
Separación de Responsabilidades (SoC): "Cada componente (Controller, Service, Mapper) tiene una única tarea definida. La lógica de negocio reside exclusivamente en el Service."

Flujo de Datos Limpio: "Los datos se transforman progresivamente (DTO → Input Prisma → Record Prisma → Response DTO) utilizando Mappers y Entities, manteniendo la pureza del Service."

Integridad Transaccional: "Se utiliza el manejo de transacciones de Prisma (this.prisma.$transaction()) para garantizar la atomicidad de las operaciones complejas de negocio."

Manejo de Errores Predictivo: "Los errores de infraestructura (Prisma) se mapean a excepciones HTTP estándar (NestJS) para proporcionar respuestas claras al cliente."
---------------------------------------------------------------------------------

Componentes y Responsabilidades
Esta sección detalla la función de cada capa de la aplicación, desde la interfaz hasta la base de datos.

A. Capa de Presentación (HTTP)
Controller (Coordinación de la API)
        El Controller solo se encarga de la Coordinación de la API (HTTP).
        Coordina los DTOs, los parámetros (params) y los Pipes.
        Utiliza Pipes tipados (ej: ParseIntPipe).
        Restricción: Nada de lógica de negocio.

B. Capa de Negocio (Core)
Service (Lógica de Negocio y Reglas)
        El Service es el núcleo de la aplicación, responsable de la Lógica de Negocio y Reglas.
        Contiene todas las reglas de negocio.
        Realiza validaciones de existencia/unicidad (slug, categoría, etc.).
        Implementa Logging con metadata (id de usuario, slug, etc.).
        Interactúa solo con el Repository, nunca directamente con PrismaService.

Entity (Control de Exposición de Datos)
        La Entity se enfoca en el Control de Exposición de Datos.
        Controla qué campos del registro de la base de datos se exponen al resto de la aplicación.
        Convierte registros de Prisma a un objeto de dominio.

C. Capa de Datos (Acceso y Transformación)
Repository (Abstracción de Datos) 
        El Repository es la capa que aísla el Service de la tecnología de la base de datos (Prisma).
        Implementa las consultas requeridas por el Service (ej: save(), findById()).
        Maneja transacciones (this.prisma.$transaction()) para operaciones compuestas.
        Es la única capa que interactúa directamente con PrismaService.
        Beneficio: Permite hacer mocking simple en las pruebas unitarias del Service.

Mappers (Transformación Pura de Datos)
        Los Mappers son responsables de la Transformación Pura de Datos.
        Son funciones o clases puras que transforman datos.
        Convierte DTO → Prisma Input (para persistencia).
        Convierte Prisma Record → DTO de Respuesta.
        Encapsula normalizaciones (precio, imágenes) para evitar if() repetitivos en el Service.
        Se deben guardar en una carpeta mappers.

PrismaService (Acceso a Datos Centralizado)
        El PrismaService se encarga del Acceso a Datos Centralizado.
        Maneja la conexión a la base de datos y proporciona los clients de Prisma al Repository.

D. Componentes Transversales
DTOs (Contratos y Validación Básica)
        Los DTOs (Data Transfer Objects) definen los Contratos y la Validación B        ásica.
        Define los contratos de entrada y salida de la API.
        Realiza validación declarativa de formato y rango (ej: @IsString(), @Min(0)).
        Restricción: No reglas de negocio complejas.

Helpers (Utilidades Puras)
        Los Helpers contienen Utilidades Puras.
        Funciones utilitarias reutilizables que no tienen dependencias de clase (ej: manejo de fechas, normalizaciones genéricas, validadores de negocio puros).

Prisma Schema (Definición de Esquema)
        El Prisma Schema se enfoca en la Definición de Esquema.
        Utiliza el tipo de dato Decimal para precios si se requiere precisión financiera.
---------------------------------------------------------------------------------------

3.      Buenas Prácticas Avanzadas (Escalabilidad y Seguridad)
        Para asegurar que el proyecto sea robusto y escalable a largo plazo:

3.1.    Organización y Modularidad
        Módulos por Característica (Feature Modules): Organizar el código en módulos auto-contenidos (ej: UsersModule, ProductsModule). Cada módulo debe contener su propio Controller, Service, DTOs y Mappers/Repository.
        Módulos Core/Shared: Centralizar servicios comunes (PrismaService, Helpers, Auth strategies) en módulos compartidos para evitar duplicación.

3.2.    Seguridad y Validación
        Pipes de Validación Global: Aplicar el ValidationPipe de NestJS de forma global (app.useGlobalPipes(new ValidationPipe())). Esto aplica la validación declarativa de los DTOs automáticamente a todos los endpoints.
        Guards para Autorización: Utilizar Guards (a nivel de Controller o Global) para gestionar la lógica de Autorización (roles y permisos), manteniendo esta preocupación fuera del Service.

3.3.            Performance y Testing
        Estrategia de Caching: Implementar una capa de caching (ej: usando Redis) controlada por el Service para reducir la latencia y la carga de la base de datos en consultas repetitivas.
        Testing Riguroso:
                Unitario: Enfocarse en el Service (probando la lógica de negocio, simulando el Repository).
                E2E (End-to-End): Probar el flujo completo HTTP a través del Controller y la interacción de todo el stack.
