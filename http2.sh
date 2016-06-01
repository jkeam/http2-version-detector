#!/bin/bash

#LD_LIBRARY_PATH=/usr/local/lib /usr/local/bin/curl --http2 -I "$@"
curl --http2 -I "$@"
