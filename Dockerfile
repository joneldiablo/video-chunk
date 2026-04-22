# Stage 1: Build Frontend
FROM oven/bun:latest AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lockb* frontend/package-lock.json* ./
RUN bun install
COPY frontend/ .
RUN bun run build

# Stage 2: Final Image
FROM oven/bun:latest
WORKDIR /app

# Set UTF-8 encoding
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Install FFmpeg (Required for video processing)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Copy root configuration and install dependencies
COPY package.json bun.lockb* yarn.lock* package-lock.json* ./
RUN bun install

# Copy application source code
COPY backend/ ./backend/
COPY agents/ ./agents/
COPY cli.ts .

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/dist ./frontend

# Set environment variables
ENV PORT=3000
ENV ENABLE_FRONTEND=true
ENV NODE_ENV=production

# Expose the server port
EXPOSE 3000

# Default command to start the server
# You can override this to run the CLI, e.g., docker run <image> bun run cli.ts process ...
CMD ["bun", "run", "cli.ts", "server"]
