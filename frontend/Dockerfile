# ==========================================
# 🧱 Stage 1: Build & Compile React Static Assets
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./

# Install frontend dependencies
RUN npm ci

# Copy core codebase
COPY tailwind.config.js postcss.config.js vite.config.ts index.html ./
COPY src/ ./src

# Bundle static assets to /dist (optimized JS chunks, CSS, HTML5)
RUN npm run build

# ==========================================
# 🕸️ Stage 2: Blazing-Fast Nginx Web Server
# ==========================================
FROM nginx:1.25-alpine

# Copy bundled production assets from the builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Replace default Nginx configuration with our custom SPA router config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web server PORT
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
