export const DOMAIN_IDS = [
  "agentic-architecture",
  "tool-design-mcp",
  "claude-code-workflows",
  "prompt-engineering",
  "context-reliability",
] as const;

export type DomainId = (typeof DOMAIN_IDS)[number];

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type QuestionType =
  | "single-choice"
  | "multiple-response"
  | "architecture-decision"
  | "debugging"
  | "trade-off-analysis";

export interface Reference {
  label: string;
  url: string;
}

export interface CodeSample {
  label: string;
  language: string;
  code: string;
}

export interface LessonExample {
  title: string;
  body: string;
  code?: CodeSample;
}

export interface TradeOff {
  choice: string;
  gain: string;
  cost: string;
}

export interface Lesson {
  id: string;
  domainId: DomainId;
  title: string;
  summary: string;
  objectives: string[];
  explanation: { heading: string; body: string[] };
  whyItMatters: string[];
  diagram?: "agentic-loop" | "workflow-patterns" | "mcp-architecture" | "context-window";
  simpleExample: LessonExample;
  productionExample: LessonExample;
  antiPattern: { name: string; wrong: string; consequence: string; fix: string };
  tradeOffs: TradeOff[];
  handsOn: { title: string; steps: string[]; linkedLabId?: string };
  examQuestionId: string;
  takeaway: string;
  tags: string[];
}

export interface PracticeQuestion {
  id: string;
  domainId: DomainId;
  difficulty: Difficulty;
  type: QuestionType;
  scenario?: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionIds: string[];
  explanation: string;
  optionExplanations: Record<string, string>;
  principle: string;
  tags: string[];
  references: Reference[];
  isOfficial: false;
}

export interface ArchitectureScenario {
  id: string;
  title: string;
  businessRequirement: string;
  technicalConstraints: string[];
  question: string;
  choices: { id: string; text: string }[];
  correctChoiceId: string;
  choiceExplanations: Record<string, string>;
  explanation: string;
  architecturalPrinciple: string;
  difficulty: Difficulty;
  domainId: DomainId;
  tags: string[];
}

export interface LabStep {
  title: string;
  detail: string;
  code?: CodeSample;
}

export interface Lab {
  id: string;
  domainIds: DomainId[];
  title: string;
  estimatedMinutes: number;
  objective: string;
  prerequisites: string[];
  architecture: string[];
  steps: LabStep[];
  expectedOutput: string;
  validationChecklist: string[];
  extensionChallenge: string;
}
