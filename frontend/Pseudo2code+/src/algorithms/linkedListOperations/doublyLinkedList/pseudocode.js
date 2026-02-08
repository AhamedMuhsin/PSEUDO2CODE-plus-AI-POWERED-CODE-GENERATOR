export const traverse = [
  "function traverse(head):",
  "  current = head",
  "  while current != null:",
  "    print(current.value)",
  "    current = current.next",
  "  print('NULL')"
]

export const insertHead = [
  "function insertHead(head, value):",
  "  newNode = createNode(value)",
  "  newNode.next = head",
  "  if head != null:",
  "    head.prev = newNode",
  "  head = newNode",
  "  return head"
]

export const insertTail = [
  "function insertTail(head, tail, value):",
  "  newNode = createNode(value)",
  "  if tail == null:",
  "    return newNode",
  "  newNode.prev = tail",
  "  tail.next = newNode",
  "  return newNode"
]

export const insertAtIndex = [
  "function insertAtIndex(head, index, value):",
  "  if index == 0:",
  "    return insertHead(head, value)",
  "  current = head",
  "  for i = 0 to index-1:",
  "    current = current.next",
  "  newNode = createNode(value)",
  "  newNode.next = current",
  "  newNode.prev = current.prev",
  "  current.prev.next = newNode",
  "  current.prev = newNode",
  "  return head"
]

export const deleteHead = [
  "function deleteHead(head):",
  "  if head == null:",
  "    return null",
  "  if head.next != null:",
  "    head.next.prev = null",
  "  head = head.next",
  "  return head"
]

export const deleteTail = [
  "function deleteTail(tail):",
  "  if tail == null:",
  "    return null",
  "  if tail.prev != null:",
  "    tail.prev.next = null",
  "  tail = tail.prev",
  "  return tail"
]

export const deleteAtIndex = [
  "function deleteAtIndex(head, index):",
  "  current = head",
  "  for i = 0 to index-1:",
  "    current = current.next",
  "  if current.prev != null:",
  "    current.prev.next = current.next",
  "  if current.next != null:",
  "    current.next.prev = current.prev",
  "  return head"
]

export const search = [
  "function search(head, value):",
  "  current = head",
  "  position = 0",
  "  while current != null:",
  "    if current.value == value:",
  "      return position",
  "    current = current.next",
  "    position++",
  "  return -1"
]
