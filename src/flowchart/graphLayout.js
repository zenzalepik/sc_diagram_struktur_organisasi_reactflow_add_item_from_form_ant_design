// graphLayout.js
import dagre from 'dagre';

// Function to layout nodes using dagre
export const layoutGraph = (nodes, edges) => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({});
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    g.setNode(node.id, { width: 150, height: 50 });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  // Run the layout algorithm
  dagre.layout(g);

  // Apply the layout to nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      },
    };
  });

  return layoutedNodes;
};

// Function to handle "Rapikan Diagram" button click
export const handleLayoutDiagram = (nodes, edges, setNodes) => {
  const newNodes = layoutGraph(nodes, edges);
  setNodes(newNodes);
};
