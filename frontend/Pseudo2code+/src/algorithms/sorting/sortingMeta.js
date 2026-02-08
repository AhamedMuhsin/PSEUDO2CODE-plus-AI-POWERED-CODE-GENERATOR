export const sortingMeta = {
  "bubble-sort": {
    key: "bubble-sort",
    name: "Bubble Sort",
    algorithmName: "Bubble Sort",
    label: "Bubble Sort",
    description:
      "Repeatedly compares adjacent elements and swaps them if they are in the wrong order.",
    explanation:
      "Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Larger elements gradually bubble up to the end.",

    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",

    stable: true,
    inPlace: true
  },

  "selection-sort": {
    key: "selection-sort",
    name: "Selection Sort",
    algorithmName: "Selection Sort",
    label: "Selection Sort",
    description:
      "Finds the minimum element from the unsorted part and places it at the beginning.",
    explanation:
      "Selection Sort repeatedly selects the minimum element from the unsorted portion and swaps it with the first unsorted element.",

    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",

    stable: false,
    inPlace: true
  },

  "insertion-sort": {
    key: "insertion-sort",
    name: "Insertion Sort",
    algorithmName: "Insertion Sort",
    label: "Insertion Sort",
    description:
      "Builds the sorted array one element at a time.",
    explanation:
      "Insertion Sort inserts each element into its correct position in the already sorted part of the array.",

    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",

    stable: true,
    inPlace: true
  },

  "merge-sort": {
    key: "merge-sort",
    name: "Merge Sort",
    algorithmName: "Merge Sort",
    label: "Merge Sort",
    description:
      "Divide-and-conquer algorithm that splits the array and merges sorted halves.",
    explanation:
      "Merge Sort recursively divides the array into halves, sorts them, and merges them back together.",

    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",

    stable: true,
    inPlace: false
  },

  "quick-sort": {
    key: "quick-sort",
    name: "Quick Sort",
    algorithmName: "Quick Sort",
    label: "Quick Sort",
    description:
      "Partition-based sorting using a pivot element.",
    explanation:
      "Quick Sort selects a pivot and partitions the array into smaller and larger elements, then recursively sorts them.",

    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",

    stable: false,
    inPlace: true
  },

  "heap-sort": {
    key: "heap-sort",
    name: "Heap Sort",
    algorithmName: "Heap Sort",
    label: "Heap Sort",
    description:
      "Uses a binary heap to sort elements.",
    explanation:
      "Heap Sort builds a max heap and repeatedly extracts the largest element to form a sorted array.",

    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(1)",

    stable: false,
    inPlace: true
  }
}
