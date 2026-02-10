export const preorderPseudo = [
  "PROCEDURE PREORDER(node)",
  "  IF node is null THEN",
  "    RETURN",
  "  END IF",
  "",
  "  Process(node)",
  "  PREORDER(node.left)",
  "  PREORDER(node.right)",
  "END PROCEDURE",
  "",
  "// Order: Node → Left → Right"
]
