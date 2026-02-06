export const deleteAtIndexPseudo = [
  "removedValue = array[index]",
  "for i from index to n - 2",
  "  array[i] = array[i + 1]",
  "n = n - 1",
  "return removedValue"
]
