#!/bin/sh

umask 000

# exit if fail
set -e

# fail if parameter not set
set -u

if [ ! -d $NODE_MODULES_DIR ];
then
  npm install
fi

if [ ! -d $BOWER_DIR ];
then
  bower install --allow-root --config.interactive=false
fi

exec "$@"
