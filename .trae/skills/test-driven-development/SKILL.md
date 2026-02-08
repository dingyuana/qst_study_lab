# Test-Driven Development

## When To Activate

This skill activates when you're about to write code. You want to write a test first, watch it fail, then write the code to make it pass.

You want to activate when:

1. You're about to write code.
2. You know what the code should do.
3. You can write a test that captures the expected behavior.

You probably want to activate **before** writing code, and **after** you have a plan.

## Goal

The goal of this skill is to write code using the RED-GREEN-REFACTOR cycle:

1. **RED:** Write a failing test.
2. **GREEN:** Write the minimal code to make the test pass.
3. **REFACTOR:** Improve the code without changing its behavior.

## Steps

1. **Write a failing test.** Write a test that captures the expected behavior. It should fail because the code doesn't exist yet.
2. **Run the test.** Run the test and watch it fail.
3. **Write the minimal code.** Write the minimal code to make the test pass.
4. **Run the test.** Run the test and watch it pass.
5. **Refactor.** Improve the code without changing its behavior.
6. **Repeat.** Repeat until all tests pass.

## How To Do Each Step

### Write A Failing Test

Write a test that captures the expected behavior. It should fail because the code doesn't exist yet.

Some guidelines:

- Test one thing at a time.
- Use descriptive test names.
- Follow the Arrange-Act-Assert pattern.
- Make it as simple as possible.

### Run The Test

Run the test and watch it fail. This confirms that the test is working correctly.

### Write The Minimal Code

Write the minimal code to make the test pass. Don't over-engineer it. Just enough to make the test pass.

### Run The Test

Run the test and watch it pass. This confirms that the code works.

### Refactor

Improve the code without changing its behavior. This could include:

- Extracting methods.
- Renaming variables.
- Simplifying logic.
- Removing duplication.

### Repeat

Repeat until all tests pass.

## What If The Test Is Hard To Write?

If the test is hard to write, you have a few options:

1. **Write a simpler test.** Start with a simpler test and build up.
2. **Write a different test.** Try a different approach.
3. **Skip the test.** If the test is not valuable, skip it.

## What If The Code Is Hard To Test?

If the code is hard to test, you have a few options:

1. **Refactor first.** Refactor the code to make it more testable.
2. **Use mocks.** Use mocks to isolate the code from its dependencies.
3. **Write an integration test.** Write an integration test instead of a unit test.

## Common Mistakes

### Writing Code Before Tests

Don't write code before tests. The test is your safety net. It catches bugs early.

### Writing Complex Tests

Don't write complex tests. Keep them simple and focused.

### Not Running Tests

Don't skip running tests. It confirms that the test is working correctly.

### Not Refactoring

Don't skip refactoring. It improves the code quality.

### Over-Engineering

Don't over-engineer. Write the minimal code to make the test pass.

## Example

### Before

> **Task:** Create a function that adds two numbers
> 
> **Bad Approach:**
> - Write the function
> - Run the tests
> - If they pass, done

### After

> **Good Approach:**
> 
> **RED:** Write a failing test
> ```python
> def test_add():
>     assert add(1, 2) == 3
> ```
> 
> **GREEN:** Write the minimal code
> ```python
> def add(a, b):
>     return a + b
> ```
> 
> **REFACTOR:** Improve the code (nothing to improve)
> 
> **Result:** Test passes

## What If The Test Fails For The Wrong Reason?

If the test fails for the wrong reason, fix the test. It should fail because the code doesn't exist yet, not because of a bug in the test.

## What If The Code Passes The Test But Has Bugs?

If the code passes the test but has bugs, write more tests. The tests should catch the bugs.

## Anti-Patterns

### Testing Implementation Details

Don't test implementation details. Test the public API. Implementation details can change, but the public API should be stable.

### Tests That Are Too Specific

Don't make tests too specific. They should test the behavior, not the implementation.

### Tests That Are Too Broad

Don't make tests too broad. They should test one thing at a time.

### Tests That Are Brittle

Don't make tests brittle. They should be resilient to change.

### Tests That Are Slow

Don't make tests slow. Fast tests are easier to run.

## Testing Methodology

### Test Pyramid

Aim for a test pyramid:

- **Unit tests:** Fast, many, isolated.
- **Integration tests:** Slower, fewer, cover interactions.
- **End-to-end tests:** Slowest, fewest, cover the whole system.

### FIRST Principles

Make tests:

- **Fast:** They should run quickly.
- **Independent:** They should not depend on each other.
- **Repeatable:** They should produce the same result every time.
- **Self-validating:** They should have a clear pass/fail result.
- **Timely:** They should be written in a timely manner.

### Arrange-Act-Assert

Follow the Arrange-Act-Assert pattern:

1. **Arrange:** Set up the test fixture.
2. **Act:** Execute the code under test.
3. **Assert:** Verify the expected outcome.

### Given-When-Then

Alternatively, follow the Given-When-Then pattern:

1. **Given:** Set up the test fixture.
2. **When:** Execute the code under test.
3. **Then:** Verify the expected outcome.
