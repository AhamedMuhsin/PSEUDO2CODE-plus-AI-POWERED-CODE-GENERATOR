# Binary Tree Operations - Quick Reference Guide

## 📍 Access Point
**Route**: `/binary-tree-operations`  
**Navigation**: Algorithm Hub → Data Structures → Binary Tree

---

## 🎯 10 Operations Overview

### **GROUP 1: BASIC OPERATIONS**

#### 1️⃣ **INSERT NODE**
- **What**: Add a new node to the tree
- **Method**: Level-order (left-to-right)
- **Input**: Value to insert
- **Time**: O(n)
- **Example**: Insert 25 into tree [10, 20, 30]
  ```
  Result:        10
               /    \
             20      30
            /
           25
  ```

---

#### 2️⃣ **SEARCH NODE**
- **What**: Find a node by value
- **Method**: Breadth-first search (BFS)
- **Input**: Value to search for
- **Time**: O(n)
- **Output**: Path highlighted from root to target
- **Example**: Search for 20 in [10, 20, 30, 15, 25]
  ```
  Path: 10 → 20 ✓ FOUND
  ```

---

#### 3️⃣ **DELETE NODE**
- **What**: Remove a node from tree
- **Method**: Replace with deepest-rightmost node
- **Input**: Value to delete
- **Time**: O(n)
- **Steps**:
  1. Find node to delete
  2. Find deepest-rightmost node
  3. Copy its value to deleted node
  4. Remove deepest-rightmost node

---

### **GROUP 2: TRAVERSALS**

#### 4️⃣ **INORDER (LNR)**
- **Order**: Left → Node → Right
- **Time**: O(n)
- **Use Case**: Get sorted sequence in BST
- **Example Tree**:
  ```
        2
       / \
      1   3
  ```
  **Result**: [1, 2, 3] ✓ Sorted

---

#### 5️⃣ **PREORDER (NLR)**
- **Order**: Node → Left → Right
- **Time**: O(n)
- **Use Case**: Create copy of tree
- **Example Same Tree**:
  **Result**: [2, 1, 3]

---

#### 6️⃣ **POSTORDER (LRN)**
- **Order**: Left → Right → Node
- **Time**: O(n)
- **Use Case**: Delete tree, evaluate expressions
- **Example Same Tree**:
  **Result**: [1, 3, 2]

---

#### 7️⃣ **LEVEL ORDER (BFS)**
- **Order**: Level by level, left to right
- **Time**: O(n)
- **Use Case**: Breadth-first exploration
- **Example Same Tree**:
  ```
  Level 0: [2]
  Level 1: [1, 3]
  All: [2, 1, 3]
  ```

---

### **GROUP 3: UTILITIES**

#### 8️⃣ **HEIGHT OF TREE**
- **What**: Calculate tree depth
- **Formula**: 1 + max(height(left), height(right))
- **Time**: O(n)
- **Output**: Single integer (height)
- **Example**:
  ```
  Tree:      1         Height = 2
            / \
           2   3
          /
         4
  ```

---

#### 9️⃣ **COUNT ALL NODES**
- **What**: Total nodes in tree
- **Method**: DFS traversal count
- **Time**: O(n)
- **Output**: Single integer (count)
- **Example**:
  ```
  Tree with nodes:  1, 2, 3, 4, 5, 6, 7
  Count = 7
  ```

---

#### 1️⃣0️⃣ **COUNT LEAF NODES**
- **What**: Count nodes with no children
- **Definition**: Node where left==null AND right==null
- **Time**: O(n)
- **Output**: Single integer (leaf count)
- **Example**:
  ```
        1           Leaves: 4, 5, 6
       / \          Count = 3
      2   3
     / \ / \
    4  5 6  7  (7 has no children shown)
       Leaf ✓  Leaf ✓ Leaf ✓
  ```

---

## 🎮 Using the Visualizer

### **STEP 1: Choose Input Method**
```
Option A: Click "🎲 Random Tree"
         → Generates 5-11 random nodes (1-100)
         → Auto-executes on insert operation

Option B: Manual Entry
         → Type: "10,20,30,40,50"
         → Click "✓ Apply"
         → Creates custom tree
```

### **STEP 2: Select Operation**
```
Dropdown shows:
├─ Basic
│  ├─ Insert Node
│  ├─ Search Node
│  └─ Delete Node
├─ Traversals
│  ├─ Inorder (LNR)
│  ├─ Preorder (NLR)
│  ├─ Postorder (LRN)
│  └─ Level Order (BFS)
└─ Utilities
   ├─ Height of Tree
   ├─ Count Nodes
   └─ Count Leaf Nodes
```

### **STEP 3: Enter Parameters (if needed)**
```
Operation          | Parameter
─────────────────────────────
Insert Node        | Value (e.g., 25)
Search Node        | Value (e.g., 30)
Delete Node        | Value (e.g., 20)
All Traversals     | None
All Utilities      | None
```

