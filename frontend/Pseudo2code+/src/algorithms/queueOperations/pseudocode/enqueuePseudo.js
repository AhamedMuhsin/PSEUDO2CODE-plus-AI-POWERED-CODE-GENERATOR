export const enqueuePseudocode = [
  "function enqueue(value):",
  "  if queue is full:",
  "    return error",
  "  new_node ← create Node(value)",
  "  if isEmpty():",
  "    front ← new_node",
  "  else:",
  "    rear.next ← new_node",
  "  rear ← new_node",
  "  size ← size + 1"
]
