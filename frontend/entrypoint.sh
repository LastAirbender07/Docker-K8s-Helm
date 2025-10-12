#!/bin/sh

# Replace the placeholder with the actual environment variable
envsubst '${BACKEND_API_URL}' < /usr/share/nginx/html/config.js > /usr/share/nginx/html/config.temp.js
mv /usr/share/nginx/html/config.temp.js /usr/share/nginx/html/config.js

# Start Nginx
nginx -g "daemon off;"
