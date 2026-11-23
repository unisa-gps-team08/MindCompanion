FROM node:24-bookworm-slim

WORKDIR /app
RUN chown node:node /app
USER node

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node app/ ./app/
COPY --chown=node:node tests/integration/health.test.mjs ./tests/integration/

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
