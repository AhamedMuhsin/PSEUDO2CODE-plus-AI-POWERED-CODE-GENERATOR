export const insertPseudo = [
  "function insert(head, position, value):",
  "  newNode = createNode(value)",
  "  if position == 0:",
  "    newNode.next = head",
  "    return newNode",
  "  current = head",
  "  for i = 0 to position-2:",
  "    current = current.next",
  "  newNode.next = current.next",
  "  current.next = newNode",
  "  return head"
]
