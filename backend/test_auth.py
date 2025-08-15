#!/usr/bin/env python3
"""
Test script to verify authentication works correctly
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_authentication():
    print("🧪 Testing BeautyFitness Authentication")
    print("=" * 50)
    
    # Test 1: Try to login with non-existent user
    print("\n🔍 Test 1: Login with non-existent user")
    login_data = {
        "email": "nonexistent@test.com",
        "password": "anypassword"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 401:
            print("✅ PASS: Non-existent user login rejected")
        else:
            print("❌ FAIL: Non-existent user login was accepted!")
            
    except Exception as e:
        print(f"❌ Error testing: {e}")
    
    # Test 2: Check how many users are in database
    print("\n🔍 Test 2: Check database users")
    try:
        response = requests.get(f"{BASE_URL}/debug/users")
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Total users in DB: {data.get('total_users', 0)}")
        print(f"Users: {data.get('users', [])}")
        
    except Exception as e:
        print(f"❌ Error checking users: {e}")
    
    # Test 3: Register a new user
    print("\n🔍 Test 3: Register new user")
    register_data = {
        "name": "Test User",
        "email": "test@example.com", 
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/register", json=register_data)
        print(f"Registration Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ User registered successfully")
            user_data = response.json()
            print(f"User ID: {user_data.get('id')}")
        else:
            print(f"Registration failed: {response.json()}")
            
    except Exception as e:
        print(f"❌ Error registering: {e}")
    
    # Test 4: Login with correct credentials
    print("\n🔍 Test 4: Login with correct credentials")
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        print(f"Login Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ PASS: Correct login accepted")
            token_data = response.json()
            print(f"Token received: {token_data.get('access_token', '')[:50]}...")
        else:
            print(f"❌ FAIL: Correct login rejected: {response.json()}")
            
    except Exception as e:
        print(f"❌ Error logging in: {e}")
    
    # Test 5: Login with wrong password
    print("\n🔍 Test 5: Login with wrong password")
    login_data = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 401:
            print("✅ PASS: Wrong password rejected")
        else:
            print(f"❌ FAIL: Wrong password accepted: {response.json()}")
            
    except Exception as e:
        print(f"❌ Error testing wrong password: {e}")

if __name__ == "__main__":
    test_authentication()
