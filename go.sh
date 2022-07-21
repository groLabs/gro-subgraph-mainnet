#!/bin/bash
set -e 

yarn codegen
yarn build
yarn deploy

