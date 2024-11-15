//handleAddNode

export const handleAddNode = (newNodeData, setNodes, setEdges, setNewNodeData) => {
  const newNode = {
    id: (new Date()).getTime().toString(), // use timestamp as ID to ensure uniqueness
    data: {
      name: newNodeData.name,
      position: newNodeData.position,
    },
    position: { x: 0, y: 0 },
    type: "custom",
  };

  setNodes((nds) => [...nds, newNode]);

  if (newNodeData.connectedTo) {
    const newEdge = {
      id: `e${newNodeData.connectedTo}-${newNode.id}`,
      source: newNodeData.connectedTo,
      target: newNode.id,
    };
    setEdges((eds) => [...eds, newEdge]);
  }

  // Reset form data
  setNewNodeData({ name: "", position: "", connectedTo: "" });
};
