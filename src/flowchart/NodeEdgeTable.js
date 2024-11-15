import React, { useState } from "react";
import { Table, Button, Popconfirm, Modal, Form, Input, Select } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const NodeEdgeTable = ({ nodes, edges, setNodes, setEdges }) => {
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

  const handleFormSubmit = (values) => {
    // Update node data
    setNodes((prevNodes) => {
      return prevNodes.map((node) =>
        node.id === selectedNode.id ? { ...node, data: { ...node.data, ...values } } : node
      );
    });

    // Menambahkan atau memperbarui edge terkoneksi
    if (values.source && values.target) {
      const newEdge = {
        id: `${values.source}-${values.target}`,
        source: values.source,
        target: values.target,
      };
      setEdges((prevEdges) => [...prevEdges, newEdge]);
    }

    setIsUpdateFormVisible(false);
    setSelectedNode(null);
  };

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
        const connectedEdges = edges.filter(
          (edge) => edge.source === record.id || edge.target === record.id
        );
        return connectedEdges.length > 0 ? (
          <ul>
            {connectedEdges.map((edge) => {
              const otherNodeId = edge.source === record.id ? edge.target : edge.source;
              const otherNode = nodes.find((n) => n.id === otherNodeId);
              return (
                <li key={edge.id}>
                  {otherNode ? `${record.name} (ID: ${record.id}) ➔ ${otherNode.data.name} (ID: ${otherNode.id})` : "Unknown"}
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
        title={`Update Node ${selectedNode ? selectedNode.id : ''}`}
        visible={isUpdateFormVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}
      >
        {selectedNode ? (
          <Form
            initialValues={{
              name: selectedNode.name,
              position: selectedNode.position,
            }}
            onFinish={handleFormSubmit}
            layout="vertical"
          >
            <Form.Item
              label="Nama Node"
              name="name"
              rules={[{ required: true, message: "Nama node wajib diisi" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Posisi Node"
              name="position"
              rules={[{ required: true, message: "Posisi node wajib diisi" }]}
            >
              <Input />
            </Form.Item>

            {/* Edge Terkoneksi - Menampilkan pilihan source dan target */}
            <Form.Item label="Edge Terkoneksi">
              <div>
                
                <Select
                  placeholder="Pilih Target Node"
                  style={{ width: "100%", marginBottom: 10 }}
                  defaultValue={selectedNode.id} // Mengambil Source pertama
                  disabled
                >
                  {nodes.map((node) => (
                    <Select.Option key={node.id} value={node.id}>
                      {node.data.name} (ID: {node.id})
                    </Select.Option>
                  ))}
                </Select>

                
                <Select
  placeholder="Pilih Source Node"
  style={{ width: "100%" }}
  defaultValue={edges
    .filter((edge) => edge.target === selectedNode.id) // Mencari edge dengan target = selectedNode.id
    .map((edge) => edge.source)[0]} // Mengambil source pertama yang terhubung ke selectedNode
>
  {nodes
    .filter((node) => node.id !== selectedNode.id) // Menghindari pemilihan node yang sedang diedit
    .map((node) => (
      <Select.Option key={node.id} value={node.id}>
        {node.data.name} (ID: {node.id})
      </Select.Option>
    ))}
</Select>

              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Simpan
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default NodeEdgeTable;
