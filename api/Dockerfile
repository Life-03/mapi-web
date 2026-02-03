FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PUPPETEER_CACHE_DIR=/app/.cache/puppeteer
ARG ENABLE_PUPPETEER=0

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
  && if [ "$ENABLE_PUPPETEER" = "1" ]; then \
    apt-get install -y --no-install-recommends chromium; \
    ln -sf /usr/bin/chromium /usr/bin/chromium-browser; \
  fi \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/node/puppeteer_profile && chown -R node:node /home/node/puppeteer_profile

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev
RUN mkdir -p /app/.cache/puppeteer && chown -R node:node /app/.cache
COPY --chown=node:node . .

EXPOSE 4000
USER node
CMD ["node", "index.js"]
