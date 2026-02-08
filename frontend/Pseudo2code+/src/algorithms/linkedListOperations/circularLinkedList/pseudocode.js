export const traverse = [
  "function traverse(head):",
  "  if head == null:",
  "    return",
  "  current = head",
  "  do:",
  "    print(current.value)",
  "    current = current.next",
  "  while current != head",
  "  print('(back to head)')"
]

export const insertHead = [
  "function insertHead(head, value):",
  "  newNode = createNode(value)",
  "  if head == null:",
  "    newNode.next = newNode  // self-loop",
  "    return newNode",
  "  newNode.next = head.next",
  "  head.next = newNode",
  "  return newNode  // swap data and return head"
]

export const insertTail = [
  "function insertTail(head, value):",
  "  newNode = createNode(value)",
  "  if head == null:",
  "    newNode.next = newNode",
  "    return newNode",
  "  newNode.next = head.next",
  "  head.next = newNode",
  "  return head"
]

export const insertAtIndex = [
  "function insertAtIndex(head, index, value):",
  "  if index == 0:",
  "    return insertHead(head, value)",
  "  current = head",
  "  for i = 1 to index-1:",
  "    current = current.next",
  "  newNode = createNode(value)",
  "  newNode.next = current.next",
  "  current.next = newNode",
  "  return head"
]

export const deleteHead = [
  "function deleteHead(head):",
  "  if head == null:",
  "    return null",
  "  if head.next == head:",
  "    return null  // only one node",
  "  head.next = head.next.next",
  "  return head  // or swap and delete"
]

export const deleteTail = [
  "function deleteTail(head):",
  "  if head == null:",
  "    return null",
  "  if head.next == head:",
  "    return null  // only one node",
  "  current = head",
  "  while current.next.next != head:",
  "    current = current.next",
  "  current.next = head",
  "  return head"
]

export const deleteAtIndex = [
  "function deleteAtIndex(head, index):",
  "  if head == null:",
  "    return null",
  "  if index == 0:",
  "    return deleteHead(head)",
  "  current = head",
  "  for i = 1 to index-1:",
  "    current = current.next",
  "  current.next = current.next.next",
  "  return head"
]

export const search = [
  "function search(head, value):",
  "  if head == null:",
  "    return -1",
  "  current = head",
  "  position = 0",
  "  do:",
  "    if current.value == value:",
  "      return position",
  "    current = current.next",
  "    position++",
  "  while current != head",
  "  return -1"
]
