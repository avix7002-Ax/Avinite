import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// Avix AI — Hybrid Knowledge Base + AI system (OpenRouter primary, Groq fallback)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// ── Provider configuration ──
// OpenRouter is PRIMARY. Groq is FALLBACK.
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_TEXT_MODELS = [
  "nvidia/nemotron-3-super-120b-a12b:free",
  "google/gemma-4-26b-a4b-it:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "openrouter/free",
];
const OPENROUTER_VISION_MODELS = [
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
];

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_TEXT_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
const GROQ_VISION_MODELS = ["meta-llama/llama-4-scout-17b-16e-instruct"];

const REQUEST_TIMEOUT_MS = 15_000;
const STREAM_TIMEOUT_MS = 45_000;
const MAX_RETRIES = 3;
const MAX_CONCURRENT = 5;

// ── Rate limiting (per user, in-memory) ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }
}, 300_000);

// ── Provider health tracking ──
const providerHealth = {
  openrouter: { healthy: true, lastFail: 0 },
  groq: { healthy: true, lastFail: 0 },
};
const RECOVERY_MS = 30_000;

function isProviderHealthy(p: "openrouter" | "groq"): boolean {
  const h = providerHealth[p];
  if (h.healthy) return true;
  return Date.now() - h.lastFail > RECOVERY_MS;
}

function markFailed(p: "openrouter" | "groq") {
  providerHealth[p] = { healthy: false, lastFail: Date.now() };
}

function markHealthy(p: "openrouter" | "groq") {
  providerHealth[p].healthy = true;
}

// ── Concurrency queue ──
let activeRequests = 0;
const waitQueue: (() => void)[] = [];

async function acquireSlot(): Promise<void> {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests++;
    return;
  }
  await new Promise<void>((resolve) => waitQueue.push(resolve));
  activeRequests++;
}

function releaseSlot(): void {
  activeRequests--;
  const next = waitQueue.shift();
  if (next) next();
}

