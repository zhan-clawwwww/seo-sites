---
title: "OpenAI Dots: Always-On ChatGPT Agents Powered by GPT-6 Astra — Architecture, Controls, and Enterprise Implications"
pubDate: 2026-10-10
author: "WordOK Tech Publications"
category: "Artificial Intelligence"
tags: ["OpenAI Dots", "GPT-6 Astra", "always-on agents", "ChatGPT", "enterprise AI", "specialist dots", "agent governance", "Microsoft Agent 365", "October 2026", "proactive research"]
excerpt: "OpenAI introduced Dots on September 29, 2026—always-on agents on GPT-6 Astra with a cloud computer, browser, 4,000+ app plugins, Custom Rules, and a path to specialist dots for enterprise. This deep dive maps the fact layer, safety controls, rollout, and how Dots differs from Google’s Gemini agent and Claude mid-tier backends, with forecasts and role checklists."
---

# OpenAI Dots: Always-On ChatGPT Agents Powered by GPT-6 Astra — Architecture, Controls, and Enterprise Implications

**Publication date:** 2026-10-10 | **Language:** English | **Audience:** enterprise architects, IT and security leaders, platform engineers, FinOps leads, procurement teams, and product owners evaluating always-on personal and team agents.

**Disclosure:** This article synthesizes OpenAI’s **Introducing Dots** announcement (September 29, 2026), OpenAI Help Center guidance on getting started with your dot, and optional journalist hands-on notes labeled as anecdote—not vendor SLA. It is **not** investment, legal, or security audit advice. Validate contractual terms, data-handling policies, regional availability, and threat models with your own teams before enabling agents in production tenants.

**Primary sources:**

