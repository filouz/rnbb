FROM node as builder

WORKDIR /app

COPY ./package.json ./package-lock.json /app/

RUN npm install

COPY ./ /app

RUN npm run build

############# PACKAGE ############

FROM nginx:alpine
LABEL org.opencontainers.image.source https://github.com/filouz/rnbb

COPY --from=builder  "/app/build" "/usr/share/nginx/html"

COPY ./.ops/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY ./.ops/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

CMD ["/bin/sh", "/entrypoint.sh"]