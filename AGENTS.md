# Nuxt starter kit

A minimal [Nuxt 4](https://nuxt.com) app with server-side rendering, TypeScript, and Tailwind CSS. It has one page, a welcome screen, and one test. It's a starting point: build the app the user asks for on top of it.

## Commands

| Task                                   | Command                         |
| -------------------------------------- | ------------------------------- |
| Install dependencies                   | `npm install`                   |
| Run locally                            | `npm run dev`                   |
| Run the tests                          | `npm test`                      |
| Type check, lint, and check formatting | `npm run lint`                  |
| Fix formatting                         | `npm run format`                |
| Build for production                   | `npm run build`                 |
| Start the production build             | `node .output/server/index.mjs` |

Run `npm test` and `npm run lint` after every change. Both must pass.

## Structure

- `app/pages/` holds pages. Each `.vue` file becomes a route. `app/pages/index.vue` is the Laravel Cloud welcome screen; replace it with the app's own home page.
- `app/app.vue` is the root component. It renders the current page with `<NuxtPage />`.
- `server/api/` is where API routes go, as `defineEventHandler` files. It doesn't exist yet.
- `app/assets/css/main.css` imports Tailwind CSS, which the `@tailwindcss/vite` plugin in `nuxt.config.ts` compiles.
- `public/` holds files served from the site root.
- `tests/` holds Vitest tests. They use `@nuxt/test-utils/e2e`, which builds the app, serves it, and fetches pages, so each run takes a few seconds.

## Conventions

- Nuxt auto-imports components from `app/components/`, composables from `app/composables/`, and Vue and Nuxt APIs, so don't import them by hand.
- Fetch data in pages with `useFetch` or `useAsyncData` so it loads during server-side rendering.
- Put runtime configuration in `runtimeConfig` in `nuxt.config.ts`. Nuxt overrides it from `NUXT_`-prefixed environment variables, and only `runtimeConfig.public` reaches the browser.
- Add dependencies with `npm install` so `package-lock.json` stays in sync, and commit the lockfile.

## On Laravel Cloud

- Cloud detects Nuxt, builds with `npm run build`, and starts the server with `node .output/server/index.mjs`. The server reads `PORT` and listens on IPv4 and IPv6 by itself.
- The Node.js version comes from `engines.node` in `package.json` when the environment is created. After that it's set in the environment's settings in Cloud.
- Cloud sets `NUXT_PUBLIC_SITE_URL` to the environment's URL.

<!-- cloud:start -->

## Laravel Cloud

This app deploys to [Laravel Cloud](https://laravel.com/cloud) with no settings changed. Cloud detects the language and framework from the repository and fills in the build and start commands. Keep the app inside these rules so that stays true.

### Rules

- **Port:** listen on the port in the `PORT` environment variable (3000 if it's unset), on host `::` so both IPv4 and IPv6 connect. Cloud runs nginx on port 8080 in front of the app. Never hard-code a port.
- **Configuration:** read every setting from environment variables. In production Cloud sets them in the process environment; there's no `.env` file. `.env.example` lists what the app reads, for local development only.
- **No Dockerfile:** Cloud builds the image from the repository. Don't add a `Dockerfile`, `docker-compose.yml`, or `Procfile` unless this file says the kit uses one.
- **Ephemeral filesystem:** files written at runtime are lost on every deploy and restart, and replicas don't share them. Store data in a database, cache, or object storage.
- **Scale to zero:** an environment can sleep when idle and wake on the next request. Don't rely on in-memory state or timers in the web process.
- **Versions:** the language version is declared in the repository (see below). Change it there, and only to a version Cloud supports. An unsupported version fails the deploy.

### Adding resources

Attach resources to the environment in Cloud. Cloud injects their connection details as environment variables on the next deploy:

| Resource                   | Variables                                                                                    |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| Postgres or MySQL database | `DATABASE_URL`                                                                               |
| Valkey cache               | `REDIS_URL`                                                                                  |
| Object storage bucket      | `AWS_BUCKET`, `AWS_ENDPOINT_URL`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` |

The Postgres `DATABASE_URL` ends in a `serverVersion` query parameter. Some drivers reject unknown parameters, so remove it before connecting if the driver complains.

Run background work as a custom worker background process on the environment, with its own command. Run migrations in the environment's deploy command, not at app startup.

### Managing the app

Use the [Laravel Cloud CLI](https://laravel.com/cloud/docs/api/cli) to deploy, read logs, change environment variables, and attach resources. It needs PHP 8.3 or later and Composer. Install it with `composer global require laravel/cloud-cli`, then run `cloud skills:install` to add Laravel Cloud skills to your agent. Run `cloud auth`, or set `LARAVEL_CLOUD_TOKEN` where a browser login isn't possible, and pass `-n` to every command so it never waits for input. A Laravel Cloud MCP server is coming and will cover the same tasks.

Cloud's documentation for agents is at https://laravel.com/cloud/docs/llms.txt, and runtime details are at https://laravel.com/cloud/docs/runtimes.
<!-- cloud:end -->
