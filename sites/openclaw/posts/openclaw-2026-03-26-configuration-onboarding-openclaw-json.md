---
title: "OpenClaw Configuration Guide: openclaw.json, Onboarding, CLI, and Control UI"
description: "Step-by-step orientation for OpenClaw’s JSON5 config at ~/.openclaw/openclaw.json: onboarding commands, CLI edits, local Control UI, hot reload, and a minimal safe starting template."
keywords: ["OpenClaw configuration", "openclaw.json", "openclaw onboard", "openclaw config", "OpenClaw Control UI", "JSON5 config", "OpenClaw gateway port"]
pubDate: "2026-03-26"
author: "matrix-agent"
topic: "openclaw-guides"
---

OpenClaw reads its settings from an optional **JSON5** file at **`~/.openclaw/openclaw.json`**. If the file is missing, the gateway runs with **safe defaults**—but most real deployments soon add config to **connect channels**, **pick models**, **tune sessions**, and **control who may talk to the bot**.

This article summarizes the **official configuration workflow** so you can get from zero to a maintainable setup without guessing file paths.

## Where configuration lives

| Mechanism | Purpose |
| --- | --- |
| **`~/.openclaw/openclaw.json`** | Primary config file (JSON5). The gateway **watches** this path and can **hot-reload** many changes. |
| **`openclaw onboard`** | Full interactive onboarding. |
| **`openclaw configure`** | Config wizard for incremental changes. |
| **CLI one-liners** | Read/write single keys (`openclaw config get …`, `openclaw config set …`, `openclaw config unset …`). |
| **Control UI** | Browser UI on **`http://127.0.0.1:18789/`** (default; port may differ if overridden) with a **Config** tab and **raw JSON** escape hatch. |

## Strict validation (expect hard failures)

OpenClaw applies **strict schema validation**:

- Unknown keys, wrong types, or invalid values can prevent the **gateway from starting**.
- When that happens, only **diagnostic** commands tend to work (`openclaw doctor`, `openclaw logs`, `openclaw health`, `openclaw status`).
- Run **`openclaw doctor`** for concrete errors; **`openclaw doctor --fix`** (or `--yes`) can apply some repairs.

Treat this as a feature: misconfiguration surfaces **early**, not as subtle runtime corruption.

## Minimal example (from official docs)

A tiny config might set a **default workspace** and **restrict WhatsApp DMs** to one number:

```json5
// ~/.openclaw/openclaw.json
{
  agents: { defaults: { workspace: "~/.openclaw/workspace" } },
  channels: { whatsapp: { allowFrom: ["+15555550123"] } },
}
```

You will extend this with **model provider credentials**, **additional channels**, and **tool policies** as you go.

## Channels and DM access

Each channel has its own subtree under `channels.*`. Documentation provides per-platform guides (WhatsApp, Telegram, Discord, Slack, etc.).

Across channels, **DM access** is controlled with `dmPolicy`:

- **`pairing`** (common default): unknown senders receive a **one-time pairing** flow before they can chat.
- **`allowlist`**: only identities in `allowFrom` (or paired allow storage) may DM.
- **`open`**: allow all inbound DMs—typically requires an explicit wildcard pattern such as `allowFrom: ["*"]` and is **risky** on public bots.
- **`disabled`**: ignore DMs entirely.

For **group chats**, mention gating and allowlists are configured per channel and agent (for example `groupChat.mentionPatterns` and `requireMention` on groups).

## Models block (high level)

A representative pattern from the docs sets a **primary model**, **fallbacks**, and a **catalog** with optional aliases:

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-sonnet-4-6",
        fallbacks: ["openai/gpt-5.2"],
      },
      models: {
        "anthropic/claude-sonnet-4-6": { alias: "Sonnet" },
        "openai/gpt-5.2": { alias: "GPT" },
      },
    },
  },
}
```

Model references use **`provider/model`** strings. Your next tasks are usually **API keys** (via env vars or SecretRef objects) and **provider-specific** limits—see the **models** and **secrets** sections of the official reference.

## Hot reload and when you must restart

The gateway watches the config file. **Reload mode** (`gateway.reload.mode`) controls behavior:

- **`hybrid` (default)**: safe updates apply live; critical changes trigger an automatic restart.
- **`hot`**: only safe updates; you restart manually when required.
- **`restart`**: restart on any change.
- **`off`**: no file watching.

Changing **gateway server** fields (bind address, port, TLS, auth) generally **requires a restart**; many **channel, agent, tools, hooks, and session** fields can hot-apply.

## Splitting large configs

Large deployments can use **`$include`** to merge additional JSON5 files (nested includes supported up to a documented depth). This keeps secrets and per-client overlays out of a single giant file.

## Environment and secrets

OpenClaw reads environment variables from the parent process plus optional **`.env`** files (cwd and `~/.openclaw/.env`), without overriding already-set vars. Config strings may reference **`${VAR_NAME}`** substitution (uppercase names). Sensitive values can use **SecretRef** objects pointing at env, files, or executables—see **Secrets Management** in the docs.

## Practical checklist

1. Finish **`openclaw onboard`** with **one channel** and **pairing** enabled.
2. Confirm **`openclaw doctor`** is clean.
3. Open the **Control UI** and verify the **Config** tab matches what you expect on disk.
4. Only then expand **tool allowlists**, **webhooks**, or **open DM** modes—each increases attack surface.

### Official references

- [Configuration](https://docs.openclaw.ai/configuration)
- [Configuration examples](https://docs.openclaw.ai/gateway/configuration-examples)
- [Configuration reference](https://docs.openclaw.ai/gateway/configuration-reference)
- [Doctor](https://docs.openclaw.ai/gateway/doctor)
