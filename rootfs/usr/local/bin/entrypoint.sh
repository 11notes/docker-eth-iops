#!/bin/ash
if [ -z "${1}" ]; then
    set -- "node" /node/fio.js "default"
else
    set -- "node" /node/fio.js "${1}"
fi

exec "$@"