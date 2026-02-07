import { generatePushSteps } from "./pushSteps"
import { generatePopSteps } from "./popSteps"
import { generatePeekSteps } from "./peekSteps"
import { generateIsEmptySteps } from "./isEmptySteps"
import { generateSizeSteps } from "./sizeSteps"

import { pushPseudo } from "./pseudocode/pushPseudo"
import { popPseudo } from "./pseudocode/popPseudo"
import { peekPseudo } from "./pseudocode/peekPseudo"
import { isEmptyPseudo } from "./pseudocode/isEmptyPseudo"
import { sizePseudo } from "./pseudocode/sizePseudo"

import { stackOperationsMeta } from "./stackOperationsMeta"

export const stackOperations = {
  push: {
    label: "Push",
    description: "Add element to top of stack",
    generator: (stack, params) => generatePushSteps(stack, params.value),
    pseudocode: pushPseudo,
    algorithmName: "Push",
    info: { name: "Push", ...stackOperationsMeta.push }
  },

  pop: {
    label: "Pop",
    description: "Remove element from top of stack",
    generator: (stack) => generatePopSteps(stack),
    pseudocode: popPseudo,
    algorithmName: "Pop",
    info: { name: "Pop", ...stackOperationsMeta.pop }
  },

  peek: {
    label: "Peek",
    description: "View top element without removing",
    generator: (stack) => generatePeekSteps(stack),
    pseudocode: peekPseudo,
    algorithmName: "Peek",
    info: { name: "Peek", ...stackOperationsMeta.peek }
  },

  isEmpty: {
    label: "Is Empty",
    description: "Check if stack is empty",
    generator: (stack) => generateIsEmptySteps(stack),
    pseudocode: isEmptyPseudo,
    algorithmName: "Is Empty",
    info: { name: "Is Empty", ...stackOperationsMeta.isEmpty }
  },

  size: {
    label: "Size",
    description: "Get number of elements in stack",
    generator: (stack) => generateSizeSteps(stack),
    pseudocode: sizePseudo,
    algorithmName: "Size",
    info: { name: "Size", ...stackOperationsMeta.size }
  }
}
