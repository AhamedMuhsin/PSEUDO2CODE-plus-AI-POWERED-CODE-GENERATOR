import { generateTraverseSteps } from "./traverseSteps"
import { generateLinearSearchSteps } from "./linearSearchSteps"
import { generateBinarySearchSteps } from "./binarySearchSteps"
import { generateInsertAtEndSteps } from "./insertAtEndSteps"
import { generateInsertAtIndexSteps } from "./insertAtIndexSteps"
import { generateDeleteAtEndSteps } from "./deleteAtEndSteps"
import { generateDeleteAtIndexSteps } from "./deleteAtIndexSteps"
import { generateUpdateAtIndexSteps } from "./updateAtIndexSteps"

export const arrayOperations = {
  traverse: {
    label: "Traverse Array",
    description: "Visit each element one by one",
    generator: (arr) => generateTraverseSteps(arr)
  },

  linearSearch: {
    label: "Linear Search",
    description: "Search element sequentially",
    generator: (arr, params) =>
      generateLinearSearchSteps(arr, params.target)
  },

  binarySearch: {
    label: "Binary Search",
    description: "Search in sorted array using divide and conquer",
    generator: (arr, params) =>
      generateBinarySearchSteps(
        [...arr].sort((a, b) => a - b),
        params.target
      )
  },

  insertEnd: {
    label: "Insert at End",
    description: "Insert a new element at the end",
    generator: (arr, params) =>
      generateInsertAtEndSteps(arr, params.value)
  },

  insertIndex: {
    label: "Insert at Index",
    description: "Insert element at a specific index",
    generator: (arr, params) =>
      generateInsertAtIndexSteps(arr, params.value, params.index)
  },

  deleteEnd: {
    label: "Delete at End",
    description: "Remove last element",
    generator: (arr) =>
      generateDeleteAtEndSteps(arr)
  },

  deleteIndex: {
    label: "Delete at Index",
    description: "Remove element at index",
    generator: (arr, params) =>
      generateDeleteAtIndexSteps(arr, params.index)
  },

  updateIndex: {
    label: "Update Value",
    description: "Update value at index",
    generator: (arr, params) =>
      generateUpdateAtIndexSteps(arr, params.index, params.value)
  }
}

