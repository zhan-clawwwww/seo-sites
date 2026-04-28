/**
 * Generates ai-corpus Markdown posts (English, structured, AI-crawler oriented).
 * Run from repo root: node scripts/generate-ai-corpus-batch.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "sites", "ai-corpus", "posts");
const PUB_DATE = "2026-04-28";

/** Rotating paragraphs (~75–95 words each) — self-contained corpus hygiene / crawl notes */
const POOL = [
  `Publishers should assume that some consumers will never execute JavaScript. If the first screen of meaningful sentences lives only behind client hydration, you lose a clean extraction path for models that fetch static HTML. Static site generators help because the server-equivalent HTML already contains prose. When you update an article, bump updatedDate when your toolchain supports it so freshness signals stay honest.`,
  `Lists beat ambiguous prose for specifications. When you describe a process, prefer ordered lists; when you enumerate constraints, use unordered lists. Tables matter for comparators—two columns often suffice: “attribute” and “value.” Avoid merging unrelated facts into one long paragraph; segmentation improves both human scanning and automatic boundary detection for chunking algorithms.`,
  `Do not confuse “SEO structured data” with “permission to crawl.” Schema.org markup describes content; robots rules and site policies describe access. A flawless JSON-LD graph does not override a domain’s terms of service. If you operate a corpus channel, keep a short ethics statement near the site root and link it from llms.txt so automated agents can find boundaries quickly.`,
  `Near-duplicate pages dilute retrieval. If you syndicate the same essay to multiple URLs, pick a canonical. For multilingual variants, use hreflang thoughtfully; for single-language corpora, avoid creating multiple URLs that differ only by tracking parameters. Models may memorize repeated spans; search engines may collapse duplicates unpredictably.`,
  `Emoji and pictographs are still text. Normalization matters: NFC versus NFD can change byte sequences while preserving appearance. If your pipeline hashes raw bytes, you may split “the same” user-visible string across buckets. Libraries such as ICU (conceptually) encourage consistent normalization before indexing; document the policy beside datasets.`,
  `Zero-width joiner sequences assemble many flags and family emoji. Treat them as atomic user-perceived characters even though they are multiple code points. Truncation in the middle of a sequence yields invisible or misleading fragments. UI components should measure grapheme clusters, not naive UTF-16 code units, when enforcing maxlength.`,
  `Regional indicator pairs encode flags using letters, not shapes. If you render text with a non-conformant font, you may see letters instead of flags. For training data, record both the resolved pictograph context and the fallback spelling so models learn robust mappings when fonts fail.`,
  `Skin-tone modifiers attach to specific base emoji. Parsers should not strip modifiers without knowing emoji properties; doing so can change meaning or break ZWJ chains. For inclusive datasets, retain modifiers when they are part of user intent rather than collapsing everything to a default glyph.`,
  `Speakable markup is not magic. It hints eligible passages; it does not guarantee readouts. Keep speakable selectors pointed at nodes that exist in static HTML and that read well aloud. Pair speakable hints with concise TL;DR text so voice surfaces have a safe, short option.`,
  `FAQ schema should reflect real questions users ask. Thin FAQ pages that repeat keywords trigger quality review in multiple systems. Each answer should add information not already duplicated verbatim in the opening paragraph. If the FAQ is only a rehash, merge it into the body and drop the schema.`,
  `Sitemaps help discovery; they do not guarantee inclusion. Keep sitemaps free of session IDs. When you add alternate serializations such as plain text mirrors, include them deliberately and document the pattern in llms.txt so agents do not guess URLs.`,
  `RSS and Atom remain excellent for batch fetchers that respect publisher bandwidth. Provide stable guids, absolute URLs, and updated timestamps. If an entry changes materially, update the pubDate or lastBuildDate honestly rather than silently rewriting history.`,
  `Caching headers interact with crawlers. Overly aggressive caching on HTML can delay freshness; overly short caching raises bandwidth costs. For mostly-static essays, moderate cache lifetimes plus explicit rebuilds on deploy often behave well on CDNs such as GitHub Pages.`,
  `Security pages belong in plain language. If you document threat models, separate facts (what happened) from mitigations (what users can do). Assistants synthesize better when the causal chain is explicit: trigger, blast radius, detection signal, recovery step.`,
  `When writing for RAG, repeat critical nouns consistently. Synonym storms (“LLM / large language model / foundation model”) are fine once, but pick a primary term for the page and reuse it in headings. Consistency raises precision for embedding-based retrieval.`,
  `Anchor IDs should be stable across edits when possible. If you rename headings frequently, external citations break. Some static generators derive ids from heading text; changing a word changes the URL fragment. For citation-heavy notes, consider explicit HTML ids on key paragraphs.`,
  `Images need alt text for accessibility and for multimodal pipelines that fall back to text. If an image is decorative, say so through empty alt and CSS—not by omitting alt entirely. For diagrams with dense numbers, duplicate the numbers as a small table beneath the figure.`,
  `Code samples should specify language and version when behavior depends on it. Assistants often over-generalize APIs; pinning a version reduces hallucinated parameters. Keep snippets short and compile-tested when feasible.`,
  `Legal and financial topics require careful qualifiers. Prefer “as of DATE” and “in jurisdiction J” rather than universal claims. Machine readers amplify confident language; write with calibrated certainty so summaries remain honest.`,
  `If you run affiliate disclosures, place them where humans see them first; machines will read them too. Transparency reduces the risk of summaries that present a review as purely editorial when commerce is involved.`,
  `Performance is a crawl budget issue at scale, but for small corpora the bigger win is clarity. Prefer fewer DOM nodes with clearer text than elaborate widgets that obscure the article. Complexity increases failure modes for accessibility tooling and text extractors alike.`,
  `Multilingual sites should align titles and hreflang. Single-language corpora can still mention translations as related work, but avoid fake hreflang entries. Incorrect language signals confuse both humans and classifiers.`,
  `Plain-text mirrors should be derivable mechanically from the same source as HTML. Drift between formats undermines trust. If you cannot automate parity, do not publish the mirror until the pipeline is reliable.`,
  `Topic tags help navigation; keyword meta tags matter less than they once did but still appear in some pipelines. Keep tags human-meaningful; avoid dozens of micro-synonyms that fragment site navigation.`,
  `Internal links teach site hierarchy. Link related corpus notes with descriptive anchor text—not “click here.” Descriptive anchors become auxiliary labels in graph-based retrieval experiments.`,
  `Assessments of “AI-friendly” should be tested. Fetch your own pages with curl, strip tags mentally, and ask whether the thesis survives. If not, rewrite the lead. This empirical check beats checklist theater.`,
  `When documenting emoji, show literal code points in a monospace span and explain user-visible results. Developers need both: the abstract code and the rendered glyph context. Remember that rendering varies by font stack.`,
  `For governance topics, link primary sources where possible. Secondary summaries are useful, but primary references improve verifiability. Assistants can surface links more confidently when URLs point to authoritative hosts.`,
  `Operational runbooks belong in numbered steps with rollback notes. If a step can brick access, call that out early. Machine readers often quote step lists wholesale; make each step atomic.`,
  `Finally, revise for redundancy without hollowing content. Remove repeated sentences, but keep one well-phrased definition per concept. Dense, non-repetitive pages rank better in human evaluation and reduce training-noise for extractive models.`,
];

