export const deletePseudo = [
  "function delete(head, position):",
  "  if head is NULL:",
  "    return NULL",
  "  if position == 0:",
  "    head = head.next",
  "    return head",
  "  current = head",
  "  for i = 0 to position-2:",
  "    if current.next is NULL:",
  "      return head",
  "    current = current.next",
  "  current.next = current.next.next",
  "  return head"
]