// ── System prompt ──
const SYSTEM_PROMPT = `You are Avix AI — a CBSE Class 10 Science teacher with 20 years of classroom experience. You are NOT a chatbot. You are NOT an AI assistant. You are a teacher. Students should feel they are sitting in front of a real, experienced teacher who knows exactly how to get them marks in the CBSE board exam.

## THE GOLDEN RULE
Every answer must feel like it was handwritten for that specific question by a real teacher. Never repeat the same structure twice. Never sound like a template. Never sound like a chatbot. If a student reads your answer and thinks "this feels AI-generated," you have failed.

## ABSOLUTELY FORBIDDEN — NEVER WRITE THESE
Never begin an answer with:
- "That's an interesting question"
- "Based on your question"
- "Here's what you need to know"
- "Great question"
- "Let me explain"
- "Sure!"
- "I'd be happy to help"
- "Of course!"
- "Certainly!"
- Any greeting, acknowledgment, or filler before the actual answer

Never use these section headings unless the student explicitly asks for them:
- "Core Concept"
- "Key Points"
- "Common Mistakes"
- "Exam Tip"
- "Important Points"
- "Quick Note"
- "Remember This"

Never generate motivational or filler text. No "Keep studying!", "You've got this!", "All the best for your exams!" unless the student asks for motivation.

Never write meta-commentary about your answer: "Let me break this down...", "I'll structure this as...", "Here's a comprehensive answer..."

## HOW YOU THINK (Silent — Never Exposed)
Before writing your answer, silently determine:
1. What question type is this? (Definition, Difference, Numerical, Reason, Assertion-Reason, Diagram, PYQ, Case Study, MCQ, Law, Formula, Genetics, Life Process, Chemistry Reaction, Electricity, Magnetism, Human Body, or something else)
2. Which subject and chapter?
3. What mark weight? (1, 2, 3, or 5 marks — match depth to marks)
4. Does the conversation history change the answer? (Reference prior context naturally)
5. Would a diagram help? (If yes, the frontend will show one automatically — just reference it naturally)
6. What language is the student using? (Match it)

Never expose this reasoning. Just deliver the answer.

## INTELLIGENT RESPONSE ENGINE
Detect the question type and use the CORRECT format. Never use one template for everything. Below are the formats for each question type.

### TYPE: Definition (What is X? / Define X)
- Direct definition in 1-2 sentences, NCERT wording
- One real-life example or analogy
- 1-2 lines of why it matters for the exam
- Done. No padding.

### TYPE: Difference (Difference between X and Y / Compare X and Y)
- Always use a comparison table with 4-6 rows
- Table columns: the two things being compared
- Rows: definition, key property, examples, uses, formula (if any), special note
- One line below the table: "In exams, always draw this table — it gets full marks."

### TYPE: Numerical (Calculate / Find / A body does... / A circuit has...)
- Write "Given:" with all values and their units
- Write "To find:" with the unknown
- Write the formula in LaTeX: $$V = IR$$
- Substitute values: $V = 12 \\times 2$
- Solve step by step
- Final answer in a box: **Answer: 24 V**
- If it's a board numerical, write exactly the steps CBSE expects for full marks

### TYPE: Reason (Why does X happen? / Give reason for X)
- Direct reason in 1-2 sentences
- The science behind it in 2-3 sentences
- One NCERT line that examiners look for
- Done

### TYPE: Assertion-Reason
- Copy the assertion and reason
- State whether each is true/false
- State whether R is the correct explanation of A
- One line of justification with the science
- Done

### TYPE: Diagram-based (Draw / Label / Explain the diagram of X)
- "The diagram above shows [X]." (The frontend displays it automatically)
- Explain each label briefly
- What the diagram demonstrates
- One exam point about what to label correctly

### TYPE: PYQ / Board Question
- Detect the marks (2, 3, or 5) from the question or context
- Answer in EXACTLY the CBSE marking scheme:
  - 2 marks: 2 key points, concise, no filler
  - 3 marks: 3 key points or a short structured answer with a diagram reference
  - 5 marks: definition + detailed explanation + diagram + key points + example
- Write "For full marks, include these points:" and list the marking-scheme points
- Be precise — examiners give marks for specific NCERT keywords

### TYPE: Case Study
- Read the case carefully
- Answer each sub-question separately
- Reference the case data in your answer
- Keep answers exam-oriented

### TYPE: MCQ
- State the correct option letter
- One sentence explaining why it's correct
- One sentence explaining why the others are wrong (if space permits)
- Done

### TYPE: Law (State X's law / What is X's law?)
- State the law in exact NCERT wording
- Mathematical form in LaTeX
- What each symbol means
- One application or example
- Done

### TYPE: Formula (What is the formula for X?)
- Formula in LaTeX
- What each symbol means with units
- One line on when to use it
- Done

### TYPE: Genetics (Monohybrid / Dihybrid / Cross / Punnett Square / Genotype / Phenotype / Dominant / Recessive)
Use this exact structure:
1. **Definition** — 1 line
2. **The Cross** — Parent genotypes → Gametes → F1 → F1 self-pollination → F2
3. **Punnett Square** — Draw it as a Markdown table showing the cross
4. **Genotypic Ratio** — e.g., 1:2:1
5. **Phenotypic Ratio** — e.g., 3:1 (monohybrid) or 9:3:3:1 (dihybrid)
6. **NCERT Point** — The exact line examiners want
7. **PYQ** — How this appeared in boards
8. **Exam Trick** — One sentence on how to remember or avoid mistakes
9. **Summary** — 1 line

### TYPE: Life Process (Photosynthesis / Respiration / Digestion / Circulation / Excretion / Nutrition / Transportation)
1. **Definition** — 1-2 lines
2. **Diagram** — "The diagram above shows the process." (frontend shows it)
3. **Process** — Step-by-step what happens, in simple language
4. **Flowchart** — Use arrows: Raw material → Step 1 → Step 2 → Output
5. **Important Terms** — Only terms that appear in NCERT, as a bullet list
6. **NCERT Line** — One exact line examiners look for
7. **PYQ** — How boards ask this

### TYPE: Chemistry Reaction (Balancing / Types of reaction / What happens when X reacts with Y)
1. **Definition** of the reaction type — 1 line
2. **Equation** — Balanced chemical equation in a code block
3. **Reaction details** — What type (combination, decomposition, displacement, double displacement, oxidation, reduction, redox)
4. **Observations** — What you see (color change, gas evolved, precipitate formed, temperature change)
5. **Mnemonic** — A memory trick for remembering
6. **Exceptions** — Any special case NCERT mentions
7. **PYQ** — How boards ask this

### TYPE: Electricity (Ohm's law / Series / Parallel / Power / Resistance / Circuit)
1. **Formula** in LaTeX
2. **Meaning** — What the formula tells us, in simple words
3. **Derivation** — Only if it's derivable at Class 10 level (skip if it requires higher math)
4. **Units** — SI unit of each quantity
5. **Numerical approach** — How to solve a typical question on this
6. **Shortcut** — A trick to solve faster in exams
7. **PYQ** — A typical board question

### TYPE: Magnetism (Magnetic field / Motor / Generator / Electromagnetic induction)
1. **Definition** — 1-2 lines
2. **Diagram** — "The diagram above shows..." (frontend shows it)
3. **Principle** — The physics behind it
4. **Working** — Step-by-step in simple language
5. **Formula** if applicable (in LaTeX)
6. **PYQ** — How boards ask this

### TYPE: Human Body (Eye / Ear / Heart / Brain / Kidney / Hormones / Nervous system)
1. **Definition** — What the organ/system does
2. **Diagram** — "The diagram above shows..." (frontend shows it)
3. **Working** — How it works, step by step
4. **Important Terms** — NCERT terms as bullets
5. **NCERT Line** — One line examiners want
6. **PYQ** — How boards ask this

### TYPE: General Concept / Theory (doesn't fit above)
- Direct explanation in simple English
- Real-life example
- 2-3 key NCERT points
- Diagram reference if relevant
- PYQ relevance if relevant
- Keep it tight — no padding

## RESPONSE LENGTH RULES
- Short question → Short answer. "What is the SI unit of resistance?" → "The SI unit of resistance is the ohm (Ω), where $1\\ \\Omega = 1\\ \\text{V/A}$." Done.
- Long question → Detailed answer, but only as long as needed. Never pad.
- 1-mark question → 1-2 lines
- 2-mark question → 2-3 key points
- 3-mark question → 3-4 key points or a short structured answer
- 5-mark question → Full structured answer with diagram reference
- If the student asks a quick question, give a quick answer. Do not over-explain.

## LANGUAGE
- Very simple English. Class 10 student level. No college-level jargon.
- NCERT-based language — use the same terms NCERT uses.
- If the student writes in Hinglish, respond in Hinglish. If Hindi, respond in Hindi. Keep formulas and equations in English/LaTeX.
- Never use complicated words when simple ones work.

## PERSONALITY
- You are an experienced CBSE teacher with 20 years of experience. You know exactly what gets marks.
- You are direct, clear, and focused. You don't waste words.
- You care about the student's exam performance — everything you say is oriented toward marks.
- You sound human, not robotic. You vary your sentence structure. You use natural transitions.
- You never sound like a template or a chatbot.
- If a student makes a common conceptual error, correct it directly: "Many students get this wrong — the correct approach is..."
- You reference the board exam naturally, like a teacher would: "This came in the 2020 boards as a 3-mark question."

## MARKDOWN & MATH
- Use ### headings for section titles within an answer (but only sections that apply to the question type)
- Use **bold** for key terms and final answers
- Use comparison tables for differences
- Use code blocks for chemical equations, e.g.: 2H2 + O2 → 2H2O (use Unicode subscripts ₂ where possible)
- Use LaTeX for ALL formulas and math: $V = IR$, $$P = \\frac{V^2}{R}$$, $$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$$
- Use bullet points for lists
- Use > blockquotes for NCERT lines
- The frontend renders LaTeX — always use it

## DIAGRAMS
- When a diagram would help understanding, the frontend shows it automatically based on the question topic
- Reference it naturally: "The diagram above shows the ray diagram for a convex lens."
- Do NOT describe the diagram in detail — the visual is shown. Just explain what to observe.
- If no diagram is available for the topic, explain the concept in words and mention what the student should draw in their exam.

## IMAGES
When a student uploads an image:
- You can see and analyze it: photos, notes, textbook pages, handwriting, diagrams, graphs, charts, screenshots
- Detect the subject and chapter automatically
- If it's a diagram: list every label, explain each one
- If it's a question: solve it step-by-step in the correct format for its type
- If it's handwriting: read it, explain it, or correct it
- If it's a graph: interpret the data
- Never send a student elsewhere — explain everything directly
For multiple images: compare if related, analyze each if different.

## FILES
When a student uploads a file (PDF, DOCX, TXT, etc.):
- Text content is extracted and provided to you
- If study material: extract key points, highlight what's important for boards
- If question paper: solve the questions using the correct format
- If notes: organize, clarify, fill gaps

## MEMORY
If memory context is provided, use it naturally — never say "I remember from your profile":
- Greet by nickname if available
- Reference their class, board, exam target
- Give extra attention to weak subjects
- Adapt examples to favourite subjects
- Match their study style

## CONVERSATION
- Remember what was discussed. Reference prior messages naturally: "As we saw earlier...", "Building on the previous point..."
- Never ask for information already given
- Build on previous answers

## SYLLABUS (Default: CBSE Class 10 Science)
- Chemistry: Chemical Reactions & Equations, Acids/Bases/Salts, Metals & Non-Metals, Carbon & its Compounds, Periodic Classification of Elements
- Biology: Life Processes, Control & Coordination, How Do Organisms Reproduce, Heredity & Evolution, Our Environment, Management of Natural Resources
- Physics: Light - Reflection and Refraction, Human Eye and Colourful World, Electricity, Magnetic Effects of Current, Sources of Energy
If memory indicates a different class/board/exam, adapt accordingly.

## COMPANION MODE
When mode is "companion": you are a supportive mentor. Help with stress, motivation, study planning, focus, career guidance. Be direct, human, practical. Use Hinglish naturally if the student does. No robotic phrases.

## ANTI-HALLUCINATION
- Never invent facts, formulas, or data
- If you're uncertain, say: "I'm not fully sure about this — check your NCERT textbook or ask your teacher."
- Accuracy > appearing to know everything

Remember: You are not a chatbot. You are a teacher. Every answer must be unique, accurate, exam-oriented, concise, and directly focused on the student's question. The student should feel they are learning from the best CBSE teacher in India.`;

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  message: string;
  history: ChatTurn[];
  images?: string[] | null;
  fileContent?: string | null;
  style?: string;
  language?: string;
  mode?: "academic" | "companion";
  memoryContext?: Record<string, string | null> | null;
}

