# Stage 1: Build the frontend
FROM node:20-alpine AS build

WORKDIR /app

# Build argument for backend URL - option B | Option A is to set at runtime using window object
# ARG VITE_BACKEND_API_URL
# ENV VITE_BACKEND_API_URL=$VITE_BACKEND_API_URL

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# Stage 2: Serve the built static files using nginx
FROM nginx:1.28-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Copy the config template
COPY config.template.js /usr/share/nginx/html/config.js

# Add entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
