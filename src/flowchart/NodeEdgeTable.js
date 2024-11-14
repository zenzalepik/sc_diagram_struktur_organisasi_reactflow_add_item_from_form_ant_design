import React from "react";

const NodeEdgeTable = ({ nodes, edges, setNodes, setEdges, setSelectedNode, setIsUpdateFormVisible }) => {
  // Fungsi untuk menghapus node beserta edges yang terhubung
  const handleDeleteNode = (nodeId) => {
    // Hapus node dari state nodes
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));

    // Hapus semua edges yang terhubung ke node yang dihapus
    setEdges((prevEdges) => prevEdges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));
  };

  const handleUpdateClick = (node) => {
    setSelectedNode(node); // Set selected node
    setIsUpdateFormVisible(true); // Show the update form
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "360px",
        padding: "10px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        width: "500px", // Menyesuaikan lebar tabel gabungan
      }}
    >
      <h2>Node dan Edge Data</h2>

      <table
        border="1"
        style={{ width: "100%", marginBottom: "20px", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>ID Node</th>
            <th>Nama Node</th>
            <th>Posisi</th>
            <th>Edge Terkoneksi</th>
            <th>Delete</th> {/* Kolom untuk tombol delete */}
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => {
            // Menemukan edge yang terhubung dengan node ini
            const connectedEdges = edges.filter(
              (edge) => edge.source === node.id || edge.target === node.id
            );

            return (
              <tr key={node.id}>
                <td>{node.id}</td>
                <td>{node.data.name}</td>
                <td>{node.data.position}</td>
                <td>
                  {connectedEdges.length > 0 ? (
                    <ul>
                      {connectedEdges.map((edge) => {
                        const otherNodeId =
                          edge.source === node.id ? edge.target : edge.source;
                        const otherNode = nodes.find((n) => n.id === otherNodeId);
                        return (
                          <li key={edge.id}>
                            {otherNode ? otherNode.data.name : "Unknown"}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <span>Tidak ada koneksi</span>
                  )}
                </td>
                <td>
                  {/* Tombol untuk menghapus node */}
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>

                  <button
                                      onClick={() => {setSelectedNode(node);
                                      setIsUpdateFormVisible(true);
                                      handleUpdateClick(node);}
                                      }  // Set the selected node when update is clicked

                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Update
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NodeEdgeTable;
