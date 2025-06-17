#!/usr/bin/env python3
import requests
import json

def test_local_auth():
    print("Testing local server authentication...")
    try:
        response = requests.post(
            'http://localhost:5000/ext-login',
            json={'username': 'testuser2', 'password': 'testpass'},
            timeout=5
        )
        print(f"Local Status: {response.status_code}")
        print(f"Local Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Local Error: {e}")
        return False

def test_production_auth():
    print("\nTesting production server authentication...")
    try:
        response = requests.post(
            'https://baaijus.replit.app/ext-login',
            json={'username': 'testuser2', 'password': 'testpass'},
            timeout=10
        )
        print(f"Production Status: {response.status_code}")
        print(f"Production Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Production Error: {e}")
        return False

if __name__ == "__main__":
    local_works = test_local_auth()
    prod_works = test_production_auth()
    
    print(f"\n--- RESULTS ---")
    print(f"Local server: {'✓ WORKING' if local_works else '✗ BROKEN'}")
    print(f"Production server: {'✓ WORKING' if prod_works else '✗ BROKEN'}")
    
    if local_works and not prod_works:
        print("\nISSUE: Extension endpoint works locally but not in production")
        print("SOLUTION: Deploy the updated server code")
    elif not local_works and not prod_works:
        print("\nISSUE: Extension endpoint broken everywhere")
        print("SOLUTION: Fix the server code")
    elif local_works and prod_works:
        print("\nISSUE: Server endpoints work, problem is in extension code")
        print("SOLUTION: Fix extension authentication logic")