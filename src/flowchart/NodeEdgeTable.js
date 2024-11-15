import React, { useState } from "react";
import { Table, Button, Popconfirm, Modal } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const NodeEdgeTable = ({ nodes, edges, setNodes, setEdges }) => {
  // State untuk menampilkan modal dan menyimpan data node yang dipilih
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // Fungsi untuk menghapus node beserta edges yang terhubung
  const handleDeleteNode = (nodeId) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  // Fungsi untuk menampilkan modal dengan data node yang dipilih
  const handleUpdateClick = (node) => {
    setSelectedNode(node); // Set selected node
    setIsUpdateFormVisible(true); // Show the update form
  };

  const handleCancel = () => {
    setIsUpdateFormVisible(false);
    setSelectedNode(null);
  };

  // Menambahkan kolom Source dan Target di tabel
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
      title: "Source",
      key: "source",
      render: (_, record) => {
        const connectedEdges = edges.filter(
          (edge) => edge.target === record.id
        );
        return connectedEdges.length > 0 ? (
          <ul>
            {connectedEdges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              return (
                <li key={edge.id}>
                  {sourceNode ? `${sourceNode.data.name} (ID: ${sourceNode.id})` : "Unknown"}
                </li>
              );
            })}
          </ul>
        ) : (
          <span>Tidak ada koneksi</span>
        );
      },
    },
    {
      title: "Target",
      key: "target",
      render: (_, record) => {
        const connectedEdges = edges.filter(
          (edge) => edge.source === record.id
        );
        return connectedEdges.length > 0 ? (
          <ul>
            {connectedEdges.map((edge) => {
              const targetNode = nodes.find((n) => n.id === edge.target);
              return (
                <li key={edge.id}>
                  {targetNode ? `${targetNode.data.name} (ID: ${targetNode.id})` : "Unknown"}
                </li>
              );
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
        width: "500px",
      }}
    >
      <h2>Node dan Edge Data</h2>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="id"
        style={{ width: "100%" }}
      />

      <Modal
        title="Update Node"
        visible={isUpdateFormVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        {selectedNode ? (
          <div>
            <p><strong>ID Node:</strong> {selectedNode.id}</p>
            <p><strong>Nama Node:</strong> {selectedNode.name || "Nama tidak tersedia"}</p>
            <p><strong>Posisi Node:</strong> {selectedNode.position || "Posisi tidak tersedia"}</p>
            <p><strong>Edge Terkoneksi:</strong>
              {edges.filter((edge) => edge.source === String(selectedNode.id) || edge.target === String(selectedNode.id)).length > 0 ? (
                <ul>
                  {edges.filter((edge) => edge.source === String(selectedNode.id) || edge.target === String(selectedNode.id))
                    .map((edge) => {
                      const sourceNode = nodes.find((n) => String(n.id) === String(edge.source));
                      const targetNode = nodes.find((n) => String(n.id) === String(edge.target));
                      return (
                        <li key={edge.id}>
                          {sourceNode ? `${sourceNode.data.name} (ID: ${sourceNode.id})` : "Unknown"} ➔ {targetNode ? `${targetNode.data.name} (ID: ${targetNode.id})` : "Unknown"}
                        </li>
                      );
                    })
                  }
                </ul>
              ) : (
                <span>Tidak ada koneksi</span>
              )}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default NodeEdgeTable;
