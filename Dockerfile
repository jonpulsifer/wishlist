# Builder and runner deliberately share one base. Prisma's generator defaults to
# `native`, so the query engine baked into the standalone output is built for the
# builder's libc. The previous split (alpine builder -> debian distroless runner)
# shipped a musl engine into a glibc runtime.
FROM oven/bun:1.3.14-alpine@sha256:5acc90a93e91ff07bf72aa90a7c9f0fa189765aec90b47bdbf2152d2196383c0 AS base
# libc6-compat and openssl are what Prisma's engine needs on alpine.
RUN apk add --no-cache libc6-compat openssl

FROM base AS builder
ENV STANDALONE=1
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# First install the dependencies (as they change less often).
# The root `postinstall` runs `prisma generate`, which is why prisma/ is copied first.
COPY package.json bun.lock ./
COPY prisma ./prisma
RUN bun install --frozen-lockfile

# Build the project
COPY . .
RUN \
  --mount=type=secret,id=DATABASE_URL \
  DATABASE_URL=$(cat /run/secrets/DATABASE_URL) \
  bun --bun next build

FROM base AS runner
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static
COPY --from=builder --chown=bun:bun /app/public ./public

USER bun
EXPOSE 3000

CMD ["bun", "server.js"]
