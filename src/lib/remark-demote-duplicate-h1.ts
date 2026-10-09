import fs from "node:fs";

function normalizeHeading(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fff-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function headingText(node: { children?: Array<{ type?: string; value?: string }> }): string {
  if (!node.children?.length) return "";
  return node.children
    .map((c) => (c.type === "text" && c.value ? c.value : ""))
    .join("")
    .trim();
}

function readPostTitleFromFile(filepath: string): string | null {
  let raw: string;
  try {
    raw = fs.readFileSync(filepath, "utf8");
  } catch {
    return null;
  }

  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    const fm = fmMatch[1];
    const quoted = fm.match(/^title:\s*["'](.+?)["']\s*$/m);
    if (quoted) return quoted[1].trim();
    const plain = fm.match(/^title:\s*(.+)\s*$/m);
    if (plain) return plain[1].trim();
  }

  const body = fmMatch ? raw.slice(fmMatch[0].length) : raw;
  const h1 = body.match(/^#\s+(.+)$/m);
  return h1 ? h1[1].trim() : null;
}

/**
 * Demote the first markdown H1 to H2 when its text matches the post title (frontmatter or first # line).
 * Layout templates already render a page-level H1 from frontmatter.
 */
export function remarkDemoteDuplicateH1() {
  return (tree: import("mdast").Root, file: { path?: string; history?: string[] }) => {
    const filepath = file.path || file.history?.[0];
    if (!filepath || !/\/posts\/[^/]+\.md$/.test(filepath)) return;

    const title = readPostTitleFromFile(filepath);
    if (!title) return;
    const normTitle = normalizeHeading(title);

    let demoted = false;
    const visit = (node: import("mdast").Root | import("mdast").Content) => {
      if (demoted) return;
      if (node.type === "heading" && node.depth === 1) {
        const text = headingText(node);
        if (text && normalizeHeading(text) === normTitle) {
          node.depth = 2;
          demoted = true;
        }
        return;
      }
      if ("children" in node && Array.isArray(node.children)) {
        for (const child of node.children) visit(child);
      }
    };
    visit(tree);
  };
}
