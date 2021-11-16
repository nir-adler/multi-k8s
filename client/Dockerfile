FROM node:16.13.0 as builder
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . . 
RUN npm run build

FROM nginx:latest 
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./conf/default.conf /etc/nginx/conf.d
