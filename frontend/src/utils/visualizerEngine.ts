// DSA visualizer steps generator engine

export interface SortingStep {
  array: number[];
  highlights: number[]; // indices to highlight
  pointers: { [key: string]: number }; // pointer names to values
  explanation: string;
  codeLine: number; // line index of code to highlight
}

export interface ListStep {
  nodes: { id: string; val: number; next: string | null }[];
  highlights: string[]; // node IDs to highlight
  pointers: { [key: string]: string | null }; // pointer labels to node IDs
  explanation: string;
  codeLine: number;
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  dist?: number;
  visited?: boolean;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  highlighted?: boolean;
}

export interface GraphStep {
  nodes: GraphNode[];
  edges: GraphEdge[];
  highlights: string[]; // active node IDs
  queue: string[]; // Queue / Stack status
  explanation: string;
  codeLine: number;
}

// ==========================================
// 1. SORTING ALGORITHMS
// ==========================================

export const generateBubbleSortSteps = (arr: number[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const a = [...arr];
  const n = a.length;

  steps.push({
    array: [...a],
    highlights: [],
    pointers: {},
    explanation: 'Start Bubble Sort. We will scan the array and swap adjacent out-of-order elements.',
    codeLine: 0
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...a],
        highlights: [j, j + 1],
        pointers: { i, j },
        explanation: `Compare elements at index ${j} (${a[j]}) and index ${j + 1} (${a[j + 1]}).`,
        codeLine: 2
      });

      if (a[j] > a[j + 1]) {
        const temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;

        steps.push({
          array: [...a],
          highlights: [j, j + 1],
          pointers: { i, j },
          explanation: `Since ${a[j + 1]} > ${a[j]}, swap them.`,
          codeLine: 3
        });
      }
    }
  }
  steps.push({
    array: [...a],
    highlights: [],
    pointers: {},
    explanation: 'Array is fully sorted!',
    codeLine: 6
  });
  return steps;
};

