# --- build stage ---
FROM node:lts-alpine AS build

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy rest of files (includes tsconfig.json + src)
COPY . .


# Build TypeScript
RUN npm run build

# --- Production Stage ---
FROM node:lts-alpine
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev --ignore-scripts
COPY --from=build /app/dist ./dist

COPY .env .env
EXPOSE 3000
CMD ["node", "dist/server.js"]