---
title: "Kimi K2: Open Agentic Intelligence — Moonshot AI's Latest Breakthrough"
description: "Moonshot AI introduces Kimi K2, a 1 trillion-parameter MoE model achieving state-of-the-art agentic capabilities. Explore MuonClip, large-scale agentic data synthesis, and benchmark results."
pubDate: "2025-07-25"
updatedDate: "2025-07-25"
keywords: ["Kimi K2", "Moonshot AI", "agentic intelligence", "LLM", "Mixture of Experts", "MuonClip", "open source AI"]
author: "tech-team"
topic: "ai-frontiers"
faq:
  - question: "What is Kimi K2?"
    answer: "Kimi K2 is a 1 trillion-parameter Mixture-of-Experts (MoE) large language model from Moonshot AI with 32 billion activated parameters, designed for agentic intelligence—autonomous perception, planning, reasoning, and action in complex environments."
  - question: "What is the MuonClip optimizer?"
    answer: "MuonClip is a novel optimizer that combines the token-efficient Muon algorithm with QK-Clip, a weight-clipping technique that prevents attention logit explosion during training, enabling stable pre-training on 15.5 trillion tokens with zero loss spikes."
  - question: "How does Kimi K2 perform on benchmarks?"
    answer: "Kimi K2 achieves 66.1 on Tau2-Bench, 76.5 on ACEBench, 65.8 on SWE-Bench Verified, 53.7 on LiveCodeBench v6, 49.5 on AIME 2025, and 75.1 on GPQA-Diamond—ranking as the top open-source model on LMSYS Arena (July 2025)."
---

# Kimi K2: Open Agentic Intelligence — Moonshot AI's Latest Breakthrough

Moonshot AI has released **Kimi K2**, a landmark large language model that pushes the boundaries of **agentic intelligence**—the ability of AI systems to autonomously perceive, plan, reason, and act within complex, dynamic environments. Published in the paper *Kimi K2: Open Agentic Intelligence* (arXiv:2507.20534), the model represents a significant step toward the next generation of foundation models.

## Key Highlights

