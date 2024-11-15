import React, { useEffect, useCallback, useState } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Background,
} from "@xyflow/react";
import { nodes as initialNodes, edges as initialEdges } from "./nodes-edges";
import { darkTheme, lightTheme } from "./Theme";
import "@xyflow/react/dist/style.css";
import "./styles/ReactFlow.css";
import MiniMapStyled from "./styles/MiniMapStyled";
import ControlsStyled from "./styles/ControlsStyled";
import ReactFlowStyled from "./styles/ReactFlowStyled";
import layoutNodes from "./flowchart/layoutNodes";
import nodeTypes from "./flowchart/nodeTypes";
import downloadImage from "./flowchart/downloadImage";
import AddNodeForm from "./flowchart/AddNodeForm";
import UpdateNodeForm from "./flowchart/UpdateNodeForm";
import NodeEdgeTable from "./flowchart/NodeEdgeTable";
import DeleteEdgeForm from "./flowchart/DeleteEdgeForm";
import { layoutGraph, handleLayoutDiagram } from "./flowchart/graphLayout";
import { handleAddNode } from "./flowchart/handleAddNode";

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const [newNodeData, setNewNodeData] = useState({
    name: "",
    position: "",
    connectedTo: "",
  });

  const [selectedNode, setSelectedNode] = useState(null); // Untuk node yang dipilih
  const [updatedNodeData, setUpdatedNodeData] = useState({}); // Data node yang diperbarui

  const handleUpdateNode = (updatedNode) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === updatedNode.id ? updatedNode : node
      )
    );
  };

  const [updatedEdgeData, setUpdatedEdgeData] = useState({
    source: "",
    target: "",
  });

  const [mode, setMode] = useState("light");
  const theme = mode === "light" ? lightTheme : darkTheme;

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);

  const handleUpdateEdge = () => {
    // Logic to update edge...
  };

  const onEdgesChange = useCallback((changes) => {
    // Logic to handle edge changes...
  }, []);

  const toggleMode = () => {
    setMode((m) => (m === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const layoutedNodes = layoutNodes(nodes, edges);
    setNodes(layoutedNodes);
  }, [nodes, edges]);

  const handleLayout = () => {
    handleLayoutDiagram(nodes, edges, setNodes);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <ReactFlowStyled
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        theme={theme}
        className="react-flow-container"
      >
        <Background variant="dots" gap={12} size={1} />

        {/* Panel for Switch Mode */}
        <Panel position="top-left">
          <button onClick={toggleMode}>Switch Mode</button>
        </Panel>

        {/* Panel for Download Image */}
        <Panel position="top-right">
          <button
            onClick={() =>
              downloadImage(document.querySelector(".react-flow-container"))
            }
          >
            Download Image
          </button>
        </Panel>

        {/* Panel for MiniMap */}
        <Panel position="bottom-right">
          <MiniMapStyled />
        </Panel>

        {/* Panel for Controls */}
        <Panel position="bottom-left">
          <ControlsStyled />
        </Panel>

        {/* Rapikan Diagram Button */}
        <Panel position="top-right" style={{ marginTop: "40px" }}>
          <button
            onClick={handleLayout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Rapikan Diagram
          </button>
        </Panel>
      </ReactFlowStyled>

      {/* AddNodeForm and UpdateNodeForm */}
      <AddNodeForm
        newNodeData={newNodeData}
        setNewNodeData={setNewNodeData}
        handleAddNode={() => handleAddNode(newNodeData, setNodes, setEdges, setNewNodeData)}
        nodes={nodes}
      />

      {isUpdateFormVisible && (
        <UpdateNodeForm
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          updatedNodeData={updatedNodeData}
          setUpdatedNodeData={setUpdatedNodeData}
          handleUpdateNode={handleUpdateNode}
          updatedEdgeData={updatedEdgeData}
          setUpdatedEdgeData={setUpdatedEdgeData}
          nodes={nodes}
          edges={edges}
          handleUpdateEdge={handleUpdateEdge}
        />
      )}

      {/* Delete Edge Form */}
      <DeleteEdgeForm nodes={nodes} edges={edges} setEdges={setEdges} />

      {/* Display Node and Edge Data in a Table */}
      <NodeEdgeTable
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        setSelectedNode={setSelectedNode}
        setIsUpdateFormVisible={setIsUpdateFormVisible}
      />
    </div>
  );
};

export default Flow;