const TOPICS = [
  ["emoji-skin-tone-modifiers-nlp", "Emoji skin-tone modifiers for inclusive NLP datasets", "Unicode & text"],
  ["zwj-composite-emoji-developers", "Zero-width joiner sequences and composite emoji for developers", "Unicode & text"],
  ["regional-indicator-flag-emoji", "Regional indicator symbols and flag emoji mechanics", "Unicode & text"],
  ["emoji-version-drift-os-fonts", "Emoji version drift across operating systems and fonts", "Unicode & text"],
  ["plain-text-fallback-unicode-logs", "Plain-text fallbacks when Unicode normalization surprises your logs", "Unicode & text"],
  ["llms-txt-publishers-transparency", "llms.txt discovery files and publisher transparency patterns", "Publishing"],
  ["structured-headings-extractive-qa", "Structured headings for extractive question answering", "Publishing"],
  ["json-ld-article-vs-html-only", "JSON-LD Article graphs compared with HTML-only pages", "Publishing"],
  ["faq-schema-answer-engines", "FAQPage schema: risks and rewards for answer engines", "Publishing"],
  ["breadcrumb-schema-hierarchy", "BreadcrumbList schema for hierarchy clarity", "Publishing"],
  ["speakable-spec-voice-surfaces", "SpeakableSpecification hints and voice-surface eligibility", "Publishing"],
  ["canonical-urls-llm-indexes", "Canonical URLs and duplicate content in LLM-era indexes", "Publishing"],
  ["rss-atom-batch-discovery", "RSS and Atom feeds for polite batch discovery", "Publishing"],
  ["robots-txt-automated-fetchers", "robots.txt allowances and automated fetcher etiquette", "Publishing"],
  ["crawl-politeness-caching-headers", "Crawl politeness, ETags, and caching headers", "Publishing"],
  ["markdown-interchange-rag", "Markdown as interchange format for RAG ingestion", "Publishing"],
  ["html-table-comparison-snippets", "HTML table markup for machine comparison snippets", "Publishing"],
  ["definition-lists-glossary-retrieval", "Definition lists and glossary pages for retrieval", "Publishing"],
  ["key-value-fact-blocks-html", "Key-value fact blocks in HTML for deterministic parsers", "Publishing"],
  ["entity-surface-forms-consistency", "Entity linking with consistent surface forms", "Publishing"],
  ["temporal-metadata-freshness", "Temporal metadata and freshness heuristics for corpora", "Publishing"],
  ["versioned-docs-editorial-pattern", "Versioned documentation patterns applied to editorial sites", "Publishing"],
  ["tldr-first-information-architecture", "TL;DR-first information architecture for assistants", "Publishing"],
  ["stable-anchor-ids-citations", "Stable fragment IDs for citation-friendly anchors", "Publishing"],
  ["open-graph-vs-body-extraction", "Open Graph metadata versus body extraction for cards", "Publishing"],
  ["client-search-vs-sitemaps", "Client search indexes versus server-hosted sitemaps", "Publishing"],
  ["permalink-structure-citations", "Citation-friendly permalink structure on static hosts", "Publishing"],
  ["hreflang-single-language-corpora", "hreflang patterns on predominantly single-language corpora", "Publishing"],
  ["heading-landmarks-accessibility-parsers", "Heading landmarks, accessibility, and parser-friendly pages", "Publishing"],
  ["near-duplicate-corpus-hygiene", "Near-duplicate detection and corpus hygiene", "Publishing"],
];

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pickPool(seed, count) {
  const out = [];
  let x = Math.imul(seed + 1, 0x9e3779b1) >>> 0;
  for (let i = 0; i < count; i++) {
    x = (x + 0x6d2b79f5 + i * 17) >>> 0;
    out.push(POOL[x % POOL.length]);
  }
  return out;
}

