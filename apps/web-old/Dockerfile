# Build stage
FROM node:26-bullseye AS builder

WORKDIR /app

# Copy root configs
COPY package*.json nx.json tsconfig*.json .postcssrc.json ./

# Install all dependencies (včetně dev)
RUN npm ci

# Copy packages (local dependencies)
COPY packages/ ./packages/

# Copy web-old source
COPY apps/web-old/ ./apps/web-old/

# Build using Nx
RUN npx nx build web-old --configuration=production

# Runtime stage  
FROM node:26-alpine

WORKDIR /app

# Copy generated package.json from build output
COPY --from=builder /app/dist/apps/web-old/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application
COPY --from=builder /app/dist/apps/web-old/ ./

EXPOSE 5173

CMD ["node", "main.mjs"]
