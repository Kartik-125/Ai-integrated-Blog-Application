# node:20-alpine is a minimal Linux image with Node 20 preinstalled.
# "alpine" specifically because none of your dependencies need native
# compilation (bcryptjs is pure JS, unlike the native bcrypt package) —
# so there's nothing to gain from a heavier base image.
FROM node:20-alpine

WORKDIR /app

# Copy ONLY the package files first, before the rest of the source.
# Docker caches each instruction as a layer; as long as package.json
# and package-lock.json haven't changed, a later rebuild after an
# ordinary code edit reuses this cached "npm install" layer instead of
# redownloading every dependency from scratch.
COPY package*.json ./

# --omit=dev skips nodemon and other devDependencies — nothing in
# production needs a file-watcher restarting the process.
RUN npm install --omit=dev

# Now copy everything else (this invalidates the cache from here down
# on every source change, which is exactly why it comes after the
# npm install step above, not before it).
COPY . .

# Documentation for humans and tooling — this does NOT actually publish
# the port. That happens with `-p` on `docker run`, or the "ports:"
# section in docker-compose.
EXPOSE 3000

CMD ["node", "server.js"]