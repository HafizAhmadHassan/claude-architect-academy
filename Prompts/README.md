# Prompts

## Tasks 1 
# Claude Architect Academy — Master Website Build Prompt

You are a senior product engineer, UX designer, instructional designer, and AI architect.

Build a production-quality educational website called:

**Claude Architect Academy**

The purpose is to help developers, software architects, AI engineers, and technical professionals prepare for the **Anthropic Claude Certified Architect – Foundations (CCA-F)** certification.

## Important positioning

This is an independent educational preparation platform.

Do NOT claim that this website is operated, owned, endorsed, or certified by Anthropic.

Clearly label Anthropic as the certification issuer and link users to official Anthropic resources for authoritative certification information.

Whenever certification facts may change, display:

"Always verify current exam information with Anthropic's official certification page."

Primary official certification resource:

https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification

Primary learning resource:

https://www.anthropic.com/learn

## Product vision

Create the best free interactive learning platform for people preparing for the Claude Certified Architect – Foundations certification.

The platform should teach architectural reasoning rather than encourage memorization.

The core philosophy:

LEARN → BUILD → TEST → EXPLAIN → REVIEW → REPEAT

## Target users

1. Software architects
2. AI engineers
3. Backend developers
4. Full-stack developers
5. Technical consultants
6. Engineering managers
7. Developers learning Claude
8. People preparing for the CCA-F exam

## Main navigation

Create:

* Home
* Certification
* Roadmap
* Domains
* Labs
* Practice Questions
* Mock Exam
* Flashcards
* Architecture Patterns
* Projects
* Resources
* Progress

## Homepage

Create a strong hero section:

"Become a Claude Architect."

Subtitle:

"Learn the architecture patterns, agentic systems, MCP integrations, Claude Code workflows, prompt engineering, and reliability practices needed to build production-grade Claude applications."

Primary CTA:

"Start the Roadmap"

Secondary CTA:

"Take Diagnostic Test"

Add:

* certification overview
* five domains
* learning roadmap
* hands-on projects
* practice questions
* progress tracking

## Certification page

Explain:

Claude Certified Architect – Foundations

Show:

* exam duration
* number of questions
* passing score
* exam delivery
* domain weights

Use the official Anthropic certification page as the source of truth.

Do not hard-code facts in multiple locations.

Create a central certification configuration/data object so exam details can be updated in one place.

## Five domains

Create separate learning areas for:

### Domain 1

Agentic Architecture & Orchestration

Weight: 27%

Topics:

* agentic loops
* orchestration
* multi-agent systems
* subagents
* task decomposition
* workflows
* handoffs
* hooks
* sessions
* state management
* production trade-offs

### Domain 2

Tool Design & MCP Integration

Weight: 18%

Topics:

* tool design
* tool schemas
* tool descriptions
* structured errors
* tool selection
* MCP clients
* MCP servers
* MCP resources
* authentication
* permissions
* failure handling

### Domain 3

Claude Code Configuration & Workflows

Weight: 20%

Topics:

* CLAUDE.md
* project instructions
* commands
* skills
* hooks
* permissions
* plan mode
* iterative development
* codebase exploration
* CI/CD
* automation

### Domain 4

Prompt Engineering & Structured Output

Weight: 20%

Topics:

* system prompts
* explicit instructions
* few-shot prompting
* structured outputs
* JSON schemas
* tool use
* validation
* retries
* evaluation
* multi-pass review

### Domain 5

Context Management & Reliability

Weight: 15%

Topics:

* context windows
* context degradation
* long-running agents
* summarization
* session management
* error propagation
* provenance
* human review
* escalation
* reliability
* observability

## Learning page design

Every topic should contain:

1. Concept explanation
2. Why it matters
3. Architecture diagram
4. Simple example
5. Production example
6. Common anti-pattern
7. Trade-offs
8. Hands-on exercise
9. Exam-style question
10. "Architect's takeaway"

Avoid walls of text.

Use diagrams, cards, decision trees, code examples, and interactive components.

## Interactive architecture scenarios

Create a scenario engine.

Each scenario should contain:

