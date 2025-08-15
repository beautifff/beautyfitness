#!/usr/bin/env python3
"""
Test script to check if backend registration is working
"""
import requests
import json

def test_backend_connection():
    print("🧪 Testing BeautyFitness Backend Connection")
    print("=" * 50)
    
    base_url = "http://127.0.0.1:8000"
    
    # Test 1: Health check
    print("\n🔍 Test 1: Health Check")
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        if response.status_code == 200:
            print("✅ Backend is reachable")
        else:
            print("❌ Backend health check failed")
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False
    
    # Test 2: Check current users
    print("\n🔍 Test 2: Check Database Users")
    try:
        response = requests.get(f"{base_url}/debug/users", timeout=5)
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Total users: {data.get('total_users', 'unknown')}")
        print(f"Users: {data.get('users', [])}")
    except Exception as e:
        print(f"❌ Error checking users: {e}")
    
    # Test 3: Try registration
    print("\n🔍 Test 3: Test Registration")
    test_user = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(
            f"{base_url}/register", 
            json=test_user,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Registration successful")
            return True
        else:
            print("❌ Registration failed")
            return False
            
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False

if __name__ == "__main__":
    test_backend_connection()
