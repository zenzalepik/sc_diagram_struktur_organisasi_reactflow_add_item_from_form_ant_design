import React, { useState } from "react";
import { Form, Input, Button, Select, Modal } from "antd";

const { Option } = Select;

const AddNodeForm = ({ newNodeData, setNewNodeData, handleAddNode, nodes }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fungsi untuk menampilkan modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Fungsi untuk menutup modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Fungsi saat form disubmit
  const handleSubmit = (values) => {
    setNewNodeData(values);
    handleAddNode();
    setIsModalVisible(false); // Menutup modal setelah node ditambahkan
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={showModal}
        style={{
          position: "absolute",
          top: "80px",
          left: "20px",
          padding: "10px",
          // backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          // width: "300px",
        }}
      >
        Tambah Struktur
      </Button>

      <Modal
        title="Add New Node"
        open={isModalVisible} // Ganti 'visible' dengan 'open'
        onCancel={handleCancel}
        footer={null} // Agar tombol default di bawah modal tidak muncul
      >
        <Form
          onFinish={handleSubmit}
          initialValues={newNodeData}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input
              value={newNodeData.name}
              onChange={(e) =>
                setNewNodeData({ ...newNodeData, name: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: "Please input the position!" }]}
          >
            <Input
              value={newNodeData.position}
              onChange={(e) =>
                setNewNodeData({ ...newNodeData, position: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Select Node to Connect" name="connectedTo">
            <Select
              value={newNodeData.connectedTo}
              onChange={(value) =>
                setNewNodeData({ ...newNodeData, connectedTo: value })
              }
            >
              <Option value="">Select Node to Connect</Option>
              {nodes.map((node) => (
                <Option key={node.id} value={node.id}>
                  {node.data.name} ({node.data.position})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                backgroundColor: "#007bff",
                color: "white",
              }}
            >
              Add Node
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddNodeForm;