export const generateQuickSortSteps = (arr: number[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const a = [...arr];

  const quickSort = (low: number, high: number) => {
    if (low < high) {
      const pIdx = partition(low, high);
      quickSort(low, pIdx - 1);
      quickSort(pIdx + 1, high);
    }
  };

  const partition = (low: number, high: number): number => {
    const pivot = a[high];
    steps.push({
      array: [...a],
      highlights: [high],
      pointers: { pivot: high, low, high },
      explanation: `Choose pivot element from the end: ${pivot}. Partition range [${low}, ${high}].`,
      codeLine: 1
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({
        array: [...a],
        highlights: [j, high],
        pointers: { pivot: high, i: Math.max(low, i), j },
        explanation: `Compare element at index ${j} (${a[j]}) with pivot (${pivot}).`,
        codeLine: 2
      });

      if (a[j] < pivot) {
        i++;
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
        steps.push({
          array: [...a],
          highlights: [i, j],
          pointers: { pivot: high, i, j },
          explanation: `${a[i]} < pivot (${pivot}), swap with element at index ${i}.`,
          codeLine: 3
        });
      }
    }

    const temp = a[i + 1];
    a[i + 1] = a[high];
    a[high] = temp;
    steps.push({
      array: [...a],
      highlights: [i + 1, high],
      pointers: { pivot: i + 1 },
      explanation: `Swap pivot element into its final sorted position at index ${i + 1}.`,
      codeLine: 4
    });

    return i + 1;
  };

  quickSort(0, a.length - 1);
  steps.push({
    array: [...a],
    highlights: [],
    pointers: {},
    explanation: 'Quick Sort completed successfully!',
    codeLine: 5
  });
  return steps;
};

// ==========================================
// 2. SEARCHING ALGORITHMS
// ==========================================

export const generateLinearSearchSteps = (arr: number[], target: number): SortingStep[] => {
  const steps: SortingStep[] = [];
  const a = [...arr];

  steps.push({
    array: [...a],
    highlights: [],
    pointers: {},
    explanation: `Starting Linear Search for target value: ${target}.`,
    codeLine: 0
  });

  for (let i = 0; i < a.length; i++) {
    steps.push({
      array: [...a],
      highlights: [i],
      pointers: { i },
      explanation: `Checking index ${i}: compare value ${a[i]} with target ${target}.`,
      codeLine: 2
    });

    if (a[i] === target) {
      steps.push({
        array: [...a],
        highlights: [i],
        pointers: { i },
        explanation: `Target ${target} found at index ${i}!`,
        codeLine: 3
      });
      return steps;
    }
  }

  steps.push({
    array: [...a],
    highlights: [],
    pointers: {},
    explanation: `Target ${target} not found in the array.`,
    codeLine: 5
  });
  return steps;
};

export const generateBinarySearchSteps = (arr: number[], target: number): SortingStep[] => {
  const steps: SortingStep[] = [];
  const a = [...arr].sort((x, y) => x - y); // Must be sorted

  steps.push({
    array: [...a],
    highlights: [],
    pointers: {},
    explanation: `Start Binary Search for target: ${target}. Array has been pre-sorted.`,
    codeLine: 0
  });

  let low = 0;
  let high = a.length - 1;

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    steps.push({
      array: [...a],
      highlights: [mid],
      pointers: { low, high, mid },
      explanation: `Check midpoint index ${mid} (${a[mid]}). Current range low: ${low}, high: ${high}.`,
      codeLine: 2
    });

    if (a[mid] === target) {
      steps.push({
        array: [...a],
        highlights: [mid],
        pointers: { mid },
        explanation: `Found target ${target} at index ${mid}!`,
        codeLine: 3
      });
      return steps;
    }

    if (a[mid] < target) {
      low = mid + 1;
      steps.push({
        array: [...a],
        highlights: [],
        pointers: { low, high },
        explanation: `${a[mid]} < target ${target}. Narrow search to right half [${low}, ${high}].`,
        codeLine: 4
      });
    } else {
      high = mid - 1;
      steps.push({
        array: [...a],
        highlights: [],
        pointers: { low, high },
        explanation: `${a[mid]} > target ${target}. Narrow search to left half [${low}, ${high}].`,
        codeLine: 5
      });
    }
  }

  steps.push({
    array: [...a],
    highlights: [],
    pointers: {},
    explanation: `Target ${target} not found in the sorted array.`,
    codeLine: 6
  });
  return steps;
};

// ==========================================
// 3. LINKED LIST ALGORITHMS
// ==========================================

export const generateSinglyListSteps = (
  nodesInit: { id: string; val: number }[],
  action: 'insert' | 'delete' | 'search',
  param: number
): ListStep[] => {
  const steps: ListStep[] = [];
  
  const currentNodes = nodesInit.map((n, idx) => ({
    id: n.id,
    val: n.val,
    next: idx < nodesInit.length - 1 ? nodesInit[idx + 1].id : null
  }));

  if (action === 'search') {
    steps.push({
      nodes: JSON.parse(JSON.stringify(currentNodes)),
      highlights: [],
      pointers: { curr: currentNodes[0]?.id || null },
      explanation: `Starting search for value ${param}. Initialize head pointer.`,
      codeLine: 0
    });

    let curr = currentNodes[0];
    while (curr) {
      steps.push({
        nodes: JSON.parse(JSON.stringify(currentNodes)),
        highlights: [curr.id],
        pointers: { curr: curr.id },
        explanation: `Checking node value: ${curr.val}. Compare with target ${param}.`,
        codeLine: 2
      });

      if (curr.val === param) {
        steps.push({
          nodes: JSON.parse(JSON.stringify(currentNodes)),
          highlights: [curr.id],
          pointers: { curr: curr.id },
          explanation: `Value ${param} found in list!`,
          codeLine: 3
        });
        return steps;
      }
      curr = currentNodes.find(n => n.id === curr.next) as any;
    }
  }

  return steps;
};

// ==========================================
// 4. GRAPH ALGORITHMS
// ==========================================

export const generateDijkstraSteps = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  startId: string
): GraphStep[] => {
  const steps: GraphStep[] = [];
  const gNodes = nodes.map(n => ({ ...n, dist: Infinity, visited: false }));
  const startNode = gNodes.find(n => n.id === startId);
  if (startNode) startNode.dist = 0;

  steps.push({
    nodes: JSON.parse(JSON.stringify(gNodes)),
    edges: edges.map(e => ({ ...e, highlighted: false })),
    highlights: [],
    queue: [startId],
    explanation: `Dijkstra initialized. Set start node ${startId} distance to 0, all other nodes to Infinity.`,
    codeLine: 0
  });

  const pq = [startId];

  while (pq.length > 0) {
    pq.sort((a, b) => {
      const da = gNodes.find(n => n.id === a)?.dist || Infinity;
      const db = gNodes.find(n => n.id === b)?.dist || Infinity;
      return da - db;
    });

    const currId = pq.shift()!;
    const currNode = gNodes.find(n => n.id === currId)!;
    currNode.visited = true;

    steps.push({
      nodes: JSON.parse(JSON.stringify(gNodes)),
      edges: edges.map(e => ({ ...e, highlighted: false })),
      highlights: [currId],
      queue: [...pq],
      explanation: `Visit node ${currNode.label} with current shortest distance ${currNode.dist}.`,
      codeLine: 2
    });

    const outgoingEdges = edges.filter(e => e.from === currId || e.to === currId);
    for (const edge of outgoingEdges) {
      const neighborId = edge.from === currId ? edge.to : edge.from;
      const neighborNode = gNodes.find(n => n.id === neighborId)!;

      if (neighborNode.visited) continue;

      const altDist = currNode.dist! + (edge.weight || 1);
      
      steps.push({
        nodes: JSON.parse(JSON.stringify(gNodes)),
        edges: edges.map(e => ({
          ...e,
          highlighted: (e.from === currId && e.to === neighborId) || (e.from === neighborId && e.to === currId)
        })),
        highlights: [currId, neighborId],
        queue: [...pq],
        explanation: `Relaxing edge. Current neighbor distance is ${neighborNode.dist}. Alternate path distance via ${currNode.label} is ${altDist}.`,
        codeLine: 3
      });

      if (altDist < neighborNode.dist!) {
        neighborNode.dist = altDist;
        if (!pq.includes(neighborId)) {
          pq.push(neighborId);
        }
      }
    }
  }

  steps.push({
    nodes: JSON.parse(JSON.stringify(gNodes)),
    edges: edges.map(e => ({ ...e, highlighted: false })),
    highlights: [],
    queue: [],
    explanation: `Dijkstra completed. Shortest paths computed from starting node ${startId}.`,
    codeLine: 5
  });

  return steps;
};
