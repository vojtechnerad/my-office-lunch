# Build stage
FROM node:26-alpine AS builder

WORKDIR /app

# Copy root configs
COPY package*.json nx.json tsconfig*.json ./

# Install all dependencies (včetně dev)
RUN npm ci

# Copy packages (local dependencies)
COPY packages/ ./packages/

# Copy API source
COPY apps/api/ ./apps/api/

# Build using Nx
RUN npx nx build api --configuration=production

# Runtime stage  
FROM node:26-alpine

WORKDIR /app

# Copy generated package.json from build output
COPY --from=builder /app/dist/apps/api/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application
COPY --from=builder /app/dist/apps/api/ ./

EXPOSE 3000

CMD ["node", "main.mjs"]