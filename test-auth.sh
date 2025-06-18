#!/bin/bash

# Test the login endpoint
echo "Testing login endpoint..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "senha": "password123"}')

echo "Login response: $LOGIN_RESPONSE"

# Extract the token from the login response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token from login response"
  exit 1
fi

echo "Token: $TOKEN"

# Test the validate endpoint
echo "Testing validate endpoint..."
VALIDATE_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/validate \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"$TOKEN\"}")

echo "Validate response: $VALIDATE_RESPONSE"

# Test the protected route
echo "Testing protected route..."
PROTECTED_RESPONSE=$(curl -s -X GET http://localhost:3000/protected \
  -H "Authorization: Bearer $TOKEN")

echo "Protected route response: $PROTECTED_RESPONSE"

# Test the public route
echo "Testing public route..."
PUBLIC_RESPONSE=$(curl -s -X GET http://localhost:3000)

echo "Public route response: $PUBLIC_RESPONSE"