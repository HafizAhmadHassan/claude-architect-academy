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
];
