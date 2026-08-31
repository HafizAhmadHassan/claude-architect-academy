# Claude Architect Academy
*Created: 2026-08-23*

An independent, open-source study platform for the **Claude Certified Architect – Foundations (CCA-F)** certification issued by Anthropic. The website lives in the [`claude-academy/`](./claude-academy) directory and is built with Next.js, React 19, TypeScript, and Tailwind CSS 4.

> **Disclaimer:** Claude Architect Academy is an independent educational preparation platform. It is not operated, owned, or endorsed by Anthropic. Always verify current exam information on [Anthropic's official certification page](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification).

## What's Inside

- **Learning Roadmap** — a week-by-week study plan covering every exam domain
- **Lessons** — in-depth lessons across all five CCA-F exam domains:
  | # | Domain | Weight |
  | - | ------ | ------ |
  | 1 | Agentic Architecture & Orchestration | 27% |
  | 2 | Tool Design & MCP Integration | 18% |
  | 3 | Claude Code Configuration & Workflows | 20% |
  | 4 | Prompt Engineering & Structured Output | 20% |
  | 5 | Context Management & Reliability | 15% |
- **Diagnostic Test & Mock Exams** — timed practice engines that mirror the real exam format (60 items, scenario-based questions with per-option explanations)
- **Practice Question Bank** — domain-tagged questions with detailed explanations for every answer choice
- **Hands-on Labs** — practical exercises including building MCP servers, tool contracts, and agentic workflows
- **Architecture Pattern Library** — 13 production patterns with SVG diagrams
- **Scenario Player** — interactive, realistic production scenarios
- **Capstone Projects** — rubric-driven projects to apply what you've learned
- **Flashcards** — spaced-repetition-friendly review decks
- **Study Tools** — progress dashboard, bookmarks, notes, achievements, study timer, and full-text search

## Getting Started

### Prerequisites

- Node.js 22+
- npm

### Run Locally

```bash
cd claude-academy
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Scripts

```bash
npm run build   # production build (static export for GitHub Pages)
npm run start   # serve the production build
npm run lint    # run ESLint
npx tsx scripts/verify-content.ts  # validate content integrity (IDs, references, explanations)
```

## Project Structure

```
claude-academy/
├── src/
│   ├── app/            # Next.js App Router pages (roadmap, domains, labs, mock-exam, ...)
│   ├── components/     # React components (exam engine, flashcards, diagrams, ...)
│   └── lib/
│       └── content/    # All study content: lessons, questions, labs, patterns,
│                       # flashcards, scenarios, roadmap — plain typed data files
└── scripts/
    └── verify-content.ts  # Content integrity checks
```

## Contributing

Contributions from the public are welcome! This is a community resource, and there are many ways to help.

### Ways to Contribute

1. **Content improvements** — fix typos, clarify explanations, or expand lessons in `src/lib/content/`
2. **New practice questions** — add exam-style questions to `src/lib/content/questions/` (every option needs an explanation)
3. **New labs or patterns** — contribute hands-on labs (`src/lib/content/labs/`) or architecture patterns (`src/lib/content/patterns.ts`)
4. **Flashcards & scenarios** — add review cards or interactive scenarios
5. **Bug reports & feature ideas** — open a [GitHub Issue](https://github.com/HafizAhmadHassan/claude-architect-academy/issues)
6. **UI/UX improvements** — improve accessibility, responsiveness, or add features

### How to Submit a Contribution

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/my-contribution
   ```
2. **Make your changes.** Study content lives as typed data in `src/lib/content/` — follow the existing shapes in `src/lib/content/types.ts`.
3. **Validate before submitting:**
   ```bash
   cd claude-academy
   npm run lint
   npx tsx scripts/verify-content.ts
   npm run build
   ```
4. **Open a Pull Request** with a clear description of what you changed and why.

### Content Guidelines

- Keep content accurate to the official [CCA-F exam guide](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification); cite official sources where possible
- Every practice question must include an explanation for **each** option (correct and incorrect)
- Use valid, unique IDs and reference only existing lesson/lab/domain IDs — `scripts/verify-content.ts` will catch mistakes
- Stay framework-neutral and focus on production-grade architecture practices
- Do not copy proprietary Anthropic exam material; write original educational content

## Deployment

The site is automatically built and deployed to GitHub Pages on every push to `main` via [.github/workflows/deploy-pages.yml](./.github/workflows/deploy-pages.yml).
