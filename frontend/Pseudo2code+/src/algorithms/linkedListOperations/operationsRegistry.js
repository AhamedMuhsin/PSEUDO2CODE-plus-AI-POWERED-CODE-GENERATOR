import * as SinglyOps from "./singlyLinkedList/operations"
import * as SinglyPseudo from "./singlyLinkedList/pseudocode"

import * as DoublyOps from "./doublyLinkedList/operations"
import * as DoublyPseudo from "./doublyLinkedList/pseudocode"

import * as CircularOps from "./circularLinkedList/operations"
import * as CircularPseudo from "./circularLinkedList/pseudocode"

import { linkedListMeta } from "./linkedListMeta"

export const linkedListOperationsMap = {
  singly: {
    traverse: {
      label: "Traverse",
      ...linkedListMeta.singly.traverse,
      generator: SinglyOps.generateSinglyTraverse,
      pseudocode: SinglyPseudo.traverse,
      hasParams: false
    },

    insertHead: {
      label: "Insert at Head",
      ...linkedListMeta.singly.insertHead,
      generator: SinglyOps.generateSinglyInsertHead,
      pseudocode: SinglyPseudo.insertHead,
      hasParams: true,
      paramType: "value"
    },

    insertTail: {
      label: "Insert at Tail",
      ...linkedListMeta.singly.insertTail,
      generator: SinglyOps.generateSinglyInsertTail,
      pseudocode: SinglyPseudo.insertTail,
      hasParams: true,
      paramType: "value"
    },

    insertAtIndex: {
      label: "Insert at Index",
      ...linkedListMeta.singly.insertAtIndex,
      generator: SinglyOps.generateSinglyInsertAtIndex,
      pseudocode: SinglyPseudo.insertAtIndex,
      hasParams: true,
      paramType: "position-value"
    },

    deleteHead: {
      label: "Delete at Head",
      ...linkedListMeta.singly.deleteHead,
      generator: SinglyOps.generateSinglyDeleteHead,
      pseudocode: SinglyPseudo.deleteHead,
      hasParams: false
    },

    deleteTail: {
      label: "Delete at Tail",
      ...linkedListMeta.singly.deleteTail,
      generator: SinglyOps.generateSinglyDeleteTail,
      pseudocode: SinglyPseudo.deleteTail,
      hasParams: false
    },

    deleteAtIndex: {
      label: "Delete at Index",
      ...linkedListMeta.singly.deleteAtIndex,
      generator: SinglyOps.generateSinglyDeleteAtIndex,
      pseudocode: SinglyPseudo.deleteAtIndex,
      hasParams: true,
      paramType: "position"
    },

    search: {
      label: "Search",
      ...linkedListMeta.singly.search,
      generator: SinglyOps.generateSinglySearch,
      pseudocode: SinglyPseudo.search,
      hasParams: true,
      paramType: "value"
    }
  },

  doubly: {
    traverse: {
      label: "Traverse",
      ...linkedListMeta.doubly.traverse,
      generator: DoublyOps.generateDoublyTraverse,
      pseudocode: DoublyPseudo.traverse,
      hasParams: false
    },

    insertHead: {
      label: "Insert at Head",
      ...linkedListMeta.doubly.insertHead,
      generator: DoublyOps.generateDoublyInsertHead,
      pseudocode: DoublyPseudo.insertHead,
      hasParams: true,
      paramType: "value"
    },

    insertTail: {
      label: "Insert at Tail",
      ...linkedListMeta.doubly.insertTail,
      generator: DoublyOps.generateDoublyInsertTail,
      pseudocode: DoublyPseudo.insertTail,
      hasParams: true,
      paramType: "value"
    },

    insertAtIndex: {
      label: "Insert at Index",
      ...linkedListMeta.doubly.insertAtIndex,
      generator: DoublyOps.generateDoublyInsertAtIndex,
      pseudocode: DoublyPseudo.insertAtIndex,
      hasParams: true,
      paramType: "position-value"
    },

    deleteHead: {
      label: "Delete at Head",
      ...linkedListMeta.doubly.deleteHead,
      generator: DoublyOps.generateDoublyDeleteHead,
      pseudocode: DoublyPseudo.deleteHead,
      hasParams: false
    },

    deleteTail: {
      label: "Delete at Tail",
      ...linkedListMeta.doubly.deleteTail,
      generator: DoublyOps.generateDoublyDeleteTail,
      pseudocode: DoublyPseudo.deleteTail,
      hasParams: false
    },

    deleteAtIndex: {
      label: "Delete at Index",
      ...linkedListMeta.doubly.deleteAtIndex,
      generator: DoublyOps.generateDoublyDeleteAtIndex,
      pseudocode: DoublyPseudo.deleteAtIndex,
      hasParams: true,
      paramType: "position"
    },

    search: {
      label: "Search",
      ...linkedListMeta.doubly.search,
      generator: DoublyOps.generateDoublySearch,
      pseudocode: DoublyPseudo.search,
      hasParams: true,
      paramType: "value"
    }
  },

  circular: {
    traverse: {
      label: "Traverse",
      ...linkedListMeta.circular.traverse,
      generator: CircularOps.generateCircularTraverse,
      pseudocode: CircularPseudo.traverse,
      hasParams: false
    },

    insertHead: {
      label: "Insert at Head",
      ...linkedListMeta.circular.insertHead,
      generator: CircularOps.generateCircularInsertHead,
      pseudocode: CircularPseudo.insertHead,
      hasParams: true,
      paramType: "value"
    },

    insertTail: {
      label: "Insert at Tail",
      ...linkedListMeta.circular.insertTail,
      generator: CircularOps.generateCircularInsertTail,
      pseudocode: CircularPseudo.insertTail,
      hasParams: true,
      paramType: "value"
    },

    insertAtIndex: {
      label: "Insert at Index",
      ...linkedListMeta.circular.insertAtIndex,
      generator: CircularOps.generateCircularInsertAtIndex,
      pseudocode: CircularPseudo.insertAtIndex,
      hasParams: true,
      paramType: "position-value"
    },

    deleteHead: {
      label: "Delete at Head",
      ...linkedListMeta.circular.deleteHead,
      generator: CircularOps.generateCircularDeleteHead,
      pseudocode: CircularPseudo.deleteHead,
      hasParams: false
    },

    deleteTail: {
      label: "Delete at Tail",
      ...linkedListMeta.circular.deleteTail,
      generator: CircularOps.generateCircularDeleteTail,
      pseudocode: CircularPseudo.deleteTail,
      hasParams: false
    },

    deleteAtIndex: {
      label: "Delete at Index",
      ...linkedListMeta.circular.deleteAtIndex,
      generator: CircularOps.generateCircularDeleteAtIndex,
      pseudocode: CircularPseudo.deleteAtIndex,
      hasParams: true,
      paramType: "position"
    },

    search: {
      label: "Search",
      ...linkedListMeta.circular.search,
      generator: CircularOps.generateCircularSearch,
      pseudocode: CircularPseudo.search,
      hasParams: true,
      paramType: "value"
    }
  }
}

export const LINKED_LIST_TYPES = [
  { key: "singly", label: "Singly Linked List", icon: "→" },
  { key: "doubly", label: "Doubly Linked List", icon: "↔" },
  { key: "circular", label: "Circular Linked List", icon: "⭕" }
]