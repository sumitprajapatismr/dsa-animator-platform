# Use lightweight node base image
FROM node:18-alpine

WORKDIR /app

# Copy dependency configs
COPY package*.json ./

# Install packages
RUN npm install --production

# Copy source directories
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
