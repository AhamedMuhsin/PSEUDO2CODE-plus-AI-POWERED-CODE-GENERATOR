export const levelorderPseudo = [
  "PROCEDURE LEVEL_ORDER(root)",
  "  IF root is null THEN",
  "    RETURN",
  "  END IF",
  "",
  "  queue ← [root]",
  "  WHILE queue not empty DO",
  "    node ← dequeue()",
  "    Process(node)",
  "    IF node.left exists THEN",
  "      enqueue(node.left)",
  "    END IF",
  "    IF node.right exists THEN",
  "      enqueue(node.right)",
  "    END IF",
  "  END WHILE",
  "END PROCEDURE"
]
