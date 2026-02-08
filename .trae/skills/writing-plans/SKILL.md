# Writing Plans

## When To Activate

This skill activates when you have an approved design and you're about to start implementing it. You want to break the work down into tasks before you start coding.

You want to activate when:

1. You have a clear spec/design to work from.
2. You're about to start implementing, and you don't have a plan yet.
3. The work is complex enough that it needs to be broken down.

You probably want to activate **after** the design is finalized, and **before** you start writing code.

## Goal

The goal of this skill is to break down the work into small, bite-sized tasks that can be completed in 2-5 minutes each.

Each task should:

- Be small enough that you can verify it works before moving on.
- Have clear completion criteria.
- Have exact file paths and complete code.
- Be verifiable.

## Steps

1. **Break down the work.** Go through the spec and break it down into tasks. Each task should be 2-5 minutes of work.
2. **Order the tasks.** Put the tasks in an order that makes sense. Often this means starting with foundation work and building up.
3. **Add verification steps.** For each task, add a clear way to verify that it works.
4. **Present the plan.** Show the plan to the user for approval before you start implementing.

## How To Do Each Step

### Break Down The Work

Go through the spec and break it down into tasks. Some guidelines:

- Each task should be 2-5 minutes of work. If it's longer, break it down further.
- Each task should be verifiable. You should be able to test it in isolation.
- Each task should have a clear definition of done.
- Each task should have exact file paths and complete code.
- Tasks should be ordered logically. Foundation first, then building on top.
- Don't include tasks for things you're not sure about yet. Add them as "to be determined" if needed.

Some common task types:

- **Setup tasks:** Create files, set up configs, etc.
- **Implementation tasks:** Write the actual code.
- **Test tasks:** Write tests to verify the code.
- **Refactor tasks:** Improve existing code.
- **Documentation tasks:** Add docs, comments, etc.

### Order The Tasks

Put the tasks in an order that makes sense. Some guidelines:

- Put foundational tasks first. If task B depends on task A, task A should come first.
- Put tasks that expose bugs earlier. It's better to find out something is wrong sooner.
- Put quick tasks first. It feels good to make progress.
- Group related tasks together.

### Add Verification Steps

For each task, add a clear way to verify that it works. This could be:

- "Run X test and verify it passes."
- "Run the app and verify Y happens."
- "Check that file Z exists and has content W."

### Present The Plan

Show the plan to the user for approval before you start implementing. If they have changes, update the plan and present it again.

## What If You Don't Know How To Do Something?

If you don't know how to do something, you can:

- Add a task to "research X" or "figure out how to do X."
- Add a task to "implement X" with a note that the approach is TBD.

It's okay to not know everything upfront. But you should have a plan for how to figure it out.

## Example

### Before

> **User:** I want to add user authentication to my app
> 
> **Design:** We need to add login, logout, and registration. We'll use JWT tokens. We'll store users in a database.
> 
> **Bad Plan:**
> 1. Add user authentication
> 2. Test it works

### After

> **Good Plan:**
> 
> **Task 1: Create user model**
> - File: `models/user.py`
> - Content: [complete code]
> - Verify: Run `python -c "from models.user import User; print('OK')"`
> 
> **Task 2: Create registration endpoint**
> - File: `routes/auth.py`
> - Content: [complete code]
> - Verify: Run `pytest tests/test_auth.py::test_register -v`
> 
> **Task 3: Create login endpoint**
> - File: `routes/auth.py`
> - Content: [complete code]
> - Verify: Run `pytest tests/test_auth.py::test_login -v`
> 
> **Task 4: Add JWT token generation**
> - File: `utils/auth.py`
> - Content: [complete code]
> - Verify: Run `pytest tests/test_auth.py::test_token -v`
> 
> ...

## Common Mistakes

### Tasks Too Large

If a task is taking more than 5 minutes, it's probably too large. Break it down further.

### Tasks Not Verifiable

If you can't verify a task in isolation, it's probably not well-defined. Add more detail.

### Missing Tasks

If you forget a task, add it. It's okay to update the plan as you go.

### Too Much Detail

Don't include every single line of code in the plan. Just include the key parts. The implementer will fill in the rest.
