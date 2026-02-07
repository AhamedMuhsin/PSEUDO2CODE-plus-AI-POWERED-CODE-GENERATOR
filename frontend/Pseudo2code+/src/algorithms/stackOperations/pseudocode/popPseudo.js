export const popPseudo = [
  "procedure POP(stack)",
  "  if stack is empty",
  "    return error 'Stack Underflow'",
  "  end if",
  "  item = stack[top]",
  "  top = top - 1",
  "  return item",
  "end procedure"
]
