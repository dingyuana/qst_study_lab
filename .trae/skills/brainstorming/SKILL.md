# Brainstorming

## When To Activate

This skill activates when you notice that the user is giving you a vague or rough idea of what they want. They might say something like:

- "help me plan this feature"
- "let's debug this issue"
- "build me a web app that does X"
- "I want to add feature X to project Y"

You want to activate when:

1. There's no spec yet. The user has just indicated what they want to build or change.
2. You're not clear on the exact requirements or design.
3. The work you should do isn't obvious from the conversation so far.
4. The user hasn't confirmed a final design yet.

You probably want to activate **before** writing code, tests, or even detailed plans.

## Goal

The goal of this skill is to:

1. Refine the user's rough idea into something precise enough to build.
2. Help the user explore alternatives and edge cases they might not have considered.
3. Present your design in sections, short enough to actually read and digest, for the user to validate.
4. Save the final design as a spec document that you'll reference later.

This design should be detailed enough that a developer could build it without asking any more questions. But it shouldn't be so detailed that it's tedious to review.

## Steps

1. **Explore the user's idea.** Ask questions to understand what they're trying to accomplish. Explore alternatives and edge cases. Help them articulate their vision more precisely.

2. **Present your design in sections.** Don't dump a giant spec on them. Present it in sections. Each section should be short enough to actually read and digest. Let them respond before moving on to the next section. This is a dialogue, not a monologue.

3. **Save the final design.** Once the design is finalized, save it as a spec document. Reference it later when writing plans and reviewing code.

## How To Do Each Step

### Explore The User's Idea

Start by asking clarifying questions. Some ideas for questions:

- What are you trying to accomplish? Why?
- Who is this for? How will they use it?
- What should happen? What should NOT happen?
- What are the edge cases? What's the weirdest use case you can think of?
- What does success look like? How will you know if you've achieved it?
- What's the simplest version that would still be useful?
- What are you NOT building right now?
- Are there any existing solutions you like? What do you like about them?
- What constraints are you working with? (time, budget, compatibility, etc.)

Take your time. This step is worth the investment.

### Present Your Design In Sections

Your spec should be detailed enough that a developer could build it without asking any more questions. But it shouldn't be so detailed that it's tedious to review. Aim for something that would make a good README.md.

Some sections you might want to include:

- **Overview** - A brief description of what you're building.
- **Goals** - What you're trying to accomplish. Why now?
- **Non-Goals** - What you're explicitly NOT building.
- **Design** - The main meat. How it works. Data models, API surfaces, algorithms, etc.
- **Alternatives** - Other approaches you considered. Why you didn't choose them.
- **Testing** - How you'll know it works. Test scenarios.
- **Risks** - What could go wrong? What's unknown?
- **Open Questions** - Things you haven't figured out yet.

Don't include all of these sections if they're not relevant. And don't make a section if it would just be "TBD".

Aim for something like 3-7 sections total. Each section should be a few paragraphs at most. If a section is getting too long, break it up into smaller sections or remove less important details.

### Save The Final Design

Save the final design as a spec document. Put it in `.trae/documents/` or a similar location. Name it something like `SPEC-{ticket-name}.md`. Reference it later when writing plans and reviewing code.

## What If The User Just Wants Code?

Some users will say "just write the code" when you try to activate this skill. You should be respectful of their wishes, but you should also push back. Explain the value of design:

- It helps catch bugs before you write them.
- It surfaces edge cases you might not have thought about.
- It gives you a reference to come back to.
- It helps others understand what you're building.

But ultimately, if they insist, just write the code. The skill is here to help, not to force.

## Examples

### Good Activation

> **User:** help me plan this feature
>
> **Agent: *activating skill***
> 
> Before we dive in, I want to make sure I understand what you're trying to build.
> 
> What are you trying to accomplish? Why do you need this feature now?
> 
> Who is this for? How will they use it?
> 
> ...

### Bad Activation

> **User:** I need you to write a test for the login function
> 
> **Agent: *activating skill***
> 
> Before we write the test, I want to understand what you're trying to accomplish...
> 
> *(This is a waste of time. The task is already well-defined.)*

### Good Example

> **User:** I want to add a dark mode to my website
> 
> **Agent: *activating skill***
> 
> Before we dive in, I want to make sure I understand what you're trying to build.
> 
> **Questions:**
> 
> 1. What are you trying to accomplish? Why dark mode now?
> 2. Should it respect the user's system preference?
> 3. Should users be able to toggle it?
> 4. What elements need to change? Just the background/text, or more?
> 5. Are there any accessibility considerations?
> 
> ...

## What If The Design Changes Mid-Way?

If the user changes the design mid-way, it's often worth activating this skill again to update the spec. It's better to keep the spec accurate than to have it drift from reality.
