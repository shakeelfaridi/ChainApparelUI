FROM node:14 AS build
WORKDIR /src
COPY package*.json ./
RUN npm i --silent
COPY . .
RUN npm run build --if-present

FROM nginx:1.25.1
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

