export const postorderPseudo = [
  "PROCEDURE POSTORDER(node)",
  "  IF node is null THEN",
  "    RETURN",
  "  END IF",
  "",
  "  POSTORDER(node.left)",
  "  POSTORDER(node.right)",
  "  Process(node)",
  "END PROCEDURE",
  "",
  "// Order: Left → Right → Node"
]
