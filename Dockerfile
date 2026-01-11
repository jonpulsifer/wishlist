FROM node:22-alpine@sha256:0340fa682d72068edf603c305bfbc10e23219fb0e40df58d9ea4d6f33a9798bf AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat && yarn global add pnpm turbo@2

FROM base AS builder
ENV STANDALONE=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV TURBO_TELEMETRY_DISABLED=1
WORKDIR /app

# First install the dependencies (as they change less often)
COPY package.json pnpm-lock.yaml .
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

# Build the project
COPY . .
RUN \
  --mount=type=secret,id=DATABASE_URL \
  DATABASE_URL=$(cat /run/secrets/DATABASE_URL) \
  pnpm next build

FROM gcr.io/distroless/nodejs22-debian12:latest AS runner
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

COPY --from=builder --chown=65532:65532 /app/.next/standalone ./
COPY --from=builder --chown=65532:65532 /app/.next/static ./.next/static
COPY --from=builder --chown=65532:65532 /app/public ./public

USER 65532:65532
#RUN mkdir -p /app/.next/cache/fetch-cache

CMD ["server.js"]