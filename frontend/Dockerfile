# --- build stage ---
FROM node:lts-alpine AS build

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy rest of files
COPY . .

# Build application
RUN npm run build

# --- Production Stage ---
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80