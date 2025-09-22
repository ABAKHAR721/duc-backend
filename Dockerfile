FROM node:18-alpine
WORKDIR /app
# Copy package files
COPY package*.json ./
# Install all dependencies (include devDeps for build)
RUN npm ci
# Copy source code
COPY . .
# Generate Prisma client
RUN npx prisma generate
# Build the application
RUN npm run build
# Keep devDependencies to retain Prisma CLI for runtime migrations on Railway
# (If you want a slimmer image, use a multi-stage build instead of pruning here.)
# Expose port 8080 for Railway
EXPOSE 8080
# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]