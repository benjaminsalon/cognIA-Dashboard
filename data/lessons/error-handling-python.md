# Error Handling in Python

## Introduction

Errors are a natural part of programming. Python provides powerful tools to handle errors gracefully using try/except blocks.

## Understanding Exceptions

When Python encounters an error, it raises an **exception**. For example:

```python
# This will raise a ZeroDivisionError
result = 10 / 0
```

## Try/Except Blocks

The `try/except` block allows you to catch and handle exceptions:

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
```

## Multiple Exception Types

You can handle different types of exceptions:

```python
try:
    number = int(input("Enter a number: "))
    result = 10 / number
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")
```

## Catching All Exceptions

You can catch all exceptions (use with caution):

```python
try:
    # Your code here
    pass
except Exception as e:
    print(f"An error occurred: {e}")
```

## Finally Block

The `finally` block always executes, regardless of whether an exception occurred:

```python
try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("File not found!")
finally:
    file.close()  # Always executed
```

## Else Block

The `else` block runs if no exception was raised:

```python
try:
    result = 10 / 2
except ZeroDivisionError:
    print("Cannot divide by zero!")
else:
    print(f"Result: {result}")  # Only runs if no exception
```

## Raising Exceptions

You can raise your own exceptions:

```python
def check_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
    return age

try:
    check_age(-5)
except ValueError as e:
    print(e)  # Output: Age cannot be negative
```

## Common Exception Types

- `ValueError`: Wrong type of value
- `TypeError`: Wrong type used in operation
- `KeyError`: Dictionary key not found
- `IndexError`: List index out of range
- `FileNotFoundError`: File doesn't exist

## Best Practices

1. **Be specific**: Catch specific exceptions, not all exceptions
2. **Log errors**: Use logging to track errors
3. **Don't ignore errors**: Always handle exceptions appropriately
4. **Use finally**: Clean up resources in finally blocks

## Summary

- Use `try/except` to handle errors
- Handle specific exception types when possible
- Use `finally` for cleanup code
- Use `else` for code that should run on success
