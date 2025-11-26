**Proyecto**: Backend para tienda (eccomerce)

**Descripción**:

- **Qué es:** Backend REST construido con NestJS y Prisma para una tienda online (productos, categorías, usuarios y pedidos).
- **Propósito:** servir como API para una aplicación frontend o móviles; incluye autenticación segura (JWT + refresh tokens con rotación) y persistencia en PostgreSQL via Prisma.

**Dominios / Módulos principales**

- **Usuarios (`users`)**: registro, login, gestión de perfil. IDs en formato UUID.
- **Productos (`products`)**: CRUD de productos (nombre, precio, categoría).
- **Pedidos (`orders`)**: creación y consulta de pedidos (módulo scaffolded).
- **Autenticación (`auth`)**: login/register, access tokens JWT y refresh tokens seguros (almacenados por sesión en tabla `RefreshToken`, rotación y detección de reuse).
- **Prisma (`prisma`)**: ORM/cliente para PostgreSQL. Modelo principal: `User`, `Product`, `Category`, `Order`, `RefreshToken`.

**Características (basadas en dependencias instaladas)**

- **NestJS**: estructura modular, inyección de dependencias y controladores.
- **Prisma**: modelado y migraciones de BD; cliente autogenerado (`@prisma/client`).
- **Autenticación**: `@nestjs/jwt`, `passport-jwt` y estrategias `jwt` y `jwt-refresh`.
- **Refresh tokens seguros**: cookies `HttpOnly` para refresh tokens, rotación y hash almacenado en BD (tabla `RefreshToken`) para múltiples dispositivos.
- **Validación**: `class-validator` y `class-transformer` para DTOs.
- **Seguridad HTTP**: `helmet` para cabeceras seguras, `cors` habilitado.
- **Logging**: `morgan` para logs HTTP en desarrollo.
- **Rate limiting**: `@nestjs/throttler` para evitar abuso en endpoints sensibles (login, refresh, register).
- **Cookie parsing**: `cookie-parser` para manejo de cookies en refresh flow.

**Variables de entorno esperadas** (archivo `./.env`)

- `DATABASE_URL` — URL de Postgres (ej: `postgresql://user:pass@localhost:5432/eccomerce?schema=public`).
- `JWT_SECRET` — secreto para firmar tokens JWT.
- `ACCESS_TOKEN_EXPIRES_IN` — duración del access token (ej. `1h`).
- `REFRESH_TOKEN_EXPIRES_IN` — duración del refresh token (ej. `7d`).
- `PORT` — puerto de la app (opcional, default `3000`).

**Comandos útiles**

- Instalar dependencias:
  - `npm install`
- Iniciar en desarrollo:
  - `npm run start:dev`
- Build de producción:
  - `npm run build`
  - `npm run start:prod`
- Prisma (migraciones / cliente):
  - `npx prisma generate` — genera `@prisma/client`.
  - `npx prisma migrate dev --name <name>` — crear y aplicar migración (dev).
  - `npx prisma db push` — empuja esquema sin crear migración (útil en prototipos).
  - `npx prisma studio` — inspeccionar base de datos.

**Flujo de autenticación (resumen)**

- `POST /auth/register` -> crea usuario + devuelve `access_token` y setea cookie `refresh_token` HttpOnly.
- `POST /auth/login` -> valida credenciales -> devuelve `access_token` y setea cookie `refresh_token` HttpOnly.
- `POST /auth/refresh` -> usa cookie `refresh_token` -> rota refresh token, emite nuevo access token y cookie rota.
- `POST /auth/logout` -> revoca la sesión (refresh token) y borra la cookie.

**Seguridad y recomendaciones**

- En producción usa HTTPS (cookie `secure: true`) y `SameSite=strict` para cookies de refresh.
- Guarda secrets y `.env` fuera de repositorio (`.env` ya está en `.gitignore`).
- Considera usar Redis para throttling y almacenamiento de sesiones si despliegas en múltiples instancias.

**Próximos pasos sugeridos**

- Añadir endpoints para listar y revocar sesiones por usuario (`/auth/sessions`).
- Añadir tests e2e para cubrir el flujo `register -> login -> refresh -> logout`.
- Documentar contratos de API (OpenAPI/Swagger).

**Contacto / notas**

- Repo generado con NestJS + Prisma; los archivos principales son: `src/auth`, `src/users`, `src/products`, `src/categories`, `prisma/schema.prisma`.

---

_Generado automáticamente según las dependencias instaladas en `package.json`._

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
