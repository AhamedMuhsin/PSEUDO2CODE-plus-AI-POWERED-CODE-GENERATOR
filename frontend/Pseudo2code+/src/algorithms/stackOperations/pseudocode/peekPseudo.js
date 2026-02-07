export const peekPseudo = [
  "procedure PEEK(stack)",
  "  if stack is empty",
  "    return error 'Stack Underflow'",
  "  end if",
  "  item = stack[top]",
  "  return item",
  "  // Note: does NOT modify the stack",
  "end procedure"
]
