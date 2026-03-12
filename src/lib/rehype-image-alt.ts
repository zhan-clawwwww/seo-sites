/**
 * Rehype 插件：为缺少 alt 的图片添加描述性 alt 属性
 * 有助于 SEO 和可访问性
 */
export function rehypeImageAlt() {
  return (tree: import("hast").Root) => {
    const visit = (node: any) => {
      if (node.type === "element" && node.tagName === "img") {
        const alt = node.properties?.alt;
        if (!alt || String(alt).trim() === "") {
          // 使用 src 的文件名作为 fallback，或通用描述
          const src = node.properties?.src || "";
          const filename = src.split("/").pop()?.replace(/\.[^.]+$/, "") || "image";
          node.properties = node.properties || {};
          node.properties.alt = filename
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (c: string) => c.toUpperCase());
        }
      }
      if (node.children) {
        node.children.forEach(visit);
      }
    };
    visit(tree);
  };
}
