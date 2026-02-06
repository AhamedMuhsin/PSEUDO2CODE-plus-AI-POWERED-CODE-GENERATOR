import { generateTraverseSteps } from "./traverseSteps"
import { generateLinearSearchSteps } from "./linearSearchSteps"
import { generateBinarySearchSteps } from "./binarySearchSteps"
import { generateInsertAtEndSteps } from "./insertAtEndSteps"
import { generateInsertAtIndexSteps } from "./insertAtIndexSteps"
import { generateDeleteAtEndSteps } from "./deleteAtEndSteps"
import { generateDeleteAtIndexSteps } from "./deleteAtIndexSteps"
import { generateUpdateAtIndexSteps } from "./updateAtIndexSteps"

import { traversePseudo } from "./pseudocode/traversePseudo"
import { linearSearchPseudo } from "./pseudocode/linearSearchPseudo"
import { binarySearchPseudo } from "./pseudocode/binarySearchPseudo"
import { insertAtEndPseudo } from "./pseudocode/insertAtEndPseudo"
import { insertAtIndexPseudo } from "./pseudocode/insertAtIndexPseudo"
import { deleteAtEndPseudo } from "./pseudocode/deleteAtEndPseudo"
import { deleteAtIndexPseudo } from "./pseudocode/deleteAtIndexPseudo"
import { updateAtIndexPseudo } from "./pseudocode/updateAtIndexPseudo"

import { arrayOperationsMeta } from "./arrayOperationsMeta"

export const arrayOperations = {
  traverse: {
    label: "Traverse Array",
    description: "Visit each element one by one",
    generator: (arr) => generateTraverseSteps(arr),
    pseudocode: traversePseudo,
    algorithmName: "Traverse Array",
    info: { name: "Traverse Array", ...arrayOperationsMeta.traverse }
  },

  linearSearch: {
    label: "Linear Search",
    description: "Search element sequentially",
    generator: (arr, params) =>
      generateLinearSearchSteps(arr, params.target),
    pseudocode: linearSearchPseudo,
    algorithmName: "Linear Search",
    info: { name: "Linear Search", ...arrayOperationsMeta.linearSearch }
  },

  binarySearch: {
    label: "Binary Search",
    description: "Search in sorted array using divide and conquer",
    generator: (arr, params) =>
      generateBinarySearchSteps(
        [...arr].sort((a, b) => a - b),
        params.target
      ),
    pseudocode: binarySearchPseudo,
    algorithmName: "Binary Search",
    info: { name: "Binary Search", ...arrayOperationsMeta.binarySearch }
  },

  insertEnd: {
    label: "Insert at End",
    description: "Insert a new element at the end",
    generator: (arr, params) =>
      generateInsertAtEndSteps(arr, params.value),
    pseudocode: insertAtEndPseudo,
    algorithmName: "Insert at End",
    info: { name: "Insert at End", ...arrayOperationsMeta.insertEnd }
  },

  insertIndex: {
    label: "Insert at Index",
    description: "Insert element at a specific index",
    generator: (arr, params) =>
      generateInsertAtIndexSteps(arr, params.value, params.index),
    pseudocode: insertAtIndexPseudo,
    algorithmName: "Insert at Index",
    info: { name: "Insert at Index", ...arrayOperationsMeta.insertIndex }
  },

  deleteEnd: {
    label: "Delete at End",
    description: "Remove last element",
    generator: (arr) =>
      generateDeleteAtEndSteps(arr),
    pseudocode: deleteAtEndPseudo,
    algorithmName: "Delete at End",
    info: { name: "Delete at End", ...arrayOperationsMeta.deleteEnd }
  },

  deleteIndex: {
    label: "Delete at Index",
    description: "Remove element at index",
    generator: (arr, params) =>
      generateDeleteAtIndexSteps(arr, params.index),
    pseudocode: deleteAtIndexPseudo,
    algorithmName: "Delete at Index",
    info: { name: "Delete at Index", ...arrayOperationsMeta.deleteIndex }
  },

  updateIndex: {
    label: "Update Value",
    description: "Update value at index",
    generator: (arr, params) =>
      generateUpdateAtIndexSteps(arr, params.index, params.value),
    pseudocode: updateAtIndexPseudo,
    algorithmName: "Update Value",
    info: { name: "Update Value", ...arrayOperationsMeta.updateIndex }
  }
}