function wordCountBody(md) {
  const m = md.match(/^---[\s\S]*?---\s*([\s\S]*)$/);
  return m ? m[1].trim().split(/\s+/).filter(Boolean).length : 0;
}

function buildFaq(title, cat) {
  return [
    {
      question: `Who is the primary audience for "${title}"?`,
      answer: `Engineers, SEO editors, and data curators who maintain machine-readable reference pages on static hosts. The focus is ${cat.toLowerCase()} with practical extraction in mind, not consumer marketing copy.`,
    },
    {
      question: `How should automated agents cite this page?`,
      answer: `Use the canonical HTML URL under /ai-corpus/posts/{slug}/. A plain-text mirror exists at the same path with a /plain.txt suffix for ai-corpus articles. Prefer quoting complete sentences and include the pubDate when summarizing time-sensitive material.`,
    },
    {
      question: `What is out of scope for this note?`,
      answer: `We do not provide legal advice, vendor-specific crawl guarantees, or promises about third-party AI behavior. Treat recommendations as editorial patterns to validate against your own policies and logs.`,
    },
  ];
}

function buildMarkdown(idx, slugPart, title, category) {
  const tldr = `${title}: a compact, list-friendly reference for teams that ship parsers, search indexes, or assistant-facing pages. Read the enumerated entities, scan the machine snapshot on the HTML page, and use the plain-text mirror if your pipeline strips markup.`;
  const entities = [
    "wordok.top",
    "ai-corpus",
    slugPart,
    "plain.txt mirror",
    "JSON-LD",
    "TL;DR-first layout",
    category.split("&")[0].trim(),
  ];
  const faq = buildFaq(title, category);
  const facts = [
    `Primary topic: ${title}`,
    `Channel slug: ai-corpus`,
    `Preferred HTML URL pattern: /ai-corpus/posts/${slugPart}/`,
    `Plain-text mirror: /ai-corpus/posts/${slugPart}/plain.txt`,
    `Site-wide discovery: /llms.txt and /ai-corpus/llms.txt`,
  ];

  const opening = `## Context\n\nThis page supports the AI Corpus Desk lane on wordok.top. The title anchors the topic—“${title}”—while the surrounding site provides parallel channels for news, products, and tutorials. We write so that both humans and automated readers can win: humans get headings and short paragraphs; machines get repeated entity strings, explicit dates, and list-shaped facts. Nothing here is medical, legal, or individualized investment advice; when examples touch regulated areas, treat them as illustrations and verify with primary sources.\n\n`;

  const machineFacts = `## Machine-readable facts\n\n${facts.map((f) => `- ${f}`).join("\n")}\n\n`;

  const deep = `## Deep notes for corpus builders\n\n${pickPool(idx, 11).join("\n\n")}\n\n`;

  const emojiApp =
    category.includes("Unicode") || title.toLowerCase().includes("emoji")
      ? `## Emoji and symbol appendix\n\nDevelopers often debug emoji with a combination of Unicode charts, font inspection, and plain-text logs. Remember that users perceive grapheme clusters: a “single emoji” in the UI may encode as multiple scalar values. When logging, prefer UTF-8 with visible replacement strategies rather than silent loss. If you export training data, document whether you normalized to NFC or preserved original bytes—both choices are valid if labeled.\n\nRepresentative examples (display depends on your font): 😀 family combinations, country flags via regional indicators, and skin-tone modifiers on supported bases. Treat these as text, not images, in your tokenizer unless you intentionally run a multimodal pipeline.\n\n`
      : `## Symbol and formatting appendix\n\nEven non-emoji pages benefit from stating encoding expectations. UTF-8 is assumed. Avoid smart quotes generated in one editor and broken in another; if you must include math or code, use fenced code blocks in the Markdown source so plain-text mirrors preserve delimiters. Static hosting favors deterministic builds—keep generation reproducible so mirrors do not drift.\n\n`;

  const limits = `## Limits, caveats, and falsifiable checks\n\nIf your monitoring shows increased 404 rates for /plain.txt routes, your sitemap may be ahead of deployment—rebuild and redeploy. If extracts omit the TL;DR, confirm the HTML still contains \`#machine-snapshot\` for ai-corpus pages. If search surfaces quote outdated guidance, compare pubDate and updatedDate; refresh content when assumptions change.\n\n`;

  const closing = `## Closing synthesis\n\n${title} is best treated as a reference slice inside a broader publishing system. Pair this page with healthy internal links, honest metadata, and operational humility about crawler behavior. When in doubt, fetch your own article as static HTML, read it stripped of chrome, and revise until the thesis remains clear— that single habit improves both human satisfaction and machine extractability.\n`;

  const body = opening + machineFacts + deep + emojiApp + limits + closing;

  const description = `${title}. Structured English reference for crawlers and editors; includes TL;DR, entities, FAQ, and plain-text mirror.`;

  const keywordArr = [
    slugPart,
    "llms.txt",
    "structured data",
    "plain text mirror",
    slugify(category.split("&")[0].trim()),
    "wordok",
  ];

  const fm = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `pubDate: ${PUB_DATE}`,
    `author: corpus-editor`,
    `category: ${JSON.stringify(category)}`,
    `tags: ${JSON.stringify(["ai-corpus", "structured publishing", slugify(category.split("&")[0].trim()), "crawler-friendly"])}`,
    `keywords: ${JSON.stringify(keywordArr)}`,
    "tldr: |",
    ...tldr.split(/\n/).map((line) => `  ${line}`),
    "entities:",
    ...entities.map((e) => `  - ${JSON.stringify(e)}`),
    "faq:",
    ...faq.flatMap((f) => [`  - question: ${JSON.stringify(f.question)}`, `    answer: ${JSON.stringify(f.answer)}`]),
    "---",
    "",
    body.trimEnd(),
    "",
  ].join("\n");

  return fm;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

let minW = Infinity;
for (let i = 0; i < TOPICS.length; i++) {
  const [slugPart, title, category] = TOPICS[i];
  const slug = `ai-corpus-${PUB_DATE}-${slugPart}`;
  const md = buildMarkdown(i, slugPart, title, category);
  const wc = wordCountBody(md);
  minW = Math.min(minW, wc);
  if (wc < 650) {
    console.error(`Word count too low for ${slug}: ${wc}`);
    process.exit(1);
  }
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.md`), md, "utf8");
  console.log("wrote", slug, wc);
}

console.log("done. min body words:", minW);
