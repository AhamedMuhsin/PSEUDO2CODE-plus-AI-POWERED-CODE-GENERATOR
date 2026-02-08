import { generateInsertSteps } from "./insertSteps"
import { generateDeleteSteps } from "./deleteSteps"
import { generateSearchSteps } from "./searchSteps"
import { generateTraverseSteps } from "./traverseSteps"

import { insertPseudo } from "./pseudocode/insertPseudo"
import { deletePseudo } from "./pseudocode/deletePseudo"
import { searchPseudo } from "./pseudocode/searchPseudo"
import { traversePseudo } from "./pseudocode/traversePseudo"

import { linkedListOperationsMeta } from "./linkedListOperationsMeta"

export const linkedListOperations = {
  insert: {
    label: "Insert",
    description: "Insert a node at a specific position",
    generator: (list, params) => generateInsertSteps(list, params.position, params.value),
    pseudocode: insertPseudo,
    algorithmName: "Insert Node",
    info: { name: "Insert", ...linkedListOperationsMeta.insert }
  },

  delete: {
    label: "Delete",
    description: "Remove a node at a specific position",
    generator: (list, params) => generateDeleteSteps(list, params.position),
    pseudocode: deletePseudo,
    algorithmName: "Delete Node",
    info: { name: "Delete", ...linkedListOperationsMeta.delete }
  },

  search: {
    label: "Search",
    description: "Find a value in the linked list",
    generator: (list, params) => generateSearchSteps(list, params.value),
    pseudocode: searchPseudo,
    algorithmName: "Search",
    info: { name: "Search", ...linkedListOperationsMeta.search }
  },

  traverse: {
    label: "Traverse",
    description: "Display all nodes in the linked list",
    generator: (list) => generateTraverseSteps(list),
    pseudocode: traversePseudo,
    algorithmName: "Traverse",
    info: { name: "Traverse", ...linkedListOperationsMeta.traverse }
  }
}
