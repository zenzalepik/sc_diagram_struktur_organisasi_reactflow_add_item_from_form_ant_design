import React, { useState } from "react";
import { Form, Button, Select, Modal } from "antd";
const { Option } = Select;

const DeleteEdgeForm = ({ nodes, edges, setEdges }) => {
  // Pilih edge yang akan dihapus
  const [selectedEdgeId, setSelectedEdgeId] = React.useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fungsi untuk menampilkan modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Fungsi untuk menutup modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
    setIsModalVisible(false); // Menutup modal setelah node ditambahkan
  };

  // Fungsi saat form disubmit
  const handleSubmit = () => {
    handleDeleteEdge();
    setIsModalVisible(false); // Menutup modal setelah node ditambahkan
  };

  return (
    <div>
      <Button
        variant="solid"
        color="danger"
        onClick={showModal}
        style={{
          position: "absolute",
          top: "120px",
          left: "20px",
          padding: "10px",
          // backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          // width: "300px",
        }}
      >
        Hapus Edge
      </Button>
      <Modal
        title="Remove Edge"
        open={isModalVisible} // Ganti 'visible' dengan 'open'
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          onFinish={handleSubmit}
          // initialValues={newNodeData}
          layout="vertical"
        >

          {/* Dropdown untuk memilih edge yang akan dihapus */}
          <Form.Item label="" name="edgeId">
            <Select
              value={selectedEdgeId}
              onChange={setSelectedEdgeId}
              placeholder="Select Node to Connect"
            >
              <Option value="">Select Node to Connect</Option>
              {edges.map((edge) => (
                <Option key={edge.id} value={edge.id}>
                  Edge: {edge.source} ({edge.target})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <br />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                backgroundColor: "#dc3545",
                color: "white",
              }}
            >
              Delete Edge{" "}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeleteEdgeForm;
