# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Store static files in minimal Alpine container
FROM alpine:latest

# Create directory for frontend files
RUN mkdir -p /app/frontend_dist

# Copy built static files from builder stage
COPY --from=builder /app/dist /app/frontend_dist

# Keep container running so nginx can access files via shared volume
CMD ["sleep", "infinity"]
