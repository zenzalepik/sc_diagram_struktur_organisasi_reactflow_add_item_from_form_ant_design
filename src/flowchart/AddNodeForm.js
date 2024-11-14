// src/components/AddNodeForm.js
import React from "react";

const AddNodeForm = ({ newNodeData, setNewNodeData, handleAddNode, nodes }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "120px",
        padding: "10px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3>Add New Node</h3>
      <input
        type="text"
        placeholder="Name"
        value={newNodeData.name}
        onChange={(e) =>
          setNewNodeData({ ...newNodeData, name: e.target.value })
        }
        style={{ marginBottom: "8px", padding: "5px", width: "200px" }}
      />
      <br />
      <input
        type="text"
        placeholder="Position"
        value={newNodeData.position}
        onChange={(e) =>
          setNewNodeData({ ...newNodeData, position: e.target.value })
        }
        style={{ marginBottom: "8px", padding: "5px", width: "200px" }}
      />
      <br />
      <select
        value={newNodeData.connectedTo}
        onChange={(e) =>
          setNewNodeData({ ...newNodeData, connectedTo: e.target.value })
        }
        style={{ marginBottom: "8px", padding: "5px", width: "200px" }}
      >
        <option value="">Select Node to Connect</option>
        {nodes.map((node) => (
          <option key={node.id} value={node.id}>
            {node.data.name} ({node.data.position})
          </option>
        ))}
      </select>
      <br />
      <button
        onClick={handleAddNode}
        style={{
          padding: "5px 10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add Node
      </button>
    </div>
  );
};

export default AddNodeForm;
