# Executing Plans

## When To Activate

This skill activates when you have a plan and you're ready to start implementing it. You want to execute the tasks in the plan one by one, verifying each one as you go.

You want to activate when:

1. You have a plan with clear, bite-sized tasks.
2. You're ready to start implementing.
3. You want to verify each task as you go.

You probably want to activate **after** the plan is approved, and **before** you start implementing.

## Goal

The goal of this skill is to execute the plan task by task, verifying each one as you go.

For each task, you should:

1. Understand what the task is asking for.
2. Implement the task.
3. Verify that the task is complete.
4. Move on to the next task.

## Steps

1. **Execute tasks one by one.** Go through the plan and execute each task in order.
2. **Verify each task.** After each task, verify that it's complete before moving on.
3. **Handle blockers.** If you hit a blocker, try to unblock yourself. If you can't, ask for help.
4. **Update the plan.** If you need to change the plan, update it and get approval.

## How To Do Each Step

### Execute Tasks One By One

Go through the plan and execute each task in order. For each task:

1. Read the task carefully. Understand what it's asking for.
2. Look at the file paths and code. Understand what you need to change.
3. Make the changes.
4. Verify the changes.

### Verify Each Task

After each task, verify that it's complete. This could be:

- Running a test and seeing it pass.
- Running the app and seeing the expected behavior.
- Checking that a file exists and has the expected content.

If the task is not complete, fix it before moving on.

### Handle Blockers

If you hit a blocker, try to unblock yourself. Some strategies:

- Look at the error message. What is it telling you?
- Search for the error message. Has anyone else seen this?
- Read the documentation. Does it have clues?
- Try a different approach. Is there another way to solve the problem?

If you can't unblock yourself, ask for help. Explain what you tried and what didn't work.

### Update The Plan

If you need to change the plan, update it and get approval. This could be:

- Adding a task you forgot.
- Removing a task that's no longer needed.
- Changing the order of tasks.
- Changing the content of a task.

## What If The Plan Is Wrong?

If the plan is wrong, you have a few options:

1. **Fix it yourself.** If it's a small change, you can fix it without asking.
2. **Ask for approval.** If it's a significant change, ask for approval before proceeding.
3. **Proceed with caution.** If you're not sure, ask for clarification.

## What If You Discover Something New?

If you discover something new while implementing, you have a few options:

1. **Update the plan.** If it's relevant to the plan, update it.
2. **Continue implementing.** If it's not relevant, continue implementing.
3. **Ask for guidance.** If you're not sure, ask for guidance.

## Common Mistakes

### Skipping Verification

Don't skip verification. It's easy to think you've completed a task when you haven't. Verification catches bugs early.

### Moving Too Fast

Don't move too fast. Take your time with each task. It's better to do a good job on each task than to rush through all of them.

### Not Asking For Help

Don't be afraid to ask for help. If you're stuck, ask. It's better to ask than to spin your wheels.

### Changing The Plan Without Approval

Don't change the plan without approval unless it's a small change. Significant changes should be approved.

## Example

### Before

> **User:** I want to add user authentication to my app
> 
> **Plan:**
> 1. Create user model
> 2. Create registration endpoint
> 3. Create login endpoint
> 4. Add JWT token generation
> 
> **Bad Execution:**
> - Implement all tasks at once
> - Run all tests at the end
> - Don't verify each task

### After

> **Good Execution:**
> 
> **Task 1: Create user model**
> - Create `models/user.py`
> - Run `python -c "from models.user import User; print('OK')"`
> - Result: OK
> 
> **Task 2: Create registration endpoint**
> - Create `routes/auth.py`
> - Run `pytest tests/test_auth.py::test_register -v`
> - Result: PASS
> 
> **Task 3: Create login endpoint**
> - Create `routes/auth.py`
> - Run `pytest tests/test_auth.py::test_login -v`
> - Result: PASS
> 
> **Task 4: Add JWT token generation**
> - Create `utils/auth.py`
> - Run `pytest tests/test_auth.py::test_token -v`
> - Result: PASS
> 

## What If Tests Fail?

If a test fails, you have a few options:

1. **Fix the code.** If the code is wrong, fix it.
2. **Fix the test.** If the test is wrong, fix it.
3. **Skip the test.** If the test is not relevant, skip it.
4. **Ask for help.** If you're not sure, ask for help.

Don't leave failing tests. They indicate that something is wrong.
