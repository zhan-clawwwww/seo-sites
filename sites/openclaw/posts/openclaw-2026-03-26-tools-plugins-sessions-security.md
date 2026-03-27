---
title: "OpenClaw Tools, Plugins, Sessions, and Security Best Practices"
description: "How OpenClaw agent tools and plugins extend the gateway, how sessions isolate conversations, and which security knobs (sandboxing, webhooks, tool allowlists) matter before you go to production."
keywords: ["OpenClaw tools", "OpenClaw plugins", "ClawHub", "OpenClaw sandbox", "OpenClaw sessions", "OpenClaw webhooks", "OpenClaw security", "tools.allow"]
pubDate: "2026-03-26"
author: "matrix-agent"
topic: "openclaw-guides"
---

Once your **gateway** is running and **channels** are connected, most incidents—good and bad—come from **tools**, **plugins**, **session routing**, and **automation surfaces** (cron, webhooks). This article ties those topics together with **security-minded defaults**, grounded in OpenClaw’s official documentation.

## Agent tools: power with a policy

**Tools** are structured actions the model may invoke: filesystem edits, shell execution, browser control, messaging helpers, scheduled tasks, and more. **Plugins** can register **additional tools** (and channels, providers, hooks, HTTP routes, CLI commands).

Official plugin documentation distinguishes:

- **Required tools** — always available once the plugin is loaded.
- **Optional tools** — users must explicitly allow them, for example:

```json5
{
  tools: { allow: ["workflow_tool"] },
}
```

You can also allow **all tools from a plugin** by adding the **plugin id** to `tools.allow`. Because **`deny` rules override `allow`**, many teams maintain a **minimal default allowlist** and expand slowly.

Community write-ups also describe **tool profiles** (such as minimal, coding, messaging, full) as **starting allowlists** before fine-grained `tools.allow` / `tools.deny` rules—check your installed OpenClaw version’s docs for the exact profile names and tool group shorthands (`group:fs`, `group:web`, etc.), as these evolve with releases.

## Plugins: ClawHub, npm, and manifests

External plugins ship as packages with an **`openclaw` stanza** in `package.json` and a **manifest** (`openclaw.plugin.json`). Users install with:

```bash
openclaw plugins install @scope/openclaw-my-plugin
```

OpenClaw resolves **ClawHub first**, then **npm**. In-repository development may place plugins under `extensions/` for automatic discovery.

When auditing a plugin, review what it registers (tools, HTTP routes, hooks) and whether it marks powerful tools as **optional**.

## Sessions: who shares context with whom

**Sessions** define how conversations are **scoped** and **reset**. Documentation highlights `session.dmScope` values such as:

- `main` — shared context (can be wrong for multi-user gateways).
- `per-peer`, `per-channel-peer`, `per-account-channel-peer` — progressively stronger isolation for DMs and accounts.

**Thread bindings** (where supported) help route long-running platform threads to stable session keys, with idle and max-age controls.

**Session reset** policies (daily resets, idle timeouts) reduce **unbounded context growth** and accidental **secret retention** in transcripts.

Pick the **narrowest scope** that still fits how your team uses the bot.

## Sandboxing execution

For risky tool use, OpenClaw supports **sandboxed agent sessions** (for example **Docker**-backed isolation) configured under `agents.defaults.sandbox` with modes such as **`off`**, **`non-main`**, and **`all`**, plus a **scope** (`session`, `agent`, `shared`).

You must **build the sandbox image** using the project’s setup script (`scripts/sandbox-setup.sh` per docs) before relying on this path.

## Webhooks and hooks: treat input as hostile

Hooks expose **HTTP endpoints** on the gateway. Example patterns from the configuration guide include **shared secrets**, **session key allowlists**, and **mapping rules** that route inbound HTTP to a specific agent session.

Documentation explicitly warns:

- Treat **hook payload bodies** as **untrusted input**.
- Avoid enabling **unsafe content bypass** flags except for tightly scoped debugging.
- Prefer **strict tool policies** (for example messaging-only) and **sandboxing** where feasible for hook-driven agents.

If your hook URL is reachable from the internet, combine **authentication**, **rate limits** (where available), and **narrow mappings**—do not hand a general-purpose shell toolset to a model fed by anonymous POSTs.

## Multi-agent routing

For separate **workspaces** and **identities**, OpenClaw supports **multiple agents** (`agents.list`) with **bindings** that map inbound channel/account pairs to a specific `agentId`. This is useful for **personal vs. work** numbers or **customer-specific** sandboxes.

## Operational habits

- Run **`openclaw doctor`** after upgrades or plugin installs.
- Keep **logs** when diagnosing tool failures or channel reconnect loops.
- Document your **`tools.allow` / `tools.deny`** decisions—future you will not remember why shell access was enabled.

## Bottom line

**Tools and plugins** are why OpenClaw feels magical; **sessions, sandboxing, and hook hygiene** are why it can stay **safe in production**. Default to **pairing or allowlists**, **narrow tool allowlists**, **sandbox risky agents**, and **minimal webhook surface area**—then expand deliberately.

### Official references

- [Building plugins / agent tools](https://docs.openclaw.ai/plugins/agent-tools)
- [Configuration — hooks example & security note](https://docs.openclaw.ai/configuration)
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing)
- [Session management](https://docs.openclaw.ai/concepts/session)
- [Multi-agent](https://docs.openclaw.ai/concepts/multi-agent)
