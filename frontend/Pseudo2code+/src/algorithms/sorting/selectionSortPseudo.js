export const selectionSortPseudo = [
  "for i = 0 to n-2",
  " minIndex = i",
  " for j = i+1 to n-1",
  "     if arr[j] < arr[minIndex]",
  "         minIndex = j",
  " if minIndex != i",
  "     swap arr[i] and arr[minIndex]",
  "end"
]