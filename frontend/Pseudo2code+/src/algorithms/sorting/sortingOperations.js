import { sortingMeta } from './sortingMeta'
import { generateBubbleSortSteps } from './bubbleSortSteps'
import { bubbleSortPseudo } from './bubbleSortPseudo'
import { generateSelectionSortSteps } from './selectionSortSteps'
import { selectionSortPseudo } from './selectionSortPseudo'
import { generateInsertionSortSteps } from './insertionSortSteps'
import { insertionSortPseudo } from './insertionSortPseudo'
import { generateMergeSortSteps } from './mergeSortSteps'
import { mergeSortPseudo } from './mergeSortPseudo'
import { generateQuickSortSteps } from './quickSortSteps'
import { quickSortPseudo } from './quickSortPseudo'
import { heapSortPseudo } from './heapSortPseudo'
import { generateHeapSortSteps } from './heapSortSteps'

// import others…

export const sortingOperations = {
  bubble: {
    ...sortingMeta['bubble-sort'],
    generateSteps: generateBubbleSortSteps,
    pseudocode: bubbleSortPseudo,
  },

  selection: {
    ...sortingMeta['selection-sort'],
    generateSteps: generateSelectionSortSteps,
    pseudocode: selectionSortPseudo,
  },

  insertion: {
    ...sortingMeta['insertion-sort'],
    generateSteps: generateInsertionSortSteps,
    pseudocode: insertionSortPseudo,
  },

  merge: {
    ...sortingMeta['merge-sort'],
    generateSteps: generateMergeSortSteps,
    pseudocode: mergeSortPseudo,
  },
  quick: {
    ...sortingMeta['quick-sort'],
    generateSteps: generateQuickSortSteps,
    pseudocode: quickSortPseudo,
  },
  heap: {
    ...sortingMeta['heap-sort'],
    generateSteps: generateHeapSortSteps,
    pseudocode: heapSortPseudo,
  },
}
