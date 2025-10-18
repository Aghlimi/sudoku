FROM node:20
WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Metro bundler default port
EXPOSE 8081

CMD ["npm", "start"]