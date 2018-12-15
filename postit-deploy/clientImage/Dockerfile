FROM nginx:1.15-alpine

MAINTAINER uicode.fr

RUN mkdir /log
VOLUME /log

EXPOSE 80

COPY ./postit-client /usr/share/nginx/html/postit-client
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./version.txt /version.txt

