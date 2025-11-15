#!/usr/bin/env python3
"""
Script to test the receive-lesson API endpoint
Sends a new Python lesson to the quiz application
"""

import requests
import json

# Configuration
API_URL = "http://localhost:3000/api/receive-lesson"  # Adjust if your app runs on a different port/URL

# Sample Python lesson data
lesson_data = {
    "id": "python-list-comprehensions",
    "title": "Python List Comprehensions",
    "description": "Learn how to create lists efficiently using Python list comprehensions.",
    "duration": "20 minutes",
    "difficulty": "Intermediate",
    "markdownContent": """# Python List Comprehensions

## Introduction

List comprehensions are a concise and elegant way to create lists in Python. They provide a more readable and efficient alternative to traditional loops when creating lists.

## Basic Syntax

The basic syntax of a list comprehension is:

```python
[expression for item in iterable]
```

### Simple Example

Instead of writing:

```python
squares = []
for x in range(10):
    squares.append(x**2)
```

You can write:

```python
squares = [x**2 for x in range(10)]
```

## Adding Conditions

You can add conditions to filter items:

```python
# Only even squares
even_squares = [x**2 for x in range(10) if x % 2 == 0]
```

## Multiple Iterables

You can use multiple iterables:

```python
# Cartesian product
combinations = [(x, y) for x in [1, 2, 3] for y in ['a', 'b']]
# Result: [(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b'), (3, 'a'), (3, 'b')]
```

## Nested List Comprehensions

You can nest list comprehensions:

```python
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [num for row in matrix for num in row]
# Result: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## Dictionary and Set Comprehensions

Python also supports dictionary and set comprehensions:

```python
# Dictionary comprehension
squares_dict = {x: x**2 for x in range(5)}
# Result: {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Set comprehension
unique_squares = {x**2 for x in [-2, -1, 0, 1, 2]}
# Result: {0, 1, 4}
```

## When to Use List Comprehensions

**Use list comprehensions when:**
- The logic is simple and readable
- You're creating a new list from an iterable
- Performance is important (they're faster than loops)

**Avoid list comprehensions when:**
- The logic is complex and hard to read
- You need side effects (like printing)
- The comprehension becomes too nested or long

## Best Practices

1. **Keep it readable**: If a comprehension is hard to understand, use a regular loop
2. **Don't over-nest**: More than 2-3 levels of nesting becomes unreadable
3. **Use meaningful variable names**: Even in comprehensions, use clear names

## Practice Exercise

Try creating a list comprehension that:
- Takes numbers from 1 to 20
- Filters for numbers divisible by 3
- Squares each number
- Result: [9, 36, 81, 144, 225, 324, 441, 576, 729, 900]

## Summary

- List comprehensions provide a concise way to create lists
- They can include conditions and multiple iterables
- Use them when they improve readability
- Python also supports dictionary and set comprehensions
"""
}

def send_lesson():
    """Send the lesson data to the API"""
    try:
        print(f"Sending lesson to: {API_URL}")
        print(f"Lesson ID: {lesson_data['id']}")
        print(f"Lesson Title: {lesson_data['title']}")
        print("-" * 50)
        
        response = requests.post(
            API_URL,
            json=lesson_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                print("\n✅ Success! Lesson received and saved.")
                print(f"Lesson ID: {result.get('lessonId')}")
            else:
                print(f"\n❌ Error: {result.get('error')}")
        else:
            print(f"\n❌ Request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"\n❌ Connection Error: Could not connect to {API_URL}")
        print("Make sure your Next.js app is running on the correct port.")
    except requests.exceptions.Timeout:
        print("\n❌ Timeout: Request took too long")
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")

if __name__ == "__main__":
    print("=" * 50)
    print("Testing Receive Lesson API")
    print("=" * 50)
    send_lesson()
    print("=" * 50)
