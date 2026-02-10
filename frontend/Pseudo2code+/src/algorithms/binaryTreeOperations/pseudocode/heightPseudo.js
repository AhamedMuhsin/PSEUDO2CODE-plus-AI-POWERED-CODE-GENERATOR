export const heightPseudo = [
  "FUNCTION HEIGHT(node)",
  "  IF node is null THEN",
  "    RETURN 0",
  "  END IF",
  "",
  "  left_h ← HEIGHT(node.left)",
  "  right_h ← HEIGHT(node.right)",
  "  RETURN max(left_h, right_h) + 1",
  "END FUNCTION"
]
