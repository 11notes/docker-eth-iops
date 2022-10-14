# docker-eth-iops

Will test the storage mounted in /iops/dev if it's fast enough to run an Ethereum execution node

## Volumes

/iops/dev

Purpose: Mount the storage device you want to test to this path

## Run
```shell
docker run --rm \
    -v /dev/nvme0n1:/iops/dev \
    -d 11notes/eth-iops
```

## Run commands

default (nothing)

Test: Default test to check if your storage is fast enough to run an Ethereum execution node


## Build with

* [Alpine Linux](https://alpinelinux.org/) - Alpine Linux
* [NodeJS](https://nodejs.org/en/) - NodeJS
* [fio](https://github.com/axboe/fio) - Flexible I/O Tester 