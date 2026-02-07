export const dequeuePseudocode = [
  "function dequeue():",
  "  if isEmpty():",
  "    return null",
  "  temp ← front",
  "  value ← temp.data",
  "  front ← front.next",
  "  if isEmpty():",
  "    rear ← null",
  "  size ← size - 1",
  "  return value"
]
