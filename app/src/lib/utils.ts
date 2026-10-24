import { createCn } from "cn/config"

// Our six type steps (tokens.css) are font sizes. Without telling cn, it reads `text-heading` as a colour
// and drops it when a colour such as `text-pompebled` comes after it.
// Components import cn from here (components.json "utils"), not from the "cn" package directly.
export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: ["small", "body", "lead", "title", "heading", "display"] }] } },
})
