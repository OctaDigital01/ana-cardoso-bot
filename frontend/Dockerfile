FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including devDependencies for build
RUN npm install

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# Clean install only production dependencies
RUN rm -rf node_modules && npm ci --only=production && npm cache clean --force

EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "start"]