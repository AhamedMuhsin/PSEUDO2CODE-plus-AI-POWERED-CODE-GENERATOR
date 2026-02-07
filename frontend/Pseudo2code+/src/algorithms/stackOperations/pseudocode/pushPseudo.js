export const pushPseudo = [
  "procedure PUSH(stack, value)",
  "  if stack is full",
  "    return error 'Stack Overflow'",
  "  end if",
  "  top = top + 1",
  "  stack[top] = value",
  "  return success",
  "end procedure"
]
