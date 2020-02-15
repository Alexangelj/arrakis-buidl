#!/bin/bash

# run IPFS
docker run -d --name ipfs_host -e IPFS_PROFILE=server -v ipfs_staging:/export -v ipfs_data:/data/ipfs -p 4001:4001 -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/go-ipfs:latest
