#!/bin/bash

echo "Checking Backend Status..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/docs | grep -q "200"; then
  echo "✅ Backend is RUNNING at http://localhost:8000"
else
  echo "❌ Backend is NOT responding"
fi

echo "Checking Frontend Status..."
# Build/Dev server might return 200 or similar
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5175 | grep -q "200"; then
  echo "✅ Frontend is RUNNING at http://localhost:5175"
else
    # Try 5173 just in case
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 | grep -q "200"; then
        echo "✅ Frontend is RUNNING at http://localhost:5173"
    else
        echo "❌ Frontend is NOT responding"
    fi
fi
