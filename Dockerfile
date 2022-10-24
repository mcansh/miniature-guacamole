# base node image
FROM node:16-bullseye-slim as base

# set for base and all that inherit from it
ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@7.14.0 --activate

###############################################################################

# install all node_modules, including dev dependencies
FROM base as deps
WORKDIR /myapp

ENV NODE_ENV=development
ADD package.json pnpm-lock.yaml ./
RUN npm set-script prepare ""
RUN pnpm fetch
RUN pnpm install --frozen-lockfile --recursive --offline

###############################################################################

# setup production node_modules
FROM base as production-deps
WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json pnpm-lock.yaml ./
RUN npm set-script prepare ""
RUN pnpm prune --prod

###############################################################################

# build the app
FROM base as build
WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD . .
RUN npm run build

###############################################################################

# finally, build the production image with minimal footprint
FROM base
WORKDIR /myapp

# copy over production deps
COPY --from=production-deps /myapp/node_modules /myapp/node_modules

# copy over built application and assets
COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY server.cjs /myapp/server.cjs
COPY package.json /myapp/package.json

CMD ["npm", "start"]
