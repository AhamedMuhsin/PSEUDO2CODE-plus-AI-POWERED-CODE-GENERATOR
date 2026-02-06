export const insertAtIndexPseudo = [
  "for i from n - 1 down to index",
  "  array[i + 1] = array[i]",
  "array[index] = newValue",
  "n = n + 1"
]
