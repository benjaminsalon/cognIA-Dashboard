# Python Functions and Modules

## Introduction

Functions and modules are fundamental concepts in Python that help you write organized, reusable code. This lesson will teach you how to create functions and organize them into modules.

## What are Functions?

A **function** is a block of code that performs a specific task. Functions allow you to:
- Avoid code repetition
- Organize your code better
- Make your code easier to test and maintain

## Defining Functions

In Python, you define a function using the `def` keyword:

```python
def greet(name):
    """This function greets the person passed in as a parameter"""
    print(f"Hello, {name}!")

greet("Alice")
# Output: Hello, Alice!
```

### Function Parameters

Functions can accept multiple parameters:

```python
def add_numbers(a, b):
    """Add two numbers and return the result"""
    return a + b

result = add_numbers(5, 3)
print(result)  # Output: 8
```

### Default Parameters

You can provide default values for parameters:

```python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Bob")  # Output: Hello, Bob!
greet("Charlie", "Hi")  # Output: Hi, Charlie!
```

## Return Values

Functions can return values using the `return` keyword:

```python
def calculate_area(length, width):
    return length * width

area = calculate_area(10, 5)
print(f"Area: {area}")  # Output: Area: 50
```

## Modules

A **module** is a file containing Python definitions and statements. Modules help you organize related functions together.

### Creating a Module

Create a file called `math_utils.py`:

```python
# math_utils.py
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b != 0:
        return a / b
    else:
        return "Cannot divide by zero"
```

### Importing Modules

You can import modules in several ways:

```python
# Import the entire module
import math_utils
result = math_utils.add(5, 3)

# Import specific functions
from math_utils import add, subtract
result = add(5, 3)

# Import with an alias
import math_utils as mu
result = mu.add(5, 3)

# Import all functions (not recommended)
from math_utils import *
```

## Built-in Modules

Python comes with many built-in modules:

```python
import math
print(math.pi)  # Output: 3.141592653589793
print(math.sqrt(16))  # Output: 4.0

import datetime
now = datetime.datetime.now()
print(now)  # Output: Current date and time
```

## Best Practices

1. **Use descriptive function names**: `calculate_area` is better than `ca`
2. **Write docstrings**: Document what your function does
3. **Keep functions focused**: Each function should do one thing well
4. **Organize related functions**: Group them in modules
5. **Don't use `import *`**: It can cause naming conflicts

## Practice Exercise

Try creating a module called `string_utils.py` with functions to:
- Reverse a string
- Count vowels in a string
- Check if a string is a palindrome

## Summary

- Functions help you write reusable, organized code
- Use `def` to define functions
- Return values with `return`
- Modules group related functions together
- Import modules using `import` or `from ... import`

## Next Steps

Now that you understand functions and modules, you can:
- Organize larger projects into multiple modules
- Create packages (collections of modules)
- Explore Python's standard library
