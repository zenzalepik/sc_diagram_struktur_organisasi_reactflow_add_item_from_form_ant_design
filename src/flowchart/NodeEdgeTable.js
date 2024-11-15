import React, { useState } from "react";
import { Table, Button, Popconfirm, Modal, Form, Input, Select } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const NodeEdgeTable = ({ nodes, edges, setNodes, setEdges }) => {
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null); // Menyimpan ID node yang dipilih


  // Fungsi untuk menghapus node beserta edges yang terhubung
  const handleDeleteNode = (nodeId) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
  };

  // Fungsi untuk menampilkan modal dengan data node yang dipilih
  const handleUpdateClick = (node) => {
    setSelectedNode(node); // Set selected node
    setSelectedNodeId(node.id);  // Set ID node yang dipilih
    const inisiasivalue = {
      delaut: node.id, // ID node yang dipilih
    };
    setIsUpdateFormVisible(true); // Show the update form
  };

  const handleCancel = () => {
    setIsUpdateFormVisible(false);
    setSelectedNode(null);
  };

  const handleFormSubmit = (values) => {
    // 1. Update Node
    setNodes((prevNodes) => {
      return prevNodes.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, ...values } }
          : node
      );
    });

    // 2. Update atau hapus edge yang terhubung (tergantung pada source dan target)
    if (values.source && values.target) {
      setEdges((prevEdges) => {
        // 2.1 Hapus edge lama yang terhubung dengan selectedNode
        const updatedEdges = prevEdges.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        );

        // 2.2 Buat edge baru berdasarkan source dan target baru
        const newEdge = {
          id: `${values.source}-${values.target}`,
          source: values.source,
          target: values.target,
        };

        // 2.3 Gabungkan edges yang telah diupdate dengan edge baru
        return [...updatedEdges, newEdge];
      });
    }

    // Menutup form update setelah submit
    setIsUpdateFormVisible(false);
    setSelectedNode(null);
  };

  // Fungsi untuk menangani klik edit edge
  const handleEditPimpinan = (record) => {
    setSelectedNodeId(record.id);

    // Temukan edge yang terhubung dengan node yang dipilih
    const connectedEdges = edges.filter(
      (edge) => (edge.target === record.id)
    );
    const edge = connectedEdges[0]; // Ambil edge pertama yang ditemukan

    setSelectedNode(record); // Set node yang dipilih
    setSelectedEdge(edge); // Set edge yang dipilih untuk diedit
    setIsEditPimpinanFormVisible(true); // Tampilkan form edit edge
};

  
  // Fungsi untuk menangani klik edit edge
  const handleEditEdgeClick = (record) => {
    // Temukan edge yang terhubung dengan node yang dipilih
    const connectedEdges = edges.filter(
      (edge) => edge.source === record.id || edge.target === record.id
    );

    // Jika ada lebih dari satu edge, kita akan memilih salah satu untuk diedit
    if (connectedEdges.length === 1) {
      const edge = connectedEdges[0];
      setSelectedEdge(edge); // Set edge yang dipilih untuk diedit
      setIsEditEdgeFormVisible(true); // Tampilkan form edit edge
    } else {
      // Jika ada lebih dari satu edge, beri tahu pengguna
      alert(
        "Terdapat lebih dari satu edge untuk node ini. Pilih salah satu untuk diedit."
      );
    }
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
      title: "Pimpinan",
      key: "edges",
      render: (_, record) => {
        const connectedEdges = edges.filter(
          (edge) => edge.target === record.id
        );
        return (
          <>
            {connectedEdges.length > 0 ? (
              <ul>
                {connectedEdges.map((edge) => {
                  const pinpinanNodeId =
                    edge.source;
                  const pinpinanNode = nodes.find((n) => n.id === pinpinanNodeId);
                  return (
                    <li key={edge.id}>
                      {pinpinanNode
                        ? `${pinpinanNode.data.name} (ID: ${pinpinanNode.id})`
                        : "Unknown"}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span>-</span>
            )}

            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => handleEditPimpinan(record)}
            >
              Ubah Pimpinan
            </Button>
          </>
        );
      },
    },
    {
      title: "Edge Terkoneksi",
      key: "edges",
      render: (_, record) => {
        const connectedEdges = edges.filter(
          (edge) => edge.source === record.id || edge.target === record.id
        );
        return (
          <>
            {connectedEdges.length > 0 ? (
              <ul>
                {connectedEdges.map((edge) => {
                  const otherNodeId =
                    edge.source === record.id ? edge.target : edge.source;
                  const otherNode = nodes.find((n) => n.id === otherNodeId);
                  return (
                    <li key={edge.id}>
                      {otherNode
                        ? `${record.name} (ID: ${record.id}) ➔ ${otherNode.data.name} (ID: ${otherNode.id})`
                        : "Unknown"}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <span>Tidak ada koneksi</span>
            )}

            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => handleEditEdgeClick(record)}
            >
              Edit Edge
            </Button>
          </>
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

  // State untuk menyimpan edge yang dipilih
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [isEditEdgeFormVisible, setIsEditEdgeFormVisible] = useState(false);
  const [isEditPimpinanFormVisible, setIsEditPimpinanFormVisible] = useState(false);

  // Form untuk mengedit edge
  const handleEditEdgeFormSubmit = (values) => {
    // Update edge berdasarkan id
    setEdges((prevEdges) => {
      return prevEdges.map((edge) =>
        edge.id === selectedEdge.id
          ? { ...edge, source: values.source, target: values.target }
          : edge
      );
    });

    // Tutup modal setelah submit
    setIsEditEdgeFormVisible(false);
    setSelectedEdge(null);
  };

  // Menutup modal jika batal
  const handleCancelEdgeEdit = () => {
    setIsEditEdgeFormVisible(false);
    setSelectedEdge(null);
  };


    const handleEditPimpinanFormSubmit = (values) => {
      // Update edge berdasarkan id
      setEdges((prevEdges) => {
        return prevEdges.map((edge) =>
          edge.id === selectedEdge.id
            ? { ...edge, source: values.source, target: values.target }
            : edge
        );
      });
  
      // Tutup modal setelah submit
      setIsEditPimpinanFormVisible(false);
      setSelectedEdge(null);
    };
  const handleCancelPimpinanEdit = () => {
    setIsEditPimpinanFormVisible(false);
    setSelectedEdge(null);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "180px",
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
      {/* //Modal edit pimpinan */}
      <Modal
  title={`Edit Edge ${selectedEdge ? selectedEdge.id : ""}`}
  visible={isEditPimpinanFormVisible}
  onCancel={handleCancelPimpinanEdit}
  footer={null}
  destroyOnClose={true}
>
  <Form
    initialValues={{
      source: selectedEdge ? selectedEdge.source : null,  // Jika selectedEdge null, set ke null
      target: selectedEdge ? selectedEdge.target : selectedNodeId   // =>>> Yang sini
    }}
    onFinish={handleEditPimpinanFormSubmit}
    layout="vertical"
  >
    {/* {selectedEdge.target} */}
    <Form.Item
      label="Source Node"
      name="source"
      rules={[{ required: true, message: "Source node wajib diisi" }]}
    >
      <Select style={{ width: "100%" }}>
        {nodes
          .filter((node) => node.id !== selectedEdge?.target) // Pastikan tidak memilih target yang sama dengan source
          .map((node) => (
            <Select.Option key={node.id} value={node.id}>
              {node.data.name} (ID: {node.id})
            </Select.Option>
          ))}
      </Select>
    </Form.Item>

    <Form.Item
      label="Target Node"
      name="target"
      rules={[{ required: true, message: "Target node wajib diisi" }]}
    >
      <Select style={{ width: "100%" }}>
        {nodes
          .filter((node) => node.id !== selectedEdge?.source) // Pastikan tidak memilih source yang sama dengan target
          .map((node) => (
            <Select.Option key={node.id} value={node.id}>
              {node.data.name} (ID: {node.id})
            </Select.Option>
          ))}
      </Select>
    </Form.Item>

    <Form.Item>
      <Button type="primary" htmlType="submit">
        Simpan
      </Button>
    </Form.Item>
  </Form>
</Modal>

      {/* // */}
      <Modal
        title={`Update Node ${selectedNode ? selectedNode.id : ""}`}
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
            <Form.Item label="" name="target">
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
            </Form.Item>
            <Form.Item
              label="Posisi Node"
              name="source"
              rules={[{ required: true, message: "Posisi node wajib diisi" }]}
            >
              <Select
                placeholder="Pilih Source Node"
                style={{ width: "100%" }}
                defaultValue={
                  edges
                    .filter((edge) => edge.target === selectedNode.id) // Mencari edge dengan target = selectedNode.id
                    .map((edge) => edge.source)[0]
                } // Mengambil source pertama yang terhubung ke selectedNode
              >
                {nodes
                  .filter((node) => node.id !== selectedNode.id) // Menghindari pemilihan node yang sedang diedit
                  .map((node) => (
                    <Select.Option key={node.id} value={node.id}>
                      {node.data.name} (ID: {node.id})
                    </Select.Option>
                  ))}
              </Select>
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
      {/* // Modal untuk mengedit edge */}
      <Modal
        title={`Edit Edge ${selectedEdge ? selectedEdge.id : ""}`}
        visible={isEditEdgeFormVisible}
        onCancel={handleCancelEdgeEdit}
        footer={null}
        destroyOnClose={true}
      >
        {selectedEdge ? (
          <Form
            initialValues={{
              source: selectedEdge.source,
              target: selectedEdge.target,
            }}
            onFinish={handleEditEdgeFormSubmit}
            layout="vertical"
          >
            <Form.Item
              label="Source Node"
              name="source"
              rules={[{ required: true, message: "Source node wajib diisi" }]}
            >
              <Select style={{ width: "100%" }}>
                {nodes
                  .filter((node) => node.id !== selectedEdge.target) // Pastikan tidak memilih target yang sama dengan source
                  .map((node) => (
                    <Select.Option key={node.id} value={node.id}>
                      {node.data.name} (ID: {node.id})
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Target Node"
              name="target"
              rules={[{ required: true, message: "Target node wajib diisi" }]}
            >
              <Select style={{ width: "100%" }}>
                {nodes
                  .filter((node) => node.id !== selectedEdge.source) // Pastikan tidak memilih source yang sama dengan target
                  .map((node) => (
                    <Select.Option key={node.id} value={node.id}>
                      {node.data.name} (ID: {node.id})
                    </Select.Option>
                  ))}
              </Select>
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
