# Build stage
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY hickory-lawn-care-services/package*.json ./
RUN npm ci

# Copy the source code
COPY hickory-lawn-care-services/ ./

# Build the Angular application
RUN npm run build -- --configuration production

# Production stage using Nginx
FROM nginx:alpine
COPY --from=build /app/dist/hickory-lawn-care-services/browser /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
