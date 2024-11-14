import React, { useEffect } from "react";

const UpdateNodeForm = ({
  selectedNode,
  setSelectedNode,
  updatedNodeData,
  setUpdatedNodeData,
  handleUpdateNode,
  updatedEdgeData,
  setUpdatedEdgeData,
  nodes,
  edges,
  handleUpdateEdge,
}) => {
  // Automatically set source and target when a node is selected
  useEffect(() => {
    if (selectedNode) {
      // Find the edge connected to the selected node (source or target)
      const connectedEdge = edges.find(
        (edge) =>
          edge.source === selectedNode.id || edge.target === selectedNode.id
      );

      if (connectedEdge) {
        // Set source and target based on the connected edge
        setUpdatedEdgeData({
          source: connectedEdge.source,
          target: connectedEdge.target,
        });
      } else {
        // Reset the edge fields if no edge is connected
        setUpdatedEdgeData({ source: "", target: "" });
      }
    }
  }, [selectedNode, edges, setUpdatedEdgeData]);

  // Handle node and edge update
  const handleUpdate = () => {
    handleUpdateNode();
    if (updatedEdgeData.source && updatedEdgeData.target) {
      handleUpdateEdge();
    }
  };

  useEffect(() => {
    if (selectedNode) {
      setUpdatedNodeData({
        name: selectedNode.data.name || "",
        position: selectedNode.data.position || "",
        connectedTo: "",
      });
    }
  }, [selectedNode]); // Hanya akan dijalankan saat selectedNode berubah
  
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "80px",
        padding: "10px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        width: "250px", // Form width
      }}
    >
      <h3>Update Node and Edge</h3>

      {/* Select Node */}
      <select
        value={selectedNode?.id || ""}
        onChange={(e) => {
          const nodeId = e.target.value;
          const node = nodes.find((n) => n.id === nodeId);
          setSelectedNode(node);
          setUpdatedNodeData({
            name: node?.data.name || "",
            position: node?.data.position || "",
            connectedTo: "",
          });
        }}
        style={{ marginBottom: "8px", padding: "5px", width: "100%" }}
      >
        <option value="">Select Node to Update</option>
        {nodes.map((node) => (
          <option key={node.id} value={node.id}>
            {node.data.name} ({node.data.position})
          </option>
        ))}
      </select>
      <br />
      <input
        type="text"
        placeholder="Name"
        value={updatedNodeData.name}
        onChange={(e) =>
          setUpdatedNodeData({ ...updatedNodeData, name: e.target.value })
        }
        style={{ marginBottom: "8px", padding: "5px", width: "100%" }}
      />
      <br />
      <input
        type="text"
        placeholder="Position"
        value={updatedNodeData.position}
        onChange={(e) =>
          setUpdatedNodeData({ ...updatedNodeData, position: e.target.value })
        }
        style={{ marginBottom: "8px", padding: "5px", width: "100%" }}
      />
      <br />

      {/* Edge Update */}
      <h4>Update Edge</h4>
      <select
        value={updatedEdgeData.target}
        onChange={(e) =>
          setUpdatedEdgeData({ ...updatedEdgeData, target: e.target.value })
        }
        style={{ marginBottom: "8px", padding: "5px", width: "100%" }}
      >
        <option value="">Select Target Node</option>
        {nodes.map((node) => (
          <option key={node.id} value={node.id}>
            {node.data.name} ({node.data.position})
          </option>
        ))}
      </select>
      <br />
      <select
        value={updatedEdgeData.source}
        onChange={(e) =>
          setUpdatedEdgeData({ ...updatedEdgeData, source: e.target.value })
        }
        style={{ marginBottom: "8px", padding: "5px", width: "100%" }}
      >
        <option value="">Select Source Node</option>
        {nodes.map((node) => (
          <option key={node.id} value={node.id}>
            {node.data.name} ({node.data.position})
          </option>
        ))}
      </select>
      <br />
      <button
        onClick={handleUpdate}
        style={{
          padding: "5px 10px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Update Node and Edge
      </button>
    </div>
  );
};

export default UpdateNodeForm;
