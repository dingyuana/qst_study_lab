# Subagent-Driven Development

## When To Activate

This skill activates when you have a plan and you're ready to start implementing it. You want to use subagents to implement the tasks in parallel.

You want to activate when:

1. You have a plan with clear, bite-sized tasks.
2. You want to implement the tasks in parallel using subagents.
3. You want to review each subagent's work before moving on.

You probably want to activate **after** the plan is approved, and **before** you start implementing.

## Goal

The goal of this skill is to implement the plan using subagents. Each subagent implements a task, and you review their work before moving on.

For each task, you should:

1. Dispatch a subagent to implement the task.
2. Review the subagent's work.
3. Provide feedback if needed.
4. Move on to the next task.

## Steps

1. **Dispatch subagents one by one.** Go through the plan and dispatch a subagent for each task.
2. **Review the subagent's work.** After each subagent completes, review their work.
3. **Provide feedback.** If the work is not satisfactory, provide feedback and ask them to fix it.
4. **Commit the work.** If the work is satisfactory, commit it.
5. **Move on to the next task.** Repeat until all tasks are complete.

## How To Do Each Step

### Dispatch Subagents One By One

Go through the plan and dispatch a subagent for each task. For each task:

1. Read the task carefully. Understand what it's asking for.
2. Dispatch a subagent with the task details.
3. Wait for the subagent to complete.

### Review The Subagent's Work

After each subagent completes, review their work. This could be:

- Looking at the code changes.
- Running the tests.
- Checking that the code meets the requirements.

If the work is not satisfactory, provide feedback and ask them to fix it.

### Provide Feedback

If the work is not satisfactory, provide specific feedback. Explain what is wrong and how to fix it.

### Commit The Work

If the work is satisfactory, commit it. This helps keep the history clean.

### Move On To The Next Task

Repeat until all tasks are complete.

## What If The Subagent Is Stuck?

If the subagent is stuck, you have a few options:

1. **Provide guidance.** Give them more specific instructions.
2. **Break down the task.** If the task is too large, break it down further.
3. **Ask for help.** If you can't unblock them, ask for help.

## Common Mistakes

### Dispatching Too Many Subagents At Once

Don't dispatch too many subagents at once. It's hard to review their work if you're overwhelmed.

### Not Reviewing Carefully

Don't skip the review. It's easy to miss bugs if you don't review carefully.

### Not Providing Feedback

Don't be afraid to provide feedback. It's better to catch bugs early.

### Not Committing

Don't forget to commit. It helps keep the history clean.

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
> - Dispatch all subagents at once
> - Don't review their work
> - Don't commit

### After

> **Good Execution:**
> 
> **Task 1: Create user model**
> - Dispatch subagent with task details
> - Review changes
> - Feedback: "Add __repr__ method"
> - Subagent fixes it
> - Commit: "Add user model"
> 
> **Task 2: Create registration endpoint**
> - Dispatch subagent with task details
> - Review changes
> - Feedback: "None"
> - Commit: "Add registration endpoint"
> 
> **Task 3: Create login endpoint**
> - Dispatch subagent with task details
> - Review changes
> - Feedback: "Use password hashing"
> - Subagent fixes it
> - Commit: "Add login endpoint"
> 
> **Task 4: Add JWT token generation**
> - Dispatch subagent with task details
> - Review changes
> - Feedback: "None"
> - Commit: "Add JWT token generation"

## What If The Subagent's Work Is Not Satisfactory?

If the subagent's work is not satisfactory, provide specific feedback. Explain what is wrong and how to fix it. Ask them to fix it before moving on.

## What If The Subagent Is Not Following The Plan?

If the subagent is not following the plan, remind them of the plan. Ask them to follow the plan.

## What If The Subagent Is Making Changes Outside The Plan?

If the subagent is making changes outside the plan, ask them to stick to the plan. If the changes are necessary, update the plan.