- **1.04 trillion parameters** (32B activated) in a Mixture-of-Experts (MoE) architecture
- **MuonClip optimizer** — stable training on 15.5T tokens with zero loss spikes
- **State-of-the-art agentic performance** — top open-source model on LMSYS Arena (July 2025)
- **Fully open-sourced** — base and post-trained checkpoints on [Hugging Face](https://huggingface.co/moonshotai/Kimi-K2-Instruct)

## The Shift to Agentic Intelligence

Traditional LLMs learn from static, human-generated data. Agentic intelligence marks a paradigm shift: models that learn through **interactions**, acquire skills beyond their training distribution, and adapt through experience. This approach allows AI agents to go beyond the limits of static data and develop superhuman capabilities through exploration and exploitation.

Achieving this requires advances in both **pre-training** (broad general-purpose priors with high token efficiency) and **post-training** (scalable synthesis of agentic trajectories and reinforcement learning).

## MuonClip: Stable Training at Scale

A core technical contribution is **MuonClip**, a novel optimizer that addresses a critical challenge when scaling the token-efficient Muon algorithm: training instability due to exploding attention logits.

### The Problem

As Muon scales, attention logits can rapidly exceed magnitudes of 1000, leading to loss spikes and occasional divergence. Existing mitigations (logit soft-cap, QK-Norm) were insufficient for Multi-head Latent Attention (MLA) architectures.

### The Solution: QK-Clip

QK-Clip rescales query and key projection weights whenever the maximum attention logit exceeds a threshold τ. The mechanism:

- Applies **per-head** scaling (only heads with exploding logits are clipped)
- Does not alter forward/backward computation—uses max logit as a guiding signal
- Integrates seamlessly with MLA by scaling head-specific components (q^C, k^C, q^R)

With τ=100, Kimi K2 trained on 15.5T tokens with **no observable loss spikes**, validating MuonClip's effectiveness at scale.

## Pre-Training: Token Efficiency and Data Rephrasing

Kimi K2 was pre-trained on **15.5 trillion tokens** across Web Text, Code, Mathematics, and Knowledge. Key innovations:

### Synthetic Rephrasing

To improve token utility without overfitting, Moonshot introduced domain-specific rephrasing:

- **Knowledge data**: Style- and perspective-diverse prompting, chunk-wise autoregressive generation, and fidelity verification
- **Mathematics data**: "Learning-note" style rewriting (SwallowMath) and translation of high-quality materials

Experiments showed rephrased data consistently outperformed multi-epoch repetition on SimpleQA.

### Model Architecture

| Parameter | Kimi K2 | DeepSeek-V3 |
|-----------|---------|-------------|
| Total Parameters | 1.04T | 671B |
| Activated Parameters | 32.6B | 37B |
| Experts | 384 | 256 |
| Attention Heads | 64 | 128 |

Kimi K2 increases sparsity (384 experts, 8 active per token) for better performance while reducing attention heads to improve inference efficiency at long context lengths (e.g., 128K).

## Post-Training: Agentic Data Synthesis and RL

### Large-Scale Agentic Data Synthesis

A critical capability is **autonomous tool use**—using unfamiliar tools, interacting with environments, and iteratively refining actions. Moonshot built a comprehensive pipeline:

1. **Tool spec generation**: 3000+ real MCP tools + 20,000+ synthetic tools via hierarchical domain evolution
2. **Agent and task generation**: Diverse agents with different tool combinations and rubric-based tasks
3. **Trajectory generation**: Multi-turn dialogues with user simulation and tool execution environments
4. **Quality filtering**: LLM-based judges retain only trajectories meeting success criteria
5. **Hybrid approach**: Real execution sandboxes for coding tasks to ground learning in authentic feedback

### Reinforcement Learning

K2 extends RL with:

- **Verifiable Rewards Gym**: Math, STEM, logical tasks, complex instruction following, faithfulness, coding, and safety
- **Self-Critique Rubric Reward**: For subjective tasks (creative writing, open-ended QA), the model judges its own outputs via pairwise comparisons
- **Budget control**: Per-sample token limits to encourage concise solutions
- **PTX loss**: Prevents forgetting of high-quality data during joint RL
- **Temperature decay**: Exploration early, exploitation later

## Benchmark Results

Kimi K2 achieves state-of-the-art among **open-source non-thinking models**:

| Benchmark | Kimi K2 | Best Open Baseline |
|-----------|---------|---------------------|
| Tau2-Bench | **66.1** | — |
| ACEBench (En) | **76.5** | — |
| SWE-Bench Verified | **65.8** | — |
| LiveCodeBench v6 | **53.7** | 46.9 (DeepSeek-V3) |
| OJBench | **27.1** | 24.0 (DeepSeek-V3) |
| AIME 2025 | **49.5** | — |
| GPQA-Diamond | **75.1** | — |

On the [LMSYS Arena](https://lmarena.ai/leaderboard/text) (July 17, 2025), Kimi K2 ranks **#1 among open-source models** and **#5 overall** based on over 3,000 user votes.

## Implications and Open Source

Kimi K2 demonstrates that agentic intelligence can be achieved through:

1. **Stable, token-efficient pre-training** (MuonClip, rephrasing)
2. **Scalable agentic data synthesis** (simulation + real execution)
3. **General RL frameworks** (verifiable rewards + self-critique)

By open-sourcing base and post-trained checkpoints, Moonshot enables the community to explore, refine, and deploy agentic intelligence at scale. The paper and models are available at:

- **Paper**: [arXiv:2507.20534](https://arxiv.org/abs/2507.20534)
- **Model**: [Hugging Face — Kimi-K2-Instruct](https://huggingface.co/moonshotai/Kimi-K2-Instruct)

---

*This article summarizes the technical report "Kimi K2: Open Agentic Intelligence" by the Kimi Team at Moonshot AI. All benchmark data and technical details are from the original paper.*
