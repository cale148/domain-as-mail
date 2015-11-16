# pdd

# Build production
1. put keys into ./keys directory
1. docker-compose run --rm appm /build-release.sh /appm-release-key.keystore dasm $(cat keys/storekey) $(cat keys/keypassword) prod dasm.v$(git describe --tags).apk
