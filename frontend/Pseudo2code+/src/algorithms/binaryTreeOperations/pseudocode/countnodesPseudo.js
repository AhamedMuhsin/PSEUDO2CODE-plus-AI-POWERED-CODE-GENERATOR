export const countnodesPseudo = [
  "FUNCTION COUNT_NODES(node)",
  "  IF node is null THEN",
  "    RETURN 0",
  "  END IF",
  "",
  "  left_count ← COUNT_NODES(node.left)",
  "  right_count ← COUNT_NODES(node.right)",
  "  RETURN 1 + left_count + right_count",
  "END FUNCTION"
]
