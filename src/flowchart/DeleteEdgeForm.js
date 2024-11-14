import React from "react";

const DeleteEdgeForm = ({ nodes, edges, setEdges }) => {
  // Pilih edge yang akan dihapus
  const [selectedEdgeId, setSelectedEdgeId] = React.useState("");

  // Fungsi untuk menghapus edge yang dipilih
  const handleDeleteEdge = () => {
    if (!selectedEdgeId) {
      alert("Pilih edge yang ingin dihapus");
      return;
    }

    // Hapus edge berdasarkan id yang dipilih
    setEdges((eds) => {
      return eds.filter((edge) => edge.id !== selectedEdgeId);
    });

    // Reset selectedEdgeId setelah penghapusan
    setSelectedEdgeId("");
  };

  return (
    <div
    style={{
        position: "absolute",
        bottom: "20px",
        left: "380px",
        padding: "10px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        width: "250px", // Form lebarnya
      }}
    >
      <h3>Delete Edge</h3>

      {/* Dropdown untuk memilih edge yang akan dihapus */}
      <select
        value={selectedEdgeId}
        onChange={(e) => setSelectedEdgeId(e.target.value)}
        style={{
          marginBottom: "8px",
          padding: "5px",
          width: "100%",
        }}
      >
        <option value="">Pilih Edge untuk Dihapus</option>
        {edges.map((edge) => (
          <option key={edge.id} value={edge.id}>
            {`Edge: ${edge.source} -> ${edge.target}`}
          </option>
        ))}
      </select>

      <br />

      {/* Tombol untuk menghapus edge */}
      <button
        onClick={handleDeleteEdge}
        style={{
          padding: "5px 10px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Delete Edge
      </button>
    </div>
  );
};

export default DeleteEdgeForm;
