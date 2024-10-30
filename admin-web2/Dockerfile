# Sử dụng image Node.js để build React app
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Sử dụng Nginx để serve các file tĩnh của React
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port cho frontend (thường là 80)
EXPOSE 80