* business requirement
* technical constraints
* architecture choices
* multiple-choice answers
* correct answer
* explanation
* explanation of every incorrect option
* architectural principle
* difficulty
* domain
* tags

Example:

"Your company needs a customer-support agent that can access CRM data but must require human approval before modifying customer records."

Ask:

"What architecture should you choose?"

Then explain the architectural trade-offs.

## Practice question engine

Create:

* beginner questions
* intermediate questions
* advanced questions
* scenario questions

Question types:

* single choice
* multiple choice
* architecture decision
* debugging
* trade-off analysis

Every answer must include an explanation.

Do NOT reproduce real Anthropic exam questions.

All questions must be original and clearly labeled:

"Practice question — not an official Anthropic exam question."

## Mock exam

Create a timed mock examination interface.

Features:

* timer
* question navigation
* flag question
* answer selection
* progress indicator
* submit exam
* score
* domain breakdown
* weak-area analysis
* recommended lessons

Do not claim that the mock reproduces the actual exam.

Use wording:

"Exam-style practice."

## Flashcards

Create flashcards for:

* architecture patterns
* MCP concepts
* Claude Code concepts
* prompt engineering
* context management
* reliability
* common anti-patterns

Allow:

* flip
* known
* review later
* difficulty
* domain filtering

## Hands-on labs

Create at least these labs:

### Lab 1

Structured Claude API application

### Lab 2

Tool-use application

### Lab 3

MCP server

### Lab 4

Multi-agent research system

### Lab 5

Claude Code development workflow

### Lab 6

Production enterprise support agent

Each lab should contain:

* objective
* prerequisites
* architecture
* steps
* starter code
* expected output
* validation checklist
* extension challenge

## Architecture patterns library

Create a searchable pattern library.

Patterns:

* single agent
* agentic loop
* orchestrator/subagents
* sequential workflow
* parallel agents
* human-in-the-loop
* tool gateway
* MCP integration
* validation/retry
* evaluator pattern
* multi-pass review
* context compression
* escalation pattern

For each pattern show:

* diagram
* when to use
* when NOT to use
* benefits
* drawbacks
* complexity
* reliability considerations

## Progress tracking

Allow users to track:

* completed lessons
* completed labs
* practice score
* mock exam score
* domain mastery
* streak
* weak domains

Create a dashboard:

"Your Claude Architect Readiness"

Example:

Agentic Architecture: 82%
MCP: 67%
Claude Code: 74%
Prompt Engineering: 88%
Reliability: 61%

Then recommend the next lesson.

## Diagnostic assessment

On first visit, allow:

"Take a 15-question diagnostic."

After completion:

* calculate domain scores
* identify weakest domain
* recommend personalized roadmap
* create a study schedule

## Study planner

Allow users to select:

* 4 weeks
* 6 weeks
* 8 weeks
* 10 weeks
* 12 weeks

Allow:

* hours per week
* exam target date
* current skill level

Generate a personalized schedule.

## AI tutor

Create an optional AI tutor.

The tutor should behave like a senior Claude solutions architect.

Rules:

* Ask Socratic questions before giving answers.
* Explain architectural trade-offs.
* Challenge weak reasoning.
* Give hints progressively.
* Never pretend practice questions are official.
* Never claim knowledge of confidential Anthropic exam material.
* Encourage hands-on implementation.
* Explain why alternatives are wrong.

Tutor modes:

* Teach me
* Quiz me
* Review my architecture
* Explain this concept
* Give me a harder scenario
* Interview me
* Find my weak areas

## Architecture review tool

Allow users to enter an architecture description.

Example:

"I have one Claude agent that accesses 15 tools, stores all conversation history in the prompt, and directly modifies production data."

The AI reviewer should analyze:

* architecture
* context management
* tool design
* security
* reliability
* observability
* scalability
* human review
* cost
* failure modes

Output:

* strengths
* risks
* anti-patterns
* recommended architecture
* reasoning
* next steps

## Resource library

Create a curated resource section.

Prioritize official Anthropic resources.

Include:

* Anthropic Academy
* Claude API documentation
* MCP resources
* Claude Code resources
* Anthropic engineering articles
* Anthropic webinars
* official certification information