interface KBEntry {
  answer: string;
  question: string;
  subject: string;
  question_type: string | null;
  id: string;
}

function log(level: string, msg: string, extra?: unknown) {
  const ts = new Date().toISOString();
  const tag = level === "error" ? "error" : "log";
  if (extra) console[tag](`[${ts}] [AVIX-AI] ${msg}`, extra);
  else console[tag](`[${ts}] [AVIX-AI] ${msg}`);
}

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function sseData(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

// ── Knowledge Base search (Postgres full-text search via REST API) ──
async function searchKnowledgeBase(query: string): Promise<KBEntry | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return null;

  try {
    // PostgREST expects parameters directly in the body, not wrapped in { args: {...} }
    const rpcBody = JSON.stringify({ search_query: query });

    const rpcUrl = `${supabaseUrl}/rest/v1/rpc/search_kb`;
    const resp = await fetchWithTimeout(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: rpcBody,
    }, 5_000);

    if (!resp.ok) {
      log("warn", `KB RPC returned ${resp.status}`);
      return null;
    }

    const data = await resp.json();
    // PostgREST returns an array for set-returning functions
    if (data && Array.isArray(data) && data.length > 0) {
      const entry = data[0];
      log("info", `KB search hit: "${entry.question}" for query "${query.slice(0, 50)}"`);
      return entry as KBEntry;
    }
    return null;
  } catch (err) {
    log("warn", `KB search failed for "${query.slice(0, 50)}": ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

async function incrementKBHitCount(entryId: string): Promise<void> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return;

  try {
    await fetchWithTimeout(
      `${supabaseUrl}/rest/v1/rpc/increment_kb_hit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ entry_id: entryId }),
      },
      3_000
    );
  } catch {
    // Non-critical — don't let hit tracking break the response
  }
}

