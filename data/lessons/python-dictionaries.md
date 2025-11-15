# Python Dictionaries

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
