#!/bin/bash

echo "[INFO] Pulling latest code..."
git pull origin main

echo "[INFO] Removing old build..."
sudo rm -rf dist

echo "[INFO] Building project..."
sudo npm run build

echo "[INFO] Testing Nginx config..."
sudo nginx -t

if [ $? -ne 0 ]; then
  echo "[ERROR] Nginx config error!"
  exit 1
fi

echo "[INFO] Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl reload nginx

echo "[INFO] Deployment completed successfully 🚀"