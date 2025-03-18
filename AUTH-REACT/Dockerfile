FROM node:18-alpine

WORKDIR /app

# Copy package files first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Install serve globally
RUN npm i -g serve

# Copy all files AFTER installing dependencies
COPY . .

# Build React app
RUN npm run build

# Expose port
EXPOSE 3000

# Start app using serve
CMD [ "serve", "-s", "dist" ]
