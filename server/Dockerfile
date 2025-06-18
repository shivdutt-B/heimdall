# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy only package files and prisma folder for faster caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy everything else (including src/, tsconfig.json, etc.)
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the built code
CMD ["node", "src/index.js"]