### **STEP 4: Execute & Control**
```
Controls:
⬅️ Prev          → Previous step
▶️ Play          → Auto-play (1s each)
⏸️ Pause         → Stop auto-play
➡️ Next          → Next step
🔄 Reset         → Start over
```

### **STEP 5: Observe & Learn**
```
Canvas shows:
- Tree visualization (hierarchical layout)
- Node colors (active/visited/target)
- Edge highlights during traversal
- Traversal order sequence bar

Pseudocode shows:
- Algorithm steps (highlighted current line)
- Complexity analysis (Best/Avg/Worst, Space)

Explanation shows:
- What happened in this step
- Why it matters
- Current state
- Result accumulation
```

---

## 🎨 Visual Indicators

### **Node Colors**
| Color | Meaning | Visible During |
|-------|---------|---|
| Gray | Normal node | All operations |
| Purple glow | Active node | Current processing |
| Cyan | Visited | After visiting |
| Red | Target | Search/Delete operations |
| Green label | Leaf indicator | Count Leaf Nodes |

### **Edge Colors**
| Color | Meaning |
|-------|---------|
| Gray | Normal edge |
| Purple | Active edge (traversing) |
| Cyan | Visited edge |

---

## 📊 Complexity at a Glance

```
Operation          | Best  | Average | Worst | Space
─────────────────────────────────────────────────
Insert             | O(n)  | O(n)    | O(n)  | O(n)
Search             | O(1)  | O(n)    | O(n)  | O(n)
Delete             | O(n)  | O(n)    | O(n)  | O(n)
Inorder            | O(n)  | O(n)    | O(n)  | O(h)
Preorder           | O(n)  | O(n)    | O(n)  | O(h)
Postorder          | O(n)  | O(n)    | O(n)  | O(h)
Level Order        | O(n)  | O(n)    | O(n)  | O(w)
Height             | O(n)  | O(n)    | O(n)  | O(h)
Count Nodes        | O(n)  | O(n)    | O(n)  | O(h)
Count Leaves       | O(n)  | O(n)    | O(n)  | O(h)

Where: h = height, w = max width at any level
```

---

## 💡 Tips for Learning

### **Understanding Traversals**
Try this sequence:
1. Generate tree: `1,2,3,4,5,6,7`
2. Run Inorder → See result
3. Run Preorder → Compare
4. Run Postorder → Compare
5. Run Level Order → Compare
6. Notice the differences!

### **Understanding Trees**
1. Start with small tree (3-5 nodes)
2. Insert more nodes one by one
3. Observe how tree grows
4. Try different operations
5. Track complexity changes

### **Insertion Strategy**
1. Insert nodes: `10, 5, 15, 2, 7, 12, 20`
2. Observe level-order insertion
3. Tree builds left-to-right, level-by-level
4. This is complete but not balanced

### **Searching Practice**
1. Insert: `10, 5, 15, 2, 7, 12`
2. Search for existing nodes
3. Search for non-existing nodes
4. Note the difference in highlighted paths

---

## 🔄 Common Workflows

### **Workflow: Learn in 5 Minutes**
```
1. Click "🎲 Random Tree" (generates tree)
2. Select "Insert Node"
3. Enter 25, watch insertion
4. Select "Inorder Traversal"
5. Play through step-by-step
6. Read explanations and pseudocode
```

### **Workflow: Compare Traversals**
```
1. Create custom tree: "10,20,30"
2. Run Inorder → Note result
3. Reset
4. Run Preorder → Note different result
5. Reset
6. Run Postorder → Compare all three
```

### **Workflow: Understand Deletion**
```
1. Insert: "10,20,30,40,50"
2. Select Delete
3. Delete 20
4. Watch how tree restructures
5. See deepest-rightmost node replacement
6. Understand how tree stays valid
```

### **Workflow: Analyze Properties**
```
1. Create tree: "1,2,3,4,5,6,7"
2. Run "Height of Tree" → See depth=2
3. Run "Count Nodes" → See 7 nodes
4. Run "Count Leaf Nodes" → See 3 leaves
5. Understand tree structure metrics
```

---

## ❓ FAQ

**Q: What's the difference between Inorder and Preorder?**
A: Inorder is LNR (gives sorted in BST), Preorder is NLR (good for copying).

**Q: Why use Level Order over DFS?**
A: Level-order explores breadth-first (closest nodes first), useful for level-based operations.

**Q: How does deletion work?**
A: Replaces target with deepest-rightmost to maintain structure without rebalancing.

**Q: Can I balance trees?**
A: Current version shows Binary Trees (not balanced). AVL/BST coming in Phase 2!

**Q: How is height calculated?**
A: Recursively: 1 + max(height(left), height(right)). Null nodes have height -1.

---

## 🚀 Next: After Learning Binary Trees

✅ Understand this visualizer completely  
➜ Try BST (Binary Search Tree) - coming soon  
➜ Learn AVL Tree balancing  
➜ Explore Heaps  
➜ Master Graph algorithms  

---

**Happy Learning! 🌳**
