#!/usr/bin/env python3
import requests

print("Testing production endpoint /api/ext/login...")
try:
    response = requests.post('https://baaijus.replit.app/api/ext/login', 
                           json={'username': 'testuser2', 'password': 'testpass'}, 
                           timeout=10)
    print(f'Status: {response.status_code}')
    print(f'Response: {response.text}')
    
    if response.status_code == 200:
        print("✓ Production endpoint works - extension should authenticate")
    else:
        print("✗ Production endpoint broken")
        
except Exception as e:
    print(f'Error: {e}')