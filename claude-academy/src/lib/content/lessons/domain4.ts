import type { Lesson } from "../types";

export const domain4Lessons: Lesson[] = [
  {
    id: "few-shot-structured-output",
    domainId: "prompt-engineering",
    title: "Few-Shot Prompting & Structured Output",
    summary:
      "Concrete input/output examples anchor format fidelity better than any prose, and JSON schemas make the contract enforceable.",
    objectives: [
      "Select and order few-shot examples that cover the hard cases",
      "Write system prompts with explicit instructions instead of vibes",
      "Constrain outputs with JSON Schema and tool-based structured output",
      "Separate content from metadata using tagged document sections",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "Models imitate demonstrated behavior more reliably than described behavior. Two or three input/output pairs — including one deliberately messy edge case — anchor the target distribution far better than another paragraph of rules. Examples should be diverse where the task varies and identical where it must not.",
        "Structured output closes the loop: define a JSON Schema for the response (via tool-use forced output or API structured-output features), so validation is mechanical. Inside long prompts, wrap each source document in tags with its metadata (source URL, title, date) so extracted claims can carry provenance.",
      ],
    },
    whyItMatters: [
      "Few-shot examples are named as the most effective technique for consistently formatted output in blueprint study guidance.",
      "Domain 4 weighs 20%; extraction pipelines are its signature scenario.",
      "Provenance-aware prompting feeds directly into Domain 5's citation requirements.",
    ],
    simpleExample: {
      title: "Schema + examples",
      body: "The schema defines shape; the few-shot pairs demonstrate normalization of dirty input.",
      code: {
        label: "extract.ts",
        language: "typescript",
        code: `const invoiceSchema = {
  type: "object",
  properties: {
    vendor: { type: "string" },
    amount_minor: { type: "integer", description: "cents" },
    currency: { type: "string", enum: ["USD", "EUR", "GBP"] },
    due_date: { type: "string", description: "ISO-8601 or null" },
  },
  required: ["vendor", "amount_minor", "currency"],
};

// Example pair embedded before the real input:
// Input: "Acme GmbH — 1.240,50 EUR, payable 3/2026"
// Output: {"vendor":"Acme GmbH","amount_minor":124050,
//          "currency":"EUR","due_date":null}`,
      },
    },
    productionExample: {
      title: "Insurance claim intake",
      body: "A carrier extracts claim fields from adjuster emails. The prompt carries three examples: clean email, multi-claim thread (must return array), and missing-date case (must return null, never guess). Output uses tool-forced JSON against the schema; a retry pass re-runs with the validator's error message appended when checks fail. Field-level accuracy rose from 91% to 98.6%, with every remaining miss caught by validation rather than reaching downstream systems.",
    },
    antiPattern: {
      name: "Rule-of-the-week prompts",
      wrong:
        "Accumulating exception clauses ('if German number format then... if USD prefix...') until the prompt outgrows the task.",
      consequence:
        "Rules interact unpredictably, contradict older clauses, and still miss the next weird format — while token costs balloon.",
      fix:
        "Replace rule accretion with representative examples of each hard case plus a schema that makes ambiguity expressible (nulls, enums), letting the model generalize.",
    },
    tradeOffs: [
      {
        choice: "More few-shot examples",
        gain: "Tighter format clustering on varied inputs",
        cost: "Latency and cost per call; stale examples mislead silently",
      },
      {
        choice: "Schema-enforced output",
        gain: "Mechanical validation; guaranteed parseable shape",
        cost: "Over-constrained schemas force fabrication when data is absent",
      },
      {
        choice: "Tagged document sections",
        gain: "Clean provenance; reduced cross-document confusion",
        cost: "Prompt assembly layer must handle escaping and nesting",
      },
    ],
    handsOn: {
      title: "Beat the messy corpus",
      steps: [
        "Collect five genuinely messy inputs from your own inbox/domain.",
        "Write a zero-example prompt; record failure modes per field.",
        "Add two examples targeting exactly those failures; add a third only if needed.",
        "Enforce a schema allowing null for optional fields; measure again.",
      ],
      linkedLabId: "structured-api-app",
    },
    examQuestionId: "q-schema-fabrication",
    takeaway:
      "Show the format you want, schema what you will accept, and tag where everything came from.",
    tags: ["few-shot", "structured output", "json schema", "system prompts"],
  },
  {
    id: "validation-retries-evals",
    domainId: "prompt-engineering",
    title: "Validation, Retries & Evals",
    summary:
      "Close the quality loop: validate mechanically, retry with error context, and guard regressions with golden evaluation sets.",
    objectives: [
      "Design retry loops that feed validator errors back as corrective context",
      "Make schemas fabrication-proof with nullable fields and explicit absence semantics",
      "Build golden eval sets that gate prompt and model changes",
      "Apply multi-pass review with distinct rubrics instead of one overloaded pass",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "A production prompt is a function under test. Wrap every call in validate → retry: run schema and business checks, and on failure re-invoke with the original input plus the specific errors ('amount_minor must be integer cents; you returned a float'). Two retries with escalating specificity catch most drift without masking systemic issues.",
        "Evals are regression insurance. Freeze a golden set of inputs with expected outputs (or graded rubrics) covering each documented hard case; run it on every prompt change, model upgrade, or temperature tweak. A prompt that cannot be evaluated cannot be safely improved.",
        "For review-shaped tasks, split passes by concern — factual accuracy pass, tone pass, policy pass — each with its own rubric, rather than asking one pass to optimize everything at once.",
      ],
    },
    whyItMatters: [
      "Validation and retries are explicit Domain 4 topics; evaluation appears in both D4 and D5 task lists.",
      "Multi-pass review patterns show up across blueprint scenarios for code review and document QA.",
      "Regression protection is what makes iteration safe enough to do continuously.",
    ],
    simpleExample: {
      title: "Retry with error feedback",
      body: "The validator's message becomes the model's next instruction:",
      code: {
        label: "retry-loop.ts",
        language: "typescript",
        code: `let attempt = 0, output;
while (attempt < 3) {
  output = await generate(input, attempt > 0 ? errors : undefined);
  errors = validate(output, schema, businessRules);
  if (!errors.length) break;
  attempt++;
}
if (errors.length) throw new PipelineError(errors);

function validate(out, schema, rules) {
  const errs = ajv.validate(schema, out)
    ? [] : [ajv.errorsText()];
  if (Number.isInteger(out?.amount_minor) === false)
    errs.push("amount_minor must be integer cents");
  return [...errs, ...rules.map(checkBusiness)];
}`,
      },
    },
    productionExample: {
      title: "Golden set gates a model migration",
      body: "A support-intent classifier team maintained 400 labeled tickets (30% adversarial edits like typos and injected instructions). When leadership pushed an early upgrade to the newest model, evals flagged a 7-point regression on refund-policy intents before rollout. The team shipped anyway only after adding three targeted few-shot examples that closed the gap — evidence over vibes, scheduled in CI nightly.",
    },
    antiPattern: {
      name: "Infinite polite retries",
      wrong:
        "Re-sending identical requests on validation failure, hoping different output emerges.",
      consequence:
        "Tripled latency and cost with near-identical failures; systematic issues hide behind occasional lucky passes.",
      fix:
        "Every retry must add information: the precise validation errors, the offending output, and which rule failed. Cap attempts and escalate persistent failures to humans.",
    },
    tradeOffs: [
      {
        choice: "Strict schema validation",
        gain: "Downstream systems trust every payload",
        cost: "Legitimately fuzzy cases bounce as errors unless schema allows nulls/enums",
      },
      {
        choice: "Error-informing retries",
        gain: "Self-correcting pipeline without human touch",
        cost: "Up to N× cost on pathological inputs; needs caps and alerting",
      },
      {
        choice: "Golden eval gating",
        gain: "Fearless iteration; objective model-comparison data",
        cost: "Set authorship effort; sets go stale as products evolve",
      },
    ],
    handsOn: {
      title: "Ship a self-correcting extractor",
      steps: [
        "Take your week-8 extraction prompt and add business-rule validators beyond schema.",
        "Implement up-to-three retries appending formatted error messages.",
        "Freeze ten golden inputs including two adversarial ones; script the eval.",
        "Break your prompt on purpose; confirm evals catch it before you would have.",
      ],
      linkedLabId: "structured-api-app",
    },
    examQuestionId: "q-retry-error-context",
    takeaway:
      "Validate mechanically, retry informatively, evaluate continuously. Prompts are code; treat them like it.",
    tags: ["validation", "retries", "evaluation", "multi-pass review"],
  },
  {
    id: "system-prompt-architecture",
    domainId: "prompt-engineering",
    title: "System Prompt Architecture & Role Design",
    summary:
      "Structure system prompts as layered contracts: role definition, behavioral constraints, output format, and runtime context — each with clear boundaries.",
    objectives: [
      "Design system prompts with distinct layers: role, rules, format, context",
      "Use role definitions to anchor behavioral defaults without over-constraining",
      "Separate immutable constraints from task-specific instructions",
      "Manage prompt length to preserve attention for the most important directives",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "A system prompt is a contract between your application and the model. Layer it deliberately: role definition sets the baseline persona and expertise; behavioral rules define hard constraints (never fabricate, always cite, refuse out-of-scope requests); output format specifies the response shape; and runtime context carries task-specific data injected per call.",
        "The architecture matters because attention is finite. Directives at the top and bottom of a prompt receive more weight than those buried in the middle. Put your hardest constraints (safety, format) at the edges, and your softest guidelines (tone, style) where they can be outweighed by more important instructions if attention is tight.",
      ],
    },
    whyItMatters: [
      "System prompt design is a core Domain 4 topic — the exam tests whether you can structure prompts for reliability.",
      "Role definition quality directly impacts instruction-following consistency.",
      "Prompt architecture determines how well instructions survive at scale across varied inputs.",
    ],
    simpleExample: {
      title: "Layered system prompt",
      body: "Four sections with clear responsibilities:",
      code: {
        label: "system-prompt.ts",
        language: "typescript",
        code: `const systemPrompt = \`
## Role
You are a financial data extraction assistant. You are precise, cautious, and never speculate.

## Rules (immutable)
- Return null for fields you cannot determine from the input
- Never invent numeric values or dates
- If the input is not financial data, return { error: "not_financial" }

## Output format
Respond with valid JSON matching this schema:
{ vendor: string, amount: number | null, currency: string, date: string | null }

## Context
Current task: extract invoice data from email text.
Today's date: \${new Date().toISOString().slice(0, 10)}
\`;`,
      },
    },
    productionExample: {
      title: "Multi-tenant classification system",
      body: "A SaaS platform uses a base system prompt shared across tenants, with per-tenant context injected at runtime (industry-specific labels, compliance rules, output schemas). The base prompt defines the classifier role and universal constraints; tenant context adds domain-specific categories and examples. This separation means prompt improvements roll out to all tenants automatically while tenant-specific behavior stays configurable without prompt rewrites.",
    },
    antiPattern: {
      name: "The wall-of-text prompt",
      wrong:
        "A single 3,000-token system prompt mixing role, rules, examples, context, and edge cases with no structure.",
      consequence:
        "Model attention scatters; critical safety rules buried at position 1,500 get overridden by later instructions; debugging which directive caused a behavior is impossible.",
      fix:
        "Layer and label each section. Put safety and format at top and bottom. Keep total length under 1,500 tokens for non-complex tasks. Link to external docs instead of inlining.",
    },
    tradeOffs: [
      {
        choice: "Minimal role prompt",
        gain: "Maximum attention on task-specific instructions; fast inference",
        cost: "May under-specify behavior for edge cases",
      },
      {
        choice: "Comprehensive layered prompt",
        gain: "Consistent behavior across varied inputs; clear contracts",
        cost: "Token overhead; diminishing returns beyond ~1,500 tokens",
      },
      {
        choice: "Separate immutable vs. mutable sections",
        gain: "Safety rules survive prompt injection; clear audit trail",
        cost: "Prompt assembly layer adds complexity",
      },
    ],
    handsOn: {
      title: "Architecture a production prompt",
      steps: [
        "Take an existing prompt and separate it into four labeled layers.",
        "Move safety-critical rules to the top and bottom of the prompt.",
        "Measure token count — can you cut 20% without losing behavior?",
        "Test with adversarial inputs: does the model respect constraints when the user tries to override them?",
      ],
    },
    examQuestionId: "q-system-prompt-structure",
    takeaway:
      "Prompt architecture is information architecture. Layer by priority, separate by stability, and measure attention cost.",
    tags: ["system prompts", "role design", "prompt architecture", "instruction design"],
  },
  {
    id: "multi-pass-review",
    domainId: "prompt-engineering",
    title: "Multi-Pass Review & Chain-of-Thought Patterns",
    summary:
      "Split complex reasoning into distinct passes — each with its own rubric — so quality compounds instead of competing within a single generation.",
    objectives: [
      "Design multi-pass pipelines where each pass has a single concern",
      "Use chain-of-thought prompting to make reasoning traceable and debuggable",
      "Apply self-critique patterns where the model evaluates its own output",
      "Choose between single-pass and multi-pass based on task complexity",
    ],
    explanation: {
      heading: "Concept",
      body: [
        "Single-pass generation optimizes for one thing at a time. When a task requires multiple quality dimensions — factual accuracy, formatting, policy compliance, tone — asking the model to optimize all at once produces mediocre results across the board. Multi-pass review assigns each dimension its own pass with a specific rubric.",
        "Chain-of-thought (CoT) makes the reasoning visible. Instead of asking for a final answer, prompt the model to show its work: 'First, identify the relevant facts. Then, evaluate each against the policy. Finally, render the decision.' CoT is especially powerful for audit-heavy domains where you need to verify the reasoning, not just the output.",
      ],
    },
    whyItMatters: [
      "Multi-pass review patterns are explicit Domain 4 topics in the exam blueprint.",
      "Code review and document QA scenarios test whether you can decompose evaluation into focused passes.",
      "CoT is required for any task where reasoning traceability matters for compliance or debugging.",
    ],
    simpleExample: {
      title: "Two-pass document review",
      body: "Pass 1: factual accuracy. Pass 2: policy compliance. Each has a distinct rubric.",
      code: {
        label: "multi-pass.ts",
        language: "typescript",
        code: `// Pass 1: Accuracy
const accuracyResult = await generate({
  system: "Review the document for factual accuracy. For each claim, output: {claim, source?, status: 'verified'|'unverified'|'contradicted'}",
  input: document,
});

// Pass 2: Policy compliance (uses Pass 1 output)
const complianceResult = await generate({
  system: "Review this document for policy compliance. Flag: {section, rule, severity, suggestion}",
  input: { document, accuracyReport: accuracyResult },
});`,
      },
    },
    productionExample: {
      title: "Medical claim adjudication pipeline",
      body: "An insurer runs a three-pass pipeline for claim review: Pass 1 extracts structured fields with confidence scores; Pass 2 validates against policy rules (coverage limits, pre-authorization requirements); Pass 3 generates the adjudication letter with reasoning. Each pass has its own eval set. The pipeline auto-approves 73% of claims with 99.7% accuracy; the remaining 27% go to human adjusters with the full reasoning trace attached.",
    },
    antiPattern: {
      name: "Everything-in-one-pass",
      wrong:
        "Asking a single prompt to extract data, check compliance, and write a summary simultaneously.",
      consequence:
        "The model trades off between dimensions; extraction errors compound into wrong compliance checks; the summary inherits both failures.",
      fix:
        "Decompose into passes by concern. Each pass validates independently before feeding the next. Budget tokens per pass rather than trying to do everything in one generation.",
    },
    tradeOffs: [
      {
        choice: "Multi-pass pipeline",
        gain: "Each dimension gets focused attention; easier to evaluate and debug",
        cost: "Higher latency and cost; inter-pass data must be structured",
      },
      {
        choice: "Chain-of-thought in single pass",
        gain: "Reasoning is visible without separate passes; moderate cost increase",
        cost: "Longer generations; model may rationalize errors in its reasoning",
      },
      {
        choice: "Self-critique pass",
        gain: "Catches own errors without external validation",
        cost: "Model may be over-confident in self-assessment; needs calibration",
      },
    ],
    handsOn: {
      title: "Build a review pipeline",
      steps: [
        "Take a task you currently do in one prompt and split it into 2-3 focused passes.",
        "Define a rubric for each pass (3-5 criteria with pass/fail).",
        "Measure quality improvement: does the multi-pass pipeline catch errors the single pass misses?",
        "Add a self-critique step: ask the model to rate its own output against the rubric.",
      ],
    },
    examQuestionId: "q-multi-pass-review",
    takeaway:
      "One pass per concern, one rubric per pass. Quality compounds when dimensions don't compete.",
    tags: ["multi-pass", "chain-of-thought", "review patterns", "self-critique"],
  },
];
