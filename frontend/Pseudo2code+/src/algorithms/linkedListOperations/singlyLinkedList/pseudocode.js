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
  "  head = newNode",
  "  return head"
]

export const insertTail = [
  "function insertTail(head, value):",
  "  if head == null:",
  "    return createNode(value)",
  "  current = head",
  "  while current.next != null:",
  "    current = current.next",
  "  current.next = createNode(value)",
  "  return head"
]

export const insertAtIndex = [
  "function insertAtIndex(head, index, value):",
  "  if index == 0:",
  "    return insertHead(head, value)",
  "  current = head",
  "  for i = 0 to index-2:",
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
  "  head = head.next",
  "  return head"
]

export const deleteTail = [
  "function deleteTail(head):",
  "  if head == null:",
  "    return null",
  "  if head.next == null:",
  "    return null",
  "  current = head",
  "  while current.next.next != null:",
  "    current = current.next",
  "  current.next = null",
  "  return head"
]

export const deleteAtIndex = [
  "function deleteAtIndex(head, index):",
  "  if head == null:",
  "    return null",
  "  if index == 0:",
  "    return head.next",
  "  current = head",
  "  for i = 0 to index-2:",
  "    current = current.next",
  "  current.next = current.next.next",
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
