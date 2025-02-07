#!/bin/bash

echo "==> START PRERUN <=="
echo "==> Current user: $(whoami)"

echo "==> Install packages ..."
npm install

echo "==> Configure .env ..."
if [ ! -f .env ]; then
  cp .env.example .env
fi

echo "==> END PRERUN <=="