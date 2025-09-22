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
# Remove devDependencies for a slimmer production image
RUN npm prune --omit=dev
# Expose port 8080 for Railway
EXPOSE 8080
# Start the application
CMD ["npm", "run", "start:prod"]