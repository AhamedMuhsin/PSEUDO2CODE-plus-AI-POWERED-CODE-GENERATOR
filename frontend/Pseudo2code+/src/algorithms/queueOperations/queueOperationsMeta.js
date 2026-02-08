export const queueOperationsMeta = {
  enqueue: {
    name: "Enqueue",
    algorithmName: "Queue Enqueue",
    label: "Enqueue (Add to Back)",
    description:
      "Add an element to the back (rear) of the queue. FIFO - First In First Out.",
    explanation:
      "Enqueue inserts an element at the rear of the queue in constant time.",

    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(1)",

    stable: true,
    inPlace: true
  },

  dequeue: {
    name: "Dequeue",
    algorithmName: "Queue Dequeue",
    label: "Dequeue (Remove from Front)",
    description:
      "Remove and return the element from the front of the queue.",
    explanation:
      "Dequeue removes the front element by advancing the front pointer.",

    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(1)",

    stable: true,
    inPlace: true
  },

  peek: {
    name: "Peek",
    algorithmName: "Queue Peek",
    label: "Peek (View Front)",
    description:
      "View the front element without removing it from the queue.",
    explanation:
      "Peek returns the front element without modifying the queue state.",

    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(1)",

    stable: true,
    inPlace: true
  },

  isEmpty: {
    name: "Is Empty",
    algorithmName: "Queue Is Empty",
    label: "Is Empty",
    description:
      "Check whether the queue contains any elements.",
    explanation:
      "Checks if the queue size is zero and returns a boolean value.",

    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(1)",

    stable: true,
    inPlace: true
  },

  size: {
    name: "Size",
    algorithmName: "Queue Size",
    label: "Size",
    description:
      "Return the number of elements currently present in the queue.",
    explanation:
      "Returns the maintained size counter of the queue in constant time.",

    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(1)",

    stable: true,
    inPlace: true
  }
}