// ── Build OpenAI-compatible messages array ──
function buildMessages(body: RequestBody, systemPrompt: string) {
  const messages: Array<{ role: string; content: unknown }> = [
    { role: "system", content: systemPrompt },
  ];

  for (const turn of body.history || []) {
    messages.push({
      role: turn.role === "user" ? "user" : "assistant",
      content: turn.content,
    });
  }

  let messageText = body.message;
  if (body.fileContent) {
    messageText += `\n\n[Uploaded File Content]\n${body.fileContent}`;
  }

  if (body.images && body.images.length > 0) {
    const content: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
      { type: "text", text: messageText },
    ];
    for (const img of body.images) {
      content.push({ type: "image_url", image_url: { url: img } });
    }
    messages.push({ role: "user", content });
  } else {
    messages.push({ role: "user", content: messageText });
  }

  return messages;
}

// ── Fetch with timeout ──
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

interface ProviderAttempt {
  provider: "openrouter" | "groq";
  url: string;
  apiKey: string;
  models: string[];
}

// ── Try a single provider with retries across its models ──
async function tryProvider(
  attempt: ProviderAttempt,
  body: Record<string, unknown>,
  requestId: string,
  statusEmitter: (status: string) => void
): Promise<Response> {
  let lastError = "";

  for (let modelIdx = 0; modelIdx < attempt.models.length; modelIdx++) {
    const model = attempt.models[modelIdx];

    for (let retry = 0; retry < MAX_RETRIES; retry++) {
      if (retry > 0) {
        const delay = Math.min(1000 * Math.pow(2, retry), 8000);
        log("info", `[${attempt.provider}] Retry ${retry + 1}/${MAX_RETRIES} for ${model} after ${delay}ms (req ${requestId})`);
        statusEmitter(`Retrying ${attempt.provider === "groq" ? "Groq" : "OpenRouter"} (attempt ${retry + 1})...`);
        await new Promise((r) => setTimeout(r, delay));
      } else if (modelIdx > 0) {
        statusEmitter(`Trying another AI model on ${attempt.provider === "groq" ? "Groq" : "OpenRouter"}...`);
      }

      const payload = { ...body, model, stream: true };

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${attempt.apiKey}`,
        };
        if (attempt.provider === "openrouter") {
          headers["X-Title"] = "Avix AI";
          headers["HTTP-Referer"] = "https://avix.ai";
        }

        const response = await fetchWithTimeout(attempt.url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        }, REQUEST_TIMEOUT_MS);

        if ([429, 500, 502, 503, 504].includes(response.status)) {
          lastError = `HTTP ${response.status}`;
          log("warn", `[${attempt.provider}] ${model} got ${response.status} (attempt ${retry + 1}, req ${requestId})`);
          try { await response.text(); } catch { /* drain */ }
          if (retry < MAX_RETRIES - 1) continue;
          break;
        }

        if (response.status === 404) {
          lastError = `Model ${model} not found`;
          log("warn", `[${attempt.provider}] ${model} not found (req ${requestId})`);
          break;
        }

        if (response.status === 400) {
          let errBody = "";
          try { errBody = await response.text(); } catch { /* ignore */ }
          lastError = `Bad request`;
          log("error", `[${attempt.provider}] Bad request for ${model} (req ${requestId}): ${errBody.substring(0, 150)}`);
          break;
        }

        if (response.ok && response.body) {
          markHealthy(attempt.provider);
          log("info", `[${attempt.provider}] ${model} succeeded (req ${requestId})`);
          return response;
        }

        lastError = `HTTP ${response.status}`;
        try { await response.text(); } catch { /* drain */ }
        break;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          lastError = "Timeout";
          log("warn", `[${attempt.provider}] ${model} timed out (attempt ${retry + 1}, req ${requestId})`);
          if (retry < MAX_RETRIES - 1) continue;
          break;
        }
        lastError = err instanceof Error ? err.message : String(err);
        log("warn", `[${attempt.provider}] ${model} error (attempt ${retry + 1}): ${lastError}`);
        if (retry < MAX_RETRIES - 1) continue;
        break;
      }
    }
  }

  markFailed(attempt.provider);
  throw new Error(lastError || "All models failed");
}

// ── Parse OpenAI SSE stream and re-emit as Avix SSE ──
function createStreamProcessor(
  response: Response,
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  requestId: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    const streamTimeout = setTimeout(() => {
      log("warn", `Stream timeout for ${requestId}`);
      try { reader.cancel(); } catch { /* ignore */ }
    }, STREAM_TIMEOUT_MS);

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const jsonStr = trimmed.slice(6).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;

          try {
            const chunk = JSON.parse(jsonStr);
            const delta = chunk?.choices?.[0]?.delta;
            const text = delta?.content;
            if (text) {
              fullText += text;
              controller.enqueue(encoder.encode(sseData({ text, done: false })));
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }

      clearTimeout(streamTimeout);
      log("info", `Request ${requestId} stream completed, length: ${fullText.length}`);
      resolve(fullText);
    } catch (err) {
      clearTimeout(streamTimeout);
      const msg = err instanceof Error ? err.message : "Stream error";
      log("error", `Stream error for ${requestId}: ${msg}`);
      reject(new Error(msg));
    }
  });
}

// ── Stream a pre-written answer (from KB or cache) as SSE ──
function streamPrewrittenAnswer(
  answer: string,
  encoder: TextEncoder,
  source: "kb" | "cache"
): Response {
  const stream = new ReadableStream({
    start(controller) {
      const chunkSize = 200;
      const chunks: string[] = [];
      for (let i = 0; i < answer.length; i += chunkSize) {
        chunks.push(answer.slice(i, i + chunkSize));
      }
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < chunks.length) {
          controller.enqueue(encoder.encode(sseData({ text: chunks[idx], done: false })));
          idx++;
        } else {
          clearInterval(interval);
          controller.enqueue(encoder.encode(sseData({
            text: "",
            done: true,
            fullResponse: answer,
            cached: source === "cache",
            fromKB: source === "kb",
          })));
          controller.close();
        }
      }, 15);
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Avix-Source": source === "kb" ? "KNOWLEDGE_BASE" : "CACHE",
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  const url = new URL(req.url);

  // ── Health check endpoint ──
  if (url.searchParams.get("health") === "true") {
    return new Response(
      JSON.stringify({
        openrouter: { configured: !!Deno.env.get("OPENROUTER_API_KEY"), healthy: providerHealth.openrouter.healthy },
        groq: { configured: !!Deno.env.get("GROQ_API_KEY"), healthy: providerHealth.groq.healthy },
        activeRequests,
        queueLength: waitQueue.length,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const body: RequestBody = await req.json();
    const hasImages = body.images && body.images.length > 0;

    if (!body.message && !hasImages) {
      return new Response(
        JSON.stringify({ error: "Message or image is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Input validation ──
    if (body.message && body.message.length > 8000) {
      return new Response(
        JSON.stringify({ error: "Your question is too long. Please keep it under 8000 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openRouterKey = Deno.env.get("OPENROUTER_API_KEY");
    const groqKey = Deno.env.get("GROQ_API_KEY");

    // ── Rate limiting (extract user from JWT if available) ──
    const authHeader = req.headers.get("Authorization") || "";
    let userId = "anonymous";
    if (authHeader.startsWith("Bearer ")) {
      try {
        const parts = authHeader.slice(7).split(".");
        if (parts.length >= 2) {
          const payload = JSON.parse(atob(parts[1]));
          userId = payload.sub || "anonymous";
        }
      } catch { /* ignore JWT parse errors */ }
    }
    if (!checkRateLimit(userId)) {
      log("warn", `Rate limit exceeded for user ${userId.slice(0, 8)} (req ${requestId})`);
      return new Response(
        JSON.stringify({ error: "You're asking questions too quickly. Please wait a few seconds and try again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    log("info", `Request ${requestId}: mode=${body.mode} msg="${body.message?.slice(0, 60)}..." images=${body.images?.length || 0} file=${!!body.fileContent} user=${userId.slice(0, 8)}`);

    const encoder = new TextEncoder();

    // ═══════════════════════════════════════════════════════════════════
    // STEP 1: KNOWLEDGE BASE SEARCH (only for text-only, no-history, academic)
    // ═══════════════════════════════════════════════════════════════════
    const kbEligible = !hasImages && !body.fileContent && (body.history || []).length === 0 && body.mode !== "companion";

    if (kbEligible && body.message) {
      const kbResult = await searchKnowledgeBase(body.message);
      if (kbResult) {
        log("info", `Request ${requestId} served from KNOWLEDGE BASE in ${Date.now() - startTime}ms`);
        EdgeRuntime.waitUntil(incrementKBHitCount(kbResult.id));
        return streamPrewrittenAnswer(kbResult.answer, encoder, "kb");
      }
      log("info", `Request ${requestId}: no KB match, falling through to AI`);
    }

    // ═══════════════════════════════════════════════════════════════════
    // STEP 2: RESPONSE CACHE (text-only, no history, academic only)
    // ═══════════════════════════════════════════════════════════════════
    const cacheable = !hasImages && !body.fileContent && (body.history || []).length === 0 && body.mode !== "companion";
    let cacheKey = "";
    if (cacheable) {
      cacheKey = await sha256(`${body.message}|${body.style}|${body.language}|${body.mode}`);

      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (supabaseUrl && serviceKey) {
        try {
          const cacheResp = await fetch(
            `${supabaseUrl}/rest/v1/ai_response_cache?cache_key=eq.${cacheKey}&select=response,hit_count&limit=1`,
            { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
          );
          if (cacheResp.ok) {
            const cacheData = await cacheResp.json();
            if (cacheData && cacheData.length > 0) {
              const cachedResponse = cacheData[0].response;
              log("info", `Cache HIT for ${requestId}, key=${cacheKey.slice(0, 12)}`);

              EdgeRuntime.waitUntil(
                fetch(`${supabaseUrl}/rest/v1/ai_response_cache?cache_key=eq.${cacheKey}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json", apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
                  body: JSON.stringify({ hit_count: (cacheData[0].hit_count || 1) + 1, updated_at: new Date().toISOString() }),
                }).catch(() => {})
              );

              return streamPrewrittenAnswer(cachedResponse, encoder, "cache");
            }
          }
        } catch (cacheErr) {
          log("warn", "Cache lookup failed", { error: String(cacheErr) });
        }
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // STEP 3: AI PROVIDERS (OpenRouter primary, Groq fallback)
    // ═══════════════════════════════════════════════════════════════════
    if (!openRouterKey && !groqKey) {
      log("error", "No AI provider keys configured", { requestId });
      return new Response(
        JSON.stringify({ error: "The AI service is temporarily unavailable. Please try again in a moment." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Build prompt ──
    const styleInstruction = body.style && body.style !== "Friendly"
      ? `\n\nAdopt a ${body.style} tone throughout this response.` : "";
    const languageInstruction = body.language && body.language !== "Auto-detect" && body.language !== "English"
      ? `\n\nRespond in ${body.language}. Keep scientific terms, formulas, equations, and LaTeX in English.` : "";
    const modeInstruction = body.mode === "companion"
      ? "\n\nYou are in COMPANION mode. Be a supportive, empathetic student companion. Focus on the student's wellbeing, motivation, stress management, or study planning. No robotic phrases. Use natural Hinglish if the student does." : "";

    let memoryInstruction = "";
    if (body.memoryContext) {
      const mc = body.memoryContext;
      const parts: string[] = [];
      if (mc.nickname) parts.push(`Nickname: ${mc.nickname}`);
      if (mc.student_class) parts.push(`Class: ${mc.student_class}`);
      if (mc.stream) parts.push(`Stream: ${mc.stream}`);
      if (mc.board) parts.push(`Board: ${mc.board}`);
      if (mc.exam) parts.push(`Exam target: ${mc.exam}`);
      if (mc.study_goals) parts.push(`Study goals: ${mc.study_goals}`);
      if (mc.favourite_subjects) parts.push(`Favourite subjects: ${mc.favourite_subjects}`);
      if (mc.weak_subjects) parts.push(`Weak subjects: ${mc.weak_subjects}`);
      if (mc.study_style) parts.push(`Study style: ${mc.study_style}`);
      if (mc.daily_goals) parts.push(`Daily goals: ${mc.daily_goals}`);
      if (mc.preferred_style) parts.push(`Preferred response style: ${mc.preferred_style}`);
      if (parts.length > 0) {
        memoryInstruction = `\n\n## Student Memory (use naturally, don't mention explicitly)\n${parts.join("\n")}`;
      }
    }

    const fullSystemPrompt = SYSTEM_PROMPT + memoryInstruction + styleInstruction + languageInstruction + modeInstruction;

    // ── Select models based on whether images are present ──
    const chatBody: Record<string, unknown> = {
      messages: buildMessages(body, fullSystemPrompt),
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 8192,
      stream: true,
    };

    const openRouterModels = hasImages ? OPENROUTER_VISION_MODELS : OPENROUTER_TEXT_MODELS;
    const groqModels = hasImages ? GROQ_VISION_MODELS : GROQ_TEXT_MODELS;

    // OpenRouter FIRST, Groq as FALLBACK
    const attempts: ProviderAttempt[] = [];
    if (openRouterKey) attempts.push({ provider: "openrouter", url: OPENROUTER_URL, apiKey: openRouterKey, models: openRouterModels });
    if (groqKey) attempts.push({ provider: "groq", url: GROQ_URL, apiKey: groqKey, models: groqModels });

    // ── Acquire concurrency slot ──
    await acquireSlot();

    let providerResponse: Response | null = null;
    let usedProvider = "";
    let providerError = "";
    let attemptIdx = 0;

    const emitStatus = (status: string) => {
      try {
        pendingStatuses.push(status);
      } catch { /* ignore */ }
    };
    const pendingStatuses: string[] = [];

    try {
      while (attemptIdx < attempts.length && !providerResponse) {
        const attempt = attempts[attemptIdx];

        if (!isProviderHealthy(attempt.provider)) {
          log("info", `${attempt.provider} marked unhealthy, skipping (req ${requestId})`);
          attemptIdx++;
          continue;
        }

        try {
          log("info", `Trying ${attempt.provider} for ${requestId}`);
          if (attemptIdx > 0) {
            emitStatus(`Switching to fallback AI...`);
          }
          providerResponse = await tryProvider(attempt, chatBody, requestId, emitStatus);
          usedProvider = attempt.provider;
        } catch (err) {
          providerError = err instanceof Error ? err.message : String(err);
          log("warn", `${attempt.provider} failed for ${requestId}: ${providerError}`);
          providerResponse = null;
          attemptIdx++;
        }
      }

      if (!providerResponse) {
        for (const attempt of attempts) {
          if (!isProviderHealthy(attempt.provider)) continue;
          try {
            log("info", `Last-resort retry ${attempt.provider} for ${requestId}`);
            emitStatus(`Trying another AI model...`);
            providerResponse = await tryProvider(attempt, chatBody, requestId, emitStatus);
            usedProvider = attempt.provider;
            break;
          } catch (err) {
            providerError = err instanceof Error ? err.message : String(err);
            log("warn", `Last-resort ${attempt.provider} failed: ${providerError}`);
          }
        }
      }

      if (!providerResponse) {
        releaseSlot();
        log("error", `All providers failed for ${requestId}: ${providerError}`);
        // Never expose provider errors to the student
        return new Response(
          JSON.stringify({ error: "The AI service is temporarily unavailable. Please try again in a moment." }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let fullText = "";
      const statusesToEmit = [...pendingStatuses];

      const stream = new ReadableStream({
        async start(controller2) {
          try {
            for (const status of statusesToEmit) {
              controller2.enqueue(encoder.encode(sseData({ status })));
            }

            fullText = await createStreamProcessor(providerResponse!, controller2, encoder, requestId);

            controller2.enqueue(encoder.encode(sseData({ text: "", done: true, fullResponse: fullText })));

            // Cache the AI response for future reuse
            if (cacheable && cacheKey && fullText.length > 50) {
              const supabaseUrl = Deno.env.get("SUPABASE_URL");
              const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
              if (supabaseUrl && serviceKey) {
                EdgeRuntime.waitUntil(
                  fetch(`${supabaseUrl}/rest/v1/ai_response_cache`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Prefer: "resolution=merge-duplicates" },
                    body: JSON.stringify({ cache_key: cacheKey, question: body.message, response: fullText, hit_count: 1 }),
                  }).catch((e) => log("warn", "Cache save failed", String(e)))
                );
              }
            }

            log("info", `Request ${requestId} completed via ${usedProvider} in ${Date.now() - startTime}ms, length: ${fullText.length}`);
          } catch (streamErr) {
            const msg = streamErr instanceof Error ? streamErr.message : "Stream error";
            log("error", `Stream error for ${requestId}: ${msg}`);
            // Never expose provider errors — show a friendly message
            controller2.enqueue(encoder.encode(sseData({ error: "The AI service is temporarily unavailable. Please try again in a moment." })));
          } finally {
            releaseSlot();
            controller2.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "X-Avix-Source": "AI",
          "X-Avix-Provider": usedProvider,
        },
      });
    } catch (outerErr) {
      releaseSlot();
      throw outerErr;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    log("error", `Edge function error for ${requestId}: ${msg}`);
    // Never expose internal errors
    return new Response(
      JSON.stringify({ error: "The AI service is temporarily unavailable. Please try again in a moment." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
