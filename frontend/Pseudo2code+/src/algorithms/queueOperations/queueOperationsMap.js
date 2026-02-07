import { enqueueSteps } from "./enqueueSteps"
import { dequeueSteps } from "./dequeueSteps"
import { peekSteps } from "./peekSteps"
import { isEmptySteps } from "./isEmptySteps"
import { sizeSteps } from "./sizeSteps"
import { enqueuePseudocode } from "./pseudocode/enqueuePseudo"
import { dequeuePseudocode } from "./pseudocode/dequeuePseudo"
import { peekPseudocode } from "./pseudocode/peekPseudo"
import { isEmptyPseudocode } from "./pseudocode/isEmptyPseudo"
import { sizePseudocode } from "./pseudocode/sizePseudo"
import { queueOperationsMeta } from "./queueOperationsMeta"

export const queueOperations = {
  enqueue: {
    key: "enqueue",
    label: "Enqueue",
    description: "Add element to back of queue",
    generateSteps: enqueueSteps,
    pseudocode: enqueuePseudocode,
    ...queueOperationsMeta.enqueue
  },
  dequeue: {
    key: "dequeue",
    label: "Dequeue",
    description: "Remove element from front of queue",
    generateSteps: dequeueSteps,
    pseudocode: dequeuePseudocode,
    ...queueOperationsMeta.dequeue
  },
  peek: {
    key: "peek",
    label: "Peek",
    description: "View front element without removing",
    generateSteps: peekSteps,
    pseudocode: peekPseudocode,
    ...queueOperationsMeta.peek
  },
  isEmpty: {
    key: "isEmpty",
    label: "Is Empty",
    description: "Check if queue is empty",
    generateSteps: isEmptySteps,
    pseudocode: isEmptyPseudocode,
    ...queueOperationsMeta.isEmpty
  },
  size: {
    key: "size",
    label: "Size",
    description: "Get queue size",
    generateSteps: sizeSteps,
    pseudocode: sizePseudocode,
    ...queueOperationsMeta.size
  }
}
