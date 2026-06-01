#!/bin/bash
set -e

# Stop the old PM2 process if it exists
pm2 stop caterbridge-backend || true
pm2 delete caterbridge-backend || true

cd ~/CatherBridge-1/backend

echo "Installing backend dependencies..."
npm install

echo "Starting new backend with PM2..."
pm2 start server.js --name caterbridge-backend
pm2 save

echo "Restarting Grafana Alloy..."
sudo systemctl restart alloy

echo "New Deployment complete! Backend and Telemetry Agent are running."
