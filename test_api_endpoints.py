#!/usr/bin/env python3
"""
Test script for the Quiz API endpoints
Tests lesson receiving and retrieval functionality
"""

import requests
import json
import time

# Configuration
BASE_URL = "http://localhost:3000"  # Adjust if your app runs on a different port/URL

def test_receive_lesson():
    """Test 1: Send a new lesson to the API"""
    print("=" * 60)
    print("TEST 1: Receiving a New Lesson")
    print("=" * 60)
    
    lesson_data = {
        "id": "python-dictionaries",
        "title": "Python Dictionaries",
        "description": "Learn how to work with dictionaries in Python, including creation, manipulation, and common operations.",
        "duration": "18 minutes",
        "difficulty": "Beginner",
        "markdownContent": """# Python Dictionaries

## Introduction

Dictionaries are one of Python's most powerful data structures. They store key-value pairs and allow for fast lookups.

## Creating Dictionaries

You can create dictionaries in several ways:

```python
# Empty dictionary
my_dict = {}

# Dictionary with initial values
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

# Using dict() constructor
person2 = dict(name="Bob", age=25, city="London")
```

## Accessing Values

```python
person = {"name": "Alice", "age": 30}

# Using square brackets
print(person["name"])  # Output: Alice

# Using get() method (safer)
print(person.get("name"))  # Output: Alice
print(person.get("email", "Not found"))  # Output: Not found
```

## Modifying Dictionaries

```python
person = {"name": "Alice", "age": 30}

# Add or update
person["email"] = "alice@example.com"
person["age"] = 31

# Update multiple items
person.update({"city": "Boston", "country": "USA"})
```

## Common Operations

```python
# Check if key exists
if "name" in person:
    print("Name exists")

# Get all keys
keys = person.keys()

# Get all values
values = person.values()

# Get all items (key-value pairs)
items = person.items()

# Remove item
del person["age"]
# or
age = person.pop("age")
```

## Dictionary Comprehensions

```python
# Create dictionary from list
squares = {x: x**2 for x in range(5)}
# Result: {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# With condition
even_squares = {x: x**2 for x in range(5) if x % 2 == 0}
```

## Nested Dictionaries

```python
students = {
    "alice": {"age": 20, "grade": "A"},
    "bob": {"age": 21, "grade": "B"}
}

print(students["alice"]["grade"])  # Output: A
```

## Summary

- Dictionaries store key-value pairs
- Use square brackets or get() to access values
- Dictionaries are mutable and unordered (Python 3.7+ maintains insertion order)
- Use dictionary comprehensions for efficient creation
"""
    }
    
    try:
        url = f"{BASE_URL}/api/receive-lesson"
        print(f"Sending POST request to: {url}")
        print(f"Lesson ID: {lesson_data['id']}")
        print(f"Lesson Title: {lesson_data['title']}")
        
        response = requests.post(
            url,
            json=lesson_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"\nStatus Code: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and result.get("success"):
            print("\n✅ TEST 1 PASSED: Lesson received and saved successfully!")
            return True
        else:
            print(f"\n❌ TEST 1 FAILED: {result.get('error', 'Unknown error')}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"\n❌ TEST 1 FAILED: Could not connect to {BASE_URL}")
        print("Make sure your Next.js app is running.")
        return False
    except Exception as e:
        print(f"\n❌ TEST 1 FAILED: {str(e)}")
        return False


def test_get_lessons():
    """Test 2: Retrieve lessons from the API"""
    print("\n" + "=" * 60)
    print("TEST 2: Retrieving Lessons from API")
    print("=" * 60)
    
    endpoints = [
        ("Next Lesson", f"{BASE_URL}/api/get-next-lesson"),
        ("Upcoming Lessons", f"{BASE_URL}/api/get-upcoming-lessons"),
        ("Completed Lessons", f"{BASE_URL}/api/get-completed-lessons"),
    ]
    
    all_passed = True
    
    for name, url in endpoints:
        try:
            print(f"\n--- Testing {name} ---")
            print(f"GET {url}")
            
            response = requests.get(url, timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Success: {result.get('success', False)}")
                
                if name == "Next Lesson":
                    next_lesson = result.get("nextLesson")
                    if next_lesson:
                        print(f"Next Lesson: {next_lesson.get('title')} ({next_lesson.get('id')})")
                    else:
                        print("No next lesson (all completed or no lessons available)")
                        
                elif name == "Upcoming Lessons":
                    upcoming = result.get("upcomingLessons", [])
                    print(f"Upcoming Lessons Count: {len(upcoming)}")
                    for lesson in upcoming[:3]:  # Show first 3
                        print(f"  - {lesson.get('title')} ({lesson.get('id')})")
                        
                elif name == "Completed Lessons":
                    completed = result.get("completedLessons", [])
                    print(f"Completed Lessons Count: {len(completed)}")
                    for lesson in completed[:3]:  # Show first 3
                        print(f"  - {lesson.get('title')} ({lesson.get('id')})")
                
                print(f"✅ {name} endpoint working correctly")
            else:
                print(f"❌ {name} endpoint returned status {response.status_code}")
                print(f"Response: {response.text}")
                all_passed = False
                
        except requests.exceptions.ConnectionError:
            print(f"❌ Could not connect to {url}")
            all_passed = False
        except Exception as e:
            print(f"❌ Error testing {name}: {str(e)}")
            all_passed = False
    
    if all_passed:
        print("\n✅ TEST 2 PASSED: All lesson retrieval endpoints working!")
    else:
        print("\n❌ TEST 2 FAILED: Some endpoints had issues")
    
    return all_passed


def test_reset_lessons():
    """Test 3: Reset all lessons"""
    print("\n" + "=" * 60)
    print("TEST 3: Resetting All Lessons")
    print("=" * 60)
    
    try:
        url = f"{BASE_URL}/api/reset-lessons"
        print(f"Sending POST request to: {url}")
        print("⚠️  WARNING: This will delete all lesson files!")
        
        # Ask for confirmation (optional - you can remove this for automated testing)
        response = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"\nStatus Code: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and result.get("success"):
            deleted_count = result.get("deletedCount", 0)
            print(f"\n✅ TEST 3 PASSED: Reset successful! Deleted {deleted_count} files.")
            return True
        else:
            print(f"\n❌ TEST 3 FAILED: {result.get('error', 'Unknown error')}")
            return False
            
    except requests.exceptions.ConnectionError:
        print(f"\n❌ TEST 3 FAILED: Could not connect to {BASE_URL}")
        return False
    except Exception as e:
        print(f"\n❌ TEST 3 FAILED: {str(e)}")
        return False


def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("Quiz API Test Suite")
    print("=" * 60)
    print(f"Testing API at: {BASE_URL}")
    print(f"Make sure your Next.js app is running before starting tests.\n")
    
    # Wait a moment for user to read
    time.sleep(1)
    
    # Run tests
    test1_passed = test_receive_lesson()
    
    # Wait a bit between tests
    time.sleep(1)
    
    test2_passed = test_get_lessons()
    
    # Wait a bit before reset test
    time.sleep(1)
    
    # Optional: Uncomment to test reset functionality
    # test3_passed = test_reset_lessons()
    test3_passed = True  # Skip reset test by default
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Test 1 (Receive Lesson): {'✅ PASSED' if test1_passed else '❌ FAILED'}")
    print(f"Test 2 (Get Lessons): {'✅ PASSED' if test2_passed else '❌ FAILED'}")
    print(f"Test 3 (Reset Lessons): {'⏭️  SKIPPED' if test3_passed else '❌ FAILED'}")
    
    if test1_passed and test2_passed:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print("\n⚠️  Some tests failed. Check the output above for details.")
        return 1


if __name__ == "__main__":
    exit(main())
