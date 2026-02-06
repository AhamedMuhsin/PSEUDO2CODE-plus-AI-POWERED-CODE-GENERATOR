export const binarySearchPseudo = [
  "low = 0, high = n - 1",
  "while low <= high",
  "  mid = (low + high) / 2",
  "  if array[mid] == target",
  "    return mid",
  "  else if array[mid] < target",
  "    low = mid + 1",
  "  else",
  "    high = mid - 1",
  "return -1"
]
