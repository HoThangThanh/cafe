# Stage 1: Build với Node
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./
RUN npm install

# Copy toàn bộ project (src, public, tsconfig*, vite.config.ts, etc.)
COPY . .

# Build với Vite
RUN npm run build

# Stage 2: Serve bằng Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
