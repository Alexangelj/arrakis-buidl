#!/bin/bash

FRONTEND=$PWD
cd ../../../contracts
ls
CONTRACT="Rad.sol"
docker run -it -v $FRONTEND/bin:/tmp/solcoutput -v $PWD:/contracts ethereum/solc:stable --abi --overwrite -o /tmp/solcoutput /contracts/$CONTRACT
ls $FRONTEND/bin