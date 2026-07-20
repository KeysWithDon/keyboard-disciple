FROM node:22-alpine

WORKDIR /app

COPY server/package.json ./server/package.json
COPY server/index.mjs ./server/index.mjs
COPY index.html app.js styles.css refresh.css sitemap.xml .nojekyll ./
COPY assets ./assets

EXPOSE 8080
CMD ["node", "server/index.mjs"]
