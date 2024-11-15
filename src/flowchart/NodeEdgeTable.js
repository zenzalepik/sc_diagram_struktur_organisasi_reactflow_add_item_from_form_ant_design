import React from "react";
import { Table, Button, Popconfirm } from "antd"; // Import komponen yang dibutuhkan
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"; // Import ikon untuk tombol

const NodeEdgeTable = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  setSelectedNode,
  setIsUpdateFormVisible,
}) => {
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

  // Data untuk tabel
  const columns = [
    {
      title: "ID Node",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nama Node",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Posisi",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Edge Terkoneksi",
      key: "edges",
      render: (_, record) => {
        // Menemukan edge yang terhubung dengan node ini
        const connectedEdges = edges.filter(
          (edge) => edge.source === record.id || edge.target === record.id
        );
        return connectedEdges.length > 0 ? (
          <ul>
            {connectedEdges.map((edge) => {
              const otherNodeId =
                edge.source === record.id ? edge.target : edge.source;
              const otherNode = nodes.find((n) => n.id === otherNodeId);
              return <li key={edge.id}>{otherNode ? otherNode.data.name : "Unknown"}</li>;
            })}
          </ul>
        ) : (
          <span>Tidak ada koneksi</span>
        );
      },
    },
    {
      title: "Aksi",
      key: "action",
      render: (_, record) => (
        <span>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleUpdateClick(record)}
            style={{ marginRight: 8 }}
          >
            Update
          </Button>

          <Popconfirm
            title="Apakah Anda yakin ingin menghapus node ini?"
            onConfirm={() => handleDeleteNode(record.id)}
            okText="Ya"
            cancelText="Tidak"
          >
            <Button type="danger" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  // Data untuk tabel disesuaikan dengan struktur yang diterima dari props
  const data = nodes.map((node) => ({
    key: node.id,
    id: node.id,
    name: node.data.name,
    position: node.data.position,
  }));

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
      <Table
        columns={columns}
        dataSource={data}
        pagination={false} // Nonaktifkan pagination, bisa disesuaikan
        rowKey="id"
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default NodeEdgeTable;
