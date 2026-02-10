export const countleavesPseudo = [
  "FUNCTION COUNT_LEAVES(node)",
  "  IF node is null THEN",
  "    RETURN 0",
  "  END IF",
  "",
  "  IF node.left is null AND node.right is null THEN",
  "    RETURN 1",
  "  END IF",
  "",
  "  left_leaves ← COUNT_LEAVES(node.left)",
  "  right_leaves ← COUNT_LEAVES(node.right)",
  "  RETURN left_leaves + right_leaves",
  "END FUNCTION"
]

