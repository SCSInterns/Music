# --------- Build Stage ---------
FROM node:18-slim AS builder

# Install build dependencies for canvas
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

# Use npm ci for faster, clean installs (if package-lock.json exists)
RUN npm ci --only=production

COPY . .

# --------- Runtime Stage ---------
FROM node:18-slim

WORKDIR /usr/src/app

# Copy only necessary files from the builder stage
COPY --from=builder /usr/src/app /usr/src/app

EXPOSE 5000
CMD ["node", "index.js"]
