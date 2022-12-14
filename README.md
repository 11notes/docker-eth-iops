# docker-eth-iops

Will test the storage mounted in /iops if it's fast enough to run an Ethereum execution node.
It is testing the worst possible IO (no cache, no buffer, all disabled) so expect your storage to barely make it.

## Volumes

/iops

Purpose: Mount the storage device you want to test to this path

## Run
```shell
docker run --rm -v /dev/nvme0n1:/iops 11notes/eth-iops
```
![Outpout](https://github.com/11notes/docker-eth-iops/blob/main/blob/cmd.png?raw=true)

![Test Passed](https://github.com/11notes/docker-eth-iops/blob/main/blob/passed.png?raw=true)

![Test Failed](https://github.com/11notes/docker-eth-iops/blob/main/blob/failed.png?raw=true)

## Run commands

default (nothing)

Test: Default test to check if your storage is fast enough to run an Ethereum execution node


## Build with

* [Alpine Linux](https://alpinelinux.org/) - Alpine Linux
* [NodeJS](https://nodejs.org/en/) - NodeJS
* [fio](https://github.com/axboe/fio) - Flexible I/O Tester 