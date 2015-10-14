FROM     jacekmarchwicki/android
MAINTAINER ionic-framework-android-docker@3apaxi.com

ENV NODE_VERSION 4
ENV NODE_MODULES_DIR node_modules
ENV BOWER_CLIENT_ID 896698526080
ENV BOWER_DIR app/bower_components

RUN apt-get install -y unzip && type unzip

# iojs
RUN curl -sL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash - && \
  apt-get install -y nodejs && \
  type node && \
  apt-get clean

RUN npm install --global \
  bower \
  cordova \
  generator-m-ionic \
  gulp \
  ionic@1.6.5 \
  yo

EXPOSE 3000
EXPOSE 3001

RUN mkdir -p /app
COPY docker-entrypoint-development.sh /app/
RUN chmod +x /app/docker-entrypoint-development.sh

RUN useradd -ms /bin/bash app

USER app
WORKDIR /home/app
RUN mkdir -p .config/configstore
RUN echo '{"clientId": '$BOWER_CLIENT_ID',"optOut": true}' > .config/configstore/insight-yo.json
RUN echo 'clientId: '$BOWER_CLIENT_ID >> .config/configstore/insight-bower.yml
RUN echo 'optOut: true' >> .config/configstore/insight-bower.yml

# github known_hosts
# Add github.com to known_hosts
RUN mkdir -p .ssh && \
  ssh-keyscan -H github.com >> .ssh/known_hosts

RUN echo 'umask 000' >> .bashrc

WORKDIR /app
ENTRYPOINT ["/app/docker-entrypoint-development.sh"]
CMD ["gulp", "watch", "--no-open"]
