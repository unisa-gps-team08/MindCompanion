FROM node:24-bookworm-slim

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install --global --ignore-scripts pnpm@10.33.2

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY --chown=node:node tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs ./
COPY --chown=node:node src/ ./src/
COPY --chown=node:node public/ ./public/
COPY --chown=node:node tests/integration/health.test.mjs ./tests/integration/

EXPOSE 3000
CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]
