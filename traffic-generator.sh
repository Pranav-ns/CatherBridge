#!/bin/bash

# Simple script to generate dummy traffic for your Grafana Dashboard
# Run this while your backend is running locally or on EC2

URL=${1:-"http://localhost:5000"}

echo "Sending traffic to $URL to populate Grafana metrics..."
echo "Press Ctrl+C to stop."

while true; do
  # Health check - should be 200 OK
  curl -s "$URL/health" > /dev/null
  
  # Auth routes - some will succeed, some will fail (simulating 400s)
  curl -s "$URL/api/auth/login" > /dev/null
  curl -s -X POST "$URL/api/auth/register" > /dev/null
  
  # Caterer routes - simulate usage
  curl -s "$URL/api/caterers" > /dev/null
  curl -s "$URL/api/caterers/123" > /dev/null
  
  # Simulate a 404 Not Found error
  curl -s "$URL/api/does-not-exist" > /dev/null

  # Random sleep between 0.1 and 1 seconds
  sleep $(awk -v min=0.1 -v max=1.0 'BEGIN{srand(); print min+rand()*(max-min)}')
done
