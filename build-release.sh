#!/bin/bash

cd $(dirname $0)

test ! -e dasm/platforms/android/build-extras.gradle && \
  echo 'ext.cdvBuildMultipleApks=false' > dasm/platforms/android/build-extras.gradle

docker-compose run --rm app cordova plugin rm cordova-plugin-console
docker-compose run --rm app gulp --cordova 'build --release android'
docker-compose run --rm app jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore /dasm-release-key.keystore -storepass $(cat keys/storekey) -keypass $(cat keys/keypassword) /app/platforms/android/build/outputs/apk/android-release-unsigned.apk dasm

zipalign -v 4 dasm/platforms/android/build/outputs/apk/android-release-unsigned.apk dasm.$(git rev-parse --short HEAD).apk
