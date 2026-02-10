export const inorderPseudo = [
  "PROCEDURE INORDER(node)",
  "  IF node is null THEN",
  "    RETURN",
  "  END IF",
  "",
  "  INORDER(node.left)",
  "  Process(node)",
  "  INORDER(node.right)",
  "END PROCEDURE",
  "",
  "// Order: Left → Node → Right"
]
