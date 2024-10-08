# this step just fetch node_modules, do not launch this step
FROM node:18.18.2-alpine3.18 AS deps
WORKDIR /app
COPY package.json package.json
RUN npm i

# this step start the project, with dev dependencies
FROM node:18.18.2-alpine3.18 AS dev
WORKDIR /app
COPY --from=deps /app/node_modules node_modules 
COPY . .
CMD node migrate.js && npm run dev

# this step launch the app in a prod mode, with only js files and useful deps
FROM node:18.18.2-alpine3.18 AS prod
WORKDIR /app
COPY package.json package.json
RUN npm i --omit=dev
COPY public public
COPY src src
COPY index.js index.js
CMD node index.js    