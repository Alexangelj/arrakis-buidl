#!/bin/bash

echo "Killing..."
docker stop ipfs_host
docker rm ipfs_host