Clearly distinguish:

OFFICIAL ANTHROPIC RESOURCE

from:

COMMUNITY RESOURCE

Do not present third-party resources as official.

## Design

Use a modern technical education aesthetic.

Visual direction:

* dark/light mode
* deep charcoal
* electric purple
* subtle blue accents
* clean typography
* generous whitespace
* technical diagrams
* architecture cards
* progress visualization
* polished dashboard

Avoid excessive gradients.

Avoid generic AI imagery.

Make the site feel like:

"Linear + Stripe + modern developer documentation."

## Mobile

Fully responsive.

Prioritize mobile readability.

Navigation should become a mobile drawer.

Architecture diagrams should remain readable on small screens.

## Accessibility

Implement:

* semantic HTML
* keyboard navigation
* accessible color contrast
* ARIA labels where necessary
* focus states
* reduced motion support

## SEO

Create SEO-friendly pages for:

* Claude Certified Architect preparation
* Claude Architect certification
* Claude MCP tutorial
* Claude Agent SDK tutorial
* Claude Code certification preparation
* Claude agent architecture
* Claude architecture patterns
* Claude certification study plan

Do not use misleading claims such as:

"Official Anthropic Certification Course"

Instead use:

"Independent Claude Certified Architect preparation resource."

## Technical architecture

Use a modular architecture.

Suggested stack:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* PostgreSQL
* Prisma or equivalent ORM
* authentication provider
* server-side API routes
* optional vector database for AI tutor
* analytics

Keep content separate from application logic.

Use structured data files or CMS collections for:

* domains
* lessons
* questions
* flashcards
* labs
* architecture patterns
* resources

## Content safety and accuracy

Never invent Anthropic certification policies.

Never fabricate exam questions.

Never claim access to confidential exam material.

When certification details change, update the centralized certification metadata.

Include source attribution.

Use official Anthropic sources for current certification facts.

## Content generation system

Build a content schema so my AI agents can generate:

Lesson:

* title
* domain
* objectives
* explanation
* examples
* architecture diagram
* anti-patterns
* lab
* quiz
* references

Question:

* question
* scenario
* options
* correctAnswer
* explanation
* domain
* difficulty
* tags
* references
* isOfficial: false

## Agent workflow

Create separate AI agents for:

### Research Agent

Finds current official Anthropic documentation.

### Curriculum Agent

Converts research into lessons.

### Question Agent

Creates original practice questions.

### Reviewer Agent

Checks technical accuracy.

### Exam Coach Agent

Creates scenarios and explanations.

### UX Agent

Improves learning experience.

### SEO Agent

Creates metadata and internal linking.

### QA Agent

Checks broken links, incorrect claims, duplicated content, and misleading certification language.

Pipeline:

Research
→ Curriculum
→ Content
→ Technical Review
→ Exam Review
→ QA
→ Publish

## Important source policy

For current certification facts, prefer:

1. Anthropic official certification page
2. Anthropic Academy
3. Anthropic documentation
4. Anthropic engineering resources

Use community resources only as supplemental material.

## Final deliverables

Build:

1. Production-ready website
2. Responsive UI
3. Landing page
4. Certification overview
5. Five domain learning paths
6. 10-week roadmap
7. Diagnostic test
8. Practice question engine
9. Mock exam
10. Flashcards
11. Hands-on labs
12. Architecture pattern library
13. Progress dashboard
14. AI tutor
15. Architecture review tool
16. Resource library
17. SEO structure
18. Analytics
19. Admin/content management architecture
20. Automated content QA

## First implementation task

Before coding the complete application:

1. Create the information architecture.
2. Create the database/content schema.
3. Create the homepage.
4. Create the certification page.
5. Create the five-domain roadmap.
6. Create one complete domain lesson.
7. Create 10 original practice questions.
8. Create one interactive architecture scenario.
9. Create one hands-on MCP lab.
10. Show me the implementation and ask for approval before expanding the rest of the platform.

Optimize for educational quality, architectural correctness, speed, accessibility, and maintainability.
