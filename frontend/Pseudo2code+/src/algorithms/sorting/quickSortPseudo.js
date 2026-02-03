export const quickSortPseudo = [
  "quickSort(arr, low, high)",
  " if low < high",
  "   pivotIndex = partition(arr, low, high)",
  "   quickSort(arr, low, pivotIndex - 1)",
  "   quickSort(arr, pivotIndex + 1, high)",
  "end"
]
