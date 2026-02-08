export const searchPseudo = [
  "function search(head, value):",
  "  current = head",
  "  position = 0",
  "  while current is not NULL:",
  "    if current.data == value:",
  "      return position",
  "    current = current.next",
  "    position = position + 1",
  "  return -1  // Not found"
]
