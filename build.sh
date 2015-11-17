#!/bin/bash

docker-compose run --rm appm /build-release.sh /appm-release-key.keystore dasm $(cat keys/storekey) $(cat keys/keypassword) prod dasm.$(git describe --tags).apk && \
mv dasm/dasm.v$(git describe --tags).apk ./