- [Introducing Dots — OpenAI](https://openai.com/index/introducing-dots/) (September 29, 2026)
- [Getting started with your dot — OpenAI Help Center](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot)

For same-week **GPT-6 Intelligent UI** and the broader October agent wave—where Dots appears only briefly—see our [October 2026 agent wave analysis](/ai/posts/ai-2026-10-09-gpt6-intelligent-ui-enterprise-agent-wave/). This piece **owns Dots product architecture, controls, availability, specialist dots, and enterprise implications** only.

## Why Dots is a different product than “GPT-6 in chat”

October 2026’s consumer narrative centers on **Intelligent UI** and progressive answering inside ChatGPT. Two days earlier, on **September 29, 2026**, OpenAI shipped a parallel bet: **Dots**—**always-on agents** powered by **GPT-6 Astra** that work **24/7 toward goals**, learn from feedback, and operate with their **own cloud computer and browser** plus connections to **more than 4,000 apps** through a plugin ecosystem.

If Intelligent UI answers “how should the model **talk** to a billion users?”, Dots answers “how should a model **work** when the user is not in the thread?” That shift—from synchronous chat to **persistent workers**—is the same structural move Google framed on October 8 with the [Gemini agent enterprise coworker](/ai/posts/ai-2026-10-09-google-gemini-agent-enterprise-coworker/), and the same move Anthropic’s stack enables behind coding and knowledge surfaces via mid-tier models like [Claude Sonnet 5.5](/ai/posts/ai-2026-10-10-claude-sonnet-5-5-agentic-coding-everyday-work/). OpenAI’s differentiation is packaging the worker **inside ChatGPT’s trust boundary**, with **inspectable computers**, **Custom Rules**, and a roadmap from **one primary dot per user** to **teams of specialist dots** with distinct identities.

This article delivers: a **fact layer** from OpenAI primary sources, **systems analysis** comparing Dots to Google’s universal work agent and Claude-backed agent loops, **forecast scenarios** (0–3 and 3–12 months) with falsifiers, **role-based checklists**, **risks and misconceptions**, and **deep dives** on proactive research, local laptop access, and enterprise pilot patterns—without inventing benchmarks, prices, or dates beyond cited materials.

## The September 29, 2026 fact layer (OpenAI Dots)

### Product definition: always-on agents on GPT-6 Astra

OpenAI describes **Dots** as **always-on agents** that:

- Run on **GPT-6 Astra** as the core model.
- Maintain an **own cloud computer and browser** for tool use and web workflows.
- **Learn from feedback** and pursue user goals **continuously**, including when the user is away.
- Connect to **over 4,000 apps** via a **plugin ecosystem**.

Users can reach a dot through **ChatGPT**, **Slack**, or **Microsoft Teams**; **voice calls** are supported, with **texting** described as **coming soon** in the announcement. OpenAI’s near-term vision starts with a **primary dot** per user and expands toward **teams of dots**, including **specialist dots** previewed for enterprise scenarios (see below).

### Where the dot works: cloud, browser, apps, and optional laptop

Dots can operate on:

- The dot’s **cloud computer and browser**.
- **Connected applications** authorized through plugins.
- The user’s **laptop**, **with permission**, via the desktop experience—**local computer access is optional and starts off** per Help Center guidance, enabled through the **desktop app**.

OpenAI emphasizes an **inspectable computer**: operators and users can review what the dot did on its cloud environment—a governance primitive enterprises asked for during early browser-agent demos in 2025–2026.

### Proactive research when idle

When idle, dots may perform **proactive research** using **read-only tools on connected apps only**. In that mode, OpenAI states the dot **cannot send messages**, **change content**, or **control the browser or computer** for mutating actions. This is a deliberate **separation of reconnaissance from execution**—relevant when mapping to your own “read vs. write” connector tiers in [agentic workflow security](/ai/posts/ai-2026-05-07-agentic-workflows-saas-integration-security/) playbooks.

### Controls: Custom Rules, Auto-review, passwords, and monitoring

OpenAI layers user and admin controls on top of ChatGPT protections:

| Control | Reported behavior (OpenAI) |
|---------|----------------------------|
| **Custom Rules** | **Allow**, **require approval**, or **block** categories of actions |
| **Auto-review** | Review path for **consequential actions** before execution |
| **Password changes** | **Always remain with the user**—the dot does not change passwords on the user’s behalf |
| **Saved passwords** | Support **site sign-in** without **exposing passwords to the model** |
| **Monitoring** | OpenAI can **pause or stop** activity on **safety concerns** |

Help Center documentation expands **Custom Rules** behaviors into four practical modes: **Take action without asking**, **if pre-approved**, **Ask before**, and **Hand off to you**—language product and security teams should mirror in internal runbooks.

Users can **Pause** the dot or **Reset** it; **Reset deletes conversations, memories, and scheduled tasks** per Help Center—treat Reset as a **destructive** operator action in incident response.

### Data handling and training boundaries

OpenAI states:

- For **Business, Enterprise, and Edu** plans, content is **not used to improve models by default**.
- **Personal** plans offer **controllable** training settings.
- OpenAI says it does **not train directly** on **proactive research** or on the dot’s **notes to itself**.

These claims belong in **procurement diligence** alongside your DPA and zero-retention options—not as substitutes for legal review.

### Specialist dots and Microsoft Agent 365

OpenAI previews **specialist dots** with **their own identity** for **access management**, **IT-provisioned hardware**, and **deep integrations with systems of record**. **Enterprise pilots** are underway; OpenAI reports **internal testing** across **procurement**, **invoice processing**, **email marketing**, **customer support**, and **commercial contracting**. **Microsoft Agent 365 integration** is cited for **governance**—a signal that Dots is designed to sit inside existing **Microsoft 365 admin** and identity workflows, not only ChatGPT’s consumer shell.

### Rollout, plans, and usage accounting

From the announcement and Help Center:

| Dimension | OpenAI guidance |
|-----------|-----------------|
| **Pro** | Eligible markets **excluding EEA, Switzerland, and UK** |
| **Business Premium** | **All supported ChatGPT regions** |
| **Enterprise** (incl. Edu/Healthcare) | **Off by default**; **admin must enable** |
| **Rollout** | **Gradual**; may take **several days** |
| **Creation** | **Desktop app** or **desktop web** (Windows desktop app available); **not** on mobile creation; **mobile web not supported** for setup; after setup, **messaging on mobile when available** |
| **First dot** | **Included at no extra cost** on eligible plans |
| **Deeper work** | **Allowance for extended limits** in the **first month** |
| **ChatGPT usage** | **Conversations with your dot do not count** toward ChatGPT usage limits |
| **Other tasks** | **Codex** and **ChatGPT Work** tasks **still count** toward their limits |
| **Codex** | Dots can **create Codex cloud environment tasks** |
| **Slack** | Connectable |
| **Email** | **Personal email** usable for tasks; **no standalone email address** for the dot at launch |
| **Outbound calls** | Dot **cannot initiate calls to the user** at launch |
| **Texting** | **Limited beta**, **Pro US only**, **not** Business/Enterprise; **third-party provider**; **STOP** to stop |
| **Default handle** | **@yourname-dot**; **renaming changes the handle** |

OpenAI does **not** publish list prices for incremental dots or extended work beyond the first-month allowance in these sources—do not infer add-on SKUs from this article.

### Journalist anecdote (not product SLA)

Early hands-on coverage in **WIRED** ([OpenAI wants its new agent to run your life](https://www.wired.com/story/openai-wants-its-new-agent-to-run-your-life-mine-said-it-loved-me/)) describes **pre-release friction**—for example difficulty with **CAPTCHAs** and uneven task completion. Treat such reports as **journalist anecdote** useful for **pilot expectations**, not as OpenAI commitments on reliability or safety outcomes.

## Systems analysis: Dots vs. Gemini agent vs. Claude backends

October 2026 exposes three public “shapes” of enterprise-grade persistence:

### Comparison at a glance

| Dimension | **OpenAI Dots** (Sept 29) | **Google Gemini agent** (Oct 8) | **Claude mid-tier backends** (Sonnet 5.5, Sept 28) |
|-----------|----------------------------|----------------------------------|------------------------------------------------------|
| **Unit of deployment** | Personal **primary dot** → **teams of specialist dots** | **Universal work agent** + **role agents** | **Model API / app integration**—shell is yours or a partner’s |
| **Identity** | **@handle**; specialist dots with **own identity** (preview) | **Dedicated Workspace coworker** account with **own email** | No first-party “coworker mailbox” from Anthropic |
| **Compute** | **Cloud computer + browser** per dot; optional **user laptop** | Cloud-hosted agent + connectors; client apps across OS | Tool use via **your** runtime (IDE, terminal, browser SDK) |
| **Connector scale** | **4,000+ apps** (plugin ecosystem) | Workspace, M365, Slack, Jira, warehouses, **MCP** | Connectors via platform partners; strong **coding** harnesses |
| **Idle behavior** | **Proactive research** (read-only on connected apps) | Long-horizon **tasks inbox** (hours/days in coverage) | Depends on orchestrator you build |
| **Model routing** | **GPT-6 Astra** for dots | **Multi-model** inside agent (incl. Claude in reports) | Explicit **Sonnet / Opus / Haiku** routing in your stack |
| **Governance hooks** | **Custom Rules**, Auto-review, inspectable VM | Spend caps, admin, coworker audit attribution | **Effort** settings, ZDR, verification programs |
| **Microsoft alignment** | **Teams**, **Agent 365** for specialist governance | **M365 connectors** | Azure-hosted Claude; no Dot-equivalent SKU |

**Reading the table:** Google optimizes for **organizational actor** semantics (coworker in the org chart). OpenAI optimizes for **personal always-on worker** that **scales to specialist fleet** under **Microsoft governance** for enterprises. Anthropic optimizes for **model capability and safety depth** on **your** orchestration—excellent for [agentic coding](/ai/posts/ai-2026-10-10-claude-sonnet-5-5-agentic-coding-everyday-work/) and knowledge loops, but without a September–October **named always-on dot** product in public messaging.

### Dots as “inspectable worker” vs. Intelligent UI as “generated surface”

[GPT-6 Intelligent UI](/ai/posts/ai-2026-10-09-gpt6-intelligent-ui-enterprise-agent-wave/) streams **components** into chat—buttons, forms, charts—while reasoning continues. Dots **leaves the transcript** to operate a **persistent environment**. Product teams should not merge the two in internal architecture diagrams: Intelligent UI is **presentation-layer** innovation; Dots is **execution-layer** persistence. Security reviews differ: UI injection vs. **VM/browser exfiltration** and **cross-app write** paths.

### FinOps: what counts toward limits

OpenAI’s usage accounting is unusually explicit for October 2026:

- **Dot conversations** → **excluded** from ChatGPT usage limits.
- **Codex** and **ChatGPT Work** tasks created by or for the dot → **still count**.

FinOps models must **tag workload type**, not only “ChatGPT spend.” Pair with [inference cost caps and model routing](/ai/posts/ai-2026-05-19-inference-cost-caps-model-routing-finops/) discipline when dots fan out into Codex environments for engineering tasks.

### Plugin graph vs. MCP graph

Google’s October agent narrative elevates **MCP** for tool portability. OpenAI’s Dots narrative elevates a **4,000+ app plugin ecosystem**—familiar to ChatGPT enterprise buyers, but requiring the same **least-privilege** reviews: each plugin is a **lateral movement** path from the dot’s cloud computer into SaaS tenants. Map plugins to **data classification** tiers before enabling proactive research on connected apps.

## Forecast scenarios and falsifiers

### 0–3 months (Q4 2026)

**Scenario A – “Primary dot becomes default power-user surface.”** Pro and Business Premium users adopt one dot for **inbox triage**, **travel**, and **recurring research**; Slack/Teams messaging becomes the main touchpoint.

- **Falsifier:** If **gradual rollout** delays exceed **several days** for large cohorts, or **EEA/UK/Swiss Pro exclusions** push EU power users to VPN workarounds, adoption concentrates in **US Business Premium** only.

**Scenario B – “Custom Rules become de facto enterprise policy language.”** Security teams export **allow / approval / block** matrices into Custom Rules instead of building separate agent gateways.

- **Falsifier:** If **Enterprise** tenants remain **off by default** and admins lack **central rule templates**, enterprises standardize on **disable dot** until specialist dots mature.

**Scenario C – “Proactive research triggers compliance review.”** Legal teams scrutinize **read-only** idle research on CRM and mail plugins under **employment and surveillance** policies.

- **Falsifier:** If OpenAI ships **granular idle-off** defaults per connector class early, backlash stays confined to anecdotal press.

**Scenario D – “Codex bridge turns dots into eng schedulers.”** Dots routinely **spawn Codex cloud tasks**; engineering managers worry about **unbilled Codex usage** more than ChatGPT caps.

- **Falsifier:** If Codex tasks remain rare in telemetry or require heavy manual setup, dots stay **personal productivity** not **SDLC**.

### 3–12 months (2027)

**Scenario E – “Specialist dots replace shared service accounts.”** Procurement, AP, and support run **named specialist dots** with **Agent 365** policies instead of brittle RPA bots.

- **Falsifier:** If **standalone dot email** and **outbound user calls** remain unavailable, workflows that need **bidirectional telephony** stay on legacy stacks.

**Scenario F – “Teams of dots without orchestration chaos.”** Users run **multiple dots** with divided Custom Rules; Microsoft/Google identity graphs must attribute **which dot** edited a record.

- **Falsifier:** If **cross-dot coordination** is immature, enterprises cap at **one dot per employee** through policy.

**Scenario G – “Texting beta expands—or stalls on carrier policy.”** US Pro texting via third-party provider becomes a **high-trust** channel for alerts; STOP semantics enter **employee comms** policies.

- **Falsifier:** If beta stays **Pro US only** with no Business path, enterprises forbid texting for **regulated** content entirely.

**Scenario H – “Inspectable VMs become audit standard.”** Regulators and customers expect **session replay**-grade evidence from dot cloud computers—pressure on OpenAI and competitors to match.

- **Falsifier:** If inspectability is **consumer-grade** only without **SIEM export**, enterprises limit dots to **non-production** data classes.

## Actionable checklists by role

### Platform engineering / IT

1. Confirm **Enterprise admin enable** workflow and **gradual rollout** comms before promising dot access org-wide.
2. Standardize **creation on desktop app or desktop web**; document that **mobile cannot create** dots and **mobile web is unsupported** for setup.
3. Treat **local laptop access** as **opt-in** via desktop app; default **off** aligns with zero-trust laptop segmentation.
4. Integrate **Slack** and **Teams** routing with existing **bot governance** (token storage, channel allowlists).
5. Enable **Codex task creation** only where **CI and secrets** policies already govern Codex cloud environments.
6. Plan **handle naming** (`@yourname-dot`) for **discoverability** in Slack without colliding with human handles.

### Security and compliance

1. Map **Custom Rules** to your **four-eye** principles: block external send, require approval on financial systems, allow read-only research.
2. Treat **proactive research** as **data access** even when read-only—log connector scope and idle windows.
3. Never rely on dots for **password rotation**; enforce **user-only password changes** in identity runbooks.
4. Use **Pause** for containment; use **Reset** only with **legal hold** checks (destroys memories and scheduled tasks).
5. Compare **Business/Enterprise/Edu default no-training** to **personal** plan settings for **mixed** tenant edge cases.
6. Review **WIRED-style** anecdotal failure modes (CAPTCHA, stuck workflows) in **red-team** scenarios—not as SLA gaps.

### FinOps

1. Model **first dot included** plus **first-month extended limits**; track burn after month one without assuming published add-on pricing.
2. **Exclude dot chat** from ChatGPT limit models but **include Codex and Work** task lines—avoid surprise spikes.
3. Attribute **plugin calls** and **cloud computer** runtime if OpenAI exposes usage dashboards; if not, proxy via **Slack/Teams** message volume and Codex job IDs.
4. Compare dot-driven automation to [multicloud inference economics](/ai/posts/ai-2026-04-28-inference-economics-multicloud-capacity-planning/) for **self-hosted** orchestrators on Claude Sonnet 5.5.

### Product management

1. Position dots for **goal-directed** work (research, scheduling, monitoring) distinct from **Intelligent UI** micro-apps in chat.
2. Communicate **no dot-initiated calls to user** at launch—set expectations for **async** not **pager-duty** agents.
3. For **US Pro**, disclose **texting beta** limitations (third-party provider, STOP) in user-facing copy.
4. Roadmap **specialist dots** separately from **primary dot** UX to avoid over-promising enterprise **systems-of-record** depth before pilots land.

### Procurement

1. Request **Enterprise enablement** timeline, **Healthcare/Edu** terms, and **Agent 365** integration scope for specialist dots.
2. Confirm **regional eligibility**: Pro vs. Business Premium vs. **EEA/UK/CH Pro exclusion**.
3. Ask whether **plugin** data flows qualify as **subprocessors** per app vendor.
4. Document **Reset** data destruction for **retention** and **eDiscovery** questionnaires.
5. Align **Microsoft** and **OpenAI** DPAs when Teams + Agent 365 + dots coexist.

## Risks, misconceptions, and boundaries

**Misconception:** “Always-on means the dot can do anything while I sleep.”  
**Reality:** **Custom Rules**, **Auto-review**, **monitoring pauses**, and **read-only idle research** bound autonomy. Password changes stay **human-only**.

**Misconception:** “Dot chat is free unlimited inference.”  
**Reality:** OpenAI excludes **dot conversations** from ChatGPT usage limits, but **Codex** and **Work** tasks **still count**—extended **deeper work** may hit **allowance** boundaries after promotional months.

**Misconception:** “Inspectable computer equals SOX-ready audit.”  
**Reality:** Inspectability helps **forensics**; enterprises still need **export**, **retention**, and **separation of duties** aligned with [enterprise agent governance](/ai/posts/ai-2026-05-08-enterprise-agent-governance-frameworks-production/).

**Misconception:** “Specialist dots are GA for every Enterprise tenant.”  
**Reality:** OpenAI describes **enterprise pilots** and **preview** identity patterns—treat as **controlled rollout**, not universal feature flags.

**Misconception:** “Dots replaces Google’s coworker agent or Claude APIs.”  
**Reality:** Dots is **OpenAI’s persistent worker** inside ChatGPT ecosystem; Google leads with **Workspace identity**; Anthropic leads with **model tier economics** for **your** shells. Many enterprises will run **all three patterns** by department.

**Misconception:** “Texting beta is enterprise-ready.”  
**Reality:** Help Center limits texting to **Pro US**, **not** Business/Enterprise—a **consumer-channel** experiment, not regulated notification infrastructure.

**Boundary:** **YMYL and regulated data.** Dots that touch **healthcare**, **finance**, or **legal** workflows need human oversight and jurisdiction-specific rules regardless of model safeguards.

**Boundary:** **Journalist anecdotes.** CAPTCHA struggles and odd conversational outputs in press reviews are **signals for pilots**, not **vendor warranties**.

## Deep dive: primary dot lifecycle and operator controls

### Creation, handles, and surfaces

Operators should script an internal **onboarding checklist**:

1. User creates dot on **desktop app** or **desktop web** (Windows desktop app supported).
2. Default **@yourname-dot** handle appears in Slack/Teams integrations—**rename early** if handle collisions confuse teams.
3. Connect **Slack**; configure **Teams** if Microsoft-centric.
4. Leave **local computer access disabled** until a **scoped** use case requires laptop tools.
5. Author **Custom Rules** before enabling high-risk plugins.

### Voice, texting, and async expectations

**Voice calls** to interact with the dot are supported per announcement; **texting** is **coming soon** at announcement time, with Help Center noting **limited beta** for **Pro US** via a **third-party provider**. **Dots cannot call the user** at launch—design workflows around **user-initiated** contact or **Slack/Teams** pings.

### Memories, tasks, and Reset semantics

**Reset** is a **hard delete** of conversations, memories, and scheduled tasks. Incident playbooks should prefer **Pause** for investigation, **Reset** only after **export** if your policy requires retention. This differs from Google’s **four-memory graph** narrative in [Gemini agent architecture](/ai/posts/ai-2026-10-09-google-gemini-agent-enterprise-coworker/)—Dots memory semantics are **OpenAI-managed** inside ChatGPT’s dot product, not a customer-owned graph export by default.

## Deep dive: proactive research and plugin least privilege

Proactive research is OpenAI’s compromise between **utility** (the dot prepares briefings before Monday standup) and **risk** (unattended tool use). The stated constraints:

- **Read-only** tools on **connected apps only**.
- No **messages sent**, **content changed**, or **browser/computer control** in that mode.

**Architecture translation:**

1. Classify plugins into **Read**, **Write**, and **Admin** tiers—only **Read** should be reachable during idle research if you mirror OpenAI’s intent.
2. Disable plugins that are **read in name but write in API** (common in poorly scoped OAuth scopes).
3. Log **idle intervals** and correlate with **data loss prevention** alerts—read-only exfiltration to the dot’s notes is still **exfiltration** if notes sync to unmanaged devices.

Connect to [multimodal RAG and knowledge governance](/ai/posts/ai-2026-05-19-multimodal-rag-enterprise-knowledge-governance/) when dots summarize internal corpora via plugins.

## Deep dive: specialist dots and Microsoft Agent 365

Specialist dots preview three enterprise primitives missing from a single shared “copilot” login:

1. **Distinct identity** for **access management**—map to **service principal** or **shared mailbox** patterns without conflating the human’s SSO session.
2. **IT-provisioned hardware**—hints at **dedicated endpoints** or **VDI** for high-trust workflows (invoice scanning, contract review).
3. **Deep systems-of-record integrations**—procurement, AP, marketing automation, support, contracting—the same back-office surfaces RPA vendors targeted for a decade.

**Microsoft Agent 365 integration** suggests governance flows—policy, lifecycle, audit—through admin consoles enterprises already operate. Platform teams should **pre-wire** Agent 365 **before** specialist dots GA rather than bolting governance on after **thousands of primary dots** exist.

Internal OpenAI use cases cited—**procurement**, **invoice processing**, **email marketing**, **customer support**, **commercial contracting**—are **back-office** heavy. Pilots should measure **cycle time** and **exception rate**, not demo fluency.

## Deep dive: pairing Dots with Claude and open coding stacks

Many enterprises will **not** choose one vendor. A **hybrid pattern** consistent with October 2026 public products:

| Layer | Example choice |
|-------|----------------|
| **Personal always-on** | **Primary dot** for calendar, travel, mail triage, Slack coordination |
| **Org-wide work agent** | **Gemini agent** for Workspace-native **coworker** workflows |
| **Repo-sovereign coding** | **Claude Sonnet 5.5** or [JetBrains Mellum 2.1](/ai/posts/ai-2026-10-09-jetbrains-mellum-2-1-open-coding-agents/) behind CI gates |
| **Heavy code environments** | **Codex tasks** spawned from dot **only** with **branch protections** |

Dots become the **scheduler and integrator**; Sonnet/Mellum remain **execution engines** where **IP and harness** matter. Avoid duplicate **plugin + MCP + dot** paths to the same CRM without **cost and DLP** guards.

## Enterprise procurement: diligence questions for Q4 2026

1. **Enablement:** What is the admin workflow to enable dots for **Enterprise/Edu/Healthcare**, and is rollout **gradual** per workspace?
2. **Regions:** Which plan types are blocked in **EEA, Switzerland, UK** for Pro—and does **Business Premium** cover EU colleagues?
3. **Usage:** How are **extended limits** metered after the **first month**, and what dashboards exist for **Codex/Work** tasks triggered by dots?
4. **Plugins:** Is there an **admin allowlist** for the **4,000+** ecosystem, and how are **OAuth scopes** reviewed?
5. **Idle research:** Can admins **disable proactive research** globally or per connector?
6. **Specialist dots:** What is the pilot **SLA**, **identity model**, and **Agent 365** feature matrix?
7. **Data:** Confirm **no training** defaults on Business/Enterprise/Edu and **exclusions** for proactive research and self-notes.
8. **Incident response:** What telemetry is available when OpenAI **pauses** a dot for safety—and can customers **export** inspectable computer sessions?

## Synthesis

**OpenAI Dots**, announced **September 29, 2026**, is the company’s bid to make **GPT-6 Astra** a **persistent worker**, not only a **chat model**. With a **cloud computer and browser**, **4,000+ app plugins**, **Slack/Teams/voice** reachability, **Custom Rules** and **Auto-review**, **read-only proactive research**, and a path to **specialist dots** under **Microsoft Agent 365**, Dots encodes lessons from two years of **browser-agent demos**: give users **inspectability**, **approval gates**, and **clear usage accounting** (dot chat **outside** ChatGPT limits; **Codex/Work** still **inside**).

Against [Google’s Gemini agent](/ai/posts/ai-2026-10-09-google-gemini-agent-enterprise-coworker/), Dots today is **more personal**, **more VM-centric**, and **more ChatGPT-native**; Google is **more org-graph** and **coworker-email** centric. Against [Claude Sonnet 5.5](/ai/posts/ai-2026-10-10-claude-sonnet-5-5-agentic-coding-everyday-work/), OpenAI ships the **named product shell**; Anthropic ships **model depth** for teams that bring their own orchestration. Winners in 2027 will treat dots as **employees with badges**—onboarding, **least privilege**, **measurable outcomes**, and **honest Reset/Pause drills**—not as magic interns exempt from [agent evaluation](/ai/posts/ai-2026-04-27-agent-evaluation-observability-production/) discipline.

## Further reading on WordOK AI

- [GPT-6 Intelligent UI and the October 2026 agent wave](/ai/posts/ai-2026-10-09-gpt6-intelligent-ui-enterprise-agent-wave/)
- [Google Gemini agent enterprise coworker architecture](/ai/posts/ai-2026-10-09-google-gemini-agent-enterprise-coworker/)
- [Claude Sonnet 5.5 for agentic coding and everyday work](/ai/posts/ai-2026-10-10-claude-sonnet-5-5-agentic-coding-everyday-work/)
- [Claude Haiku 5.5 and high-volume inference economics](/ai/posts/ai-2026-10-09-claude-haiku-5-5-high-volume-inference-economics/)
- [Enterprise AI agent orchestration (April 2026)](/ai/posts/ai-2026-04-28-enterprise-ai-agent-orchestration-google-cloud-openai-workspace/)
- [Enterprise agent governance frameworks](/ai/posts/ai-2026-05-08-enterprise-agent-governance-frameworks-production/)
- [Agentic workflows and SaaS integration security](/ai/posts/ai-2026-05-07-agentic-workflows-saas-integration-security/)
- [Inference cost caps and model routing FinOps](/ai/posts/ai-2026-05-19-inference-cost-caps-model-routing-finops/)

---

*WordOK Tech Publications covers artificial intelligence industry developments for informational purposes. ChatGPT, Dots, GPT-6, Codex, and OpenAI are trademarks of OpenAI; Microsoft, Teams, and Agent 365 are trademarks of Microsoft Corporation; other names belong to their respective owners.*
