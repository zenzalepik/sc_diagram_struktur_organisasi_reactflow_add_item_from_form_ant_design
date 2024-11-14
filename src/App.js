import React, { useEffect, useCallback, useState } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Background,
  // SmoothStepEdge
} from "@xyflow/react";
import { nodes as initialNodes, edges as initialEdges } from "./nodes-edges";
import { darkTheme, lightTheme } from "./Theme";
import "@xyflow/react/dist/style.css";
import "./styles/ReactFlow.css";
import edgeStyle from "./styles/edgeStyle";
import MiniMapStyled from "./styles/MiniMapStyled";
import ControlsStyled from "./styles/ControlsStyled";
import ReactFlowStyled from "./styles/ReactFlowStyled";
import layoutNodes from "./flowchart/layoutNodes";
import nodeTypes from "./flowchart/nodeTypes";
import downloadImage from "./flowchart/downloadImage";
import AddNodeForm from "./flowchart/AddNodeForm";
import UpdateNodeForm from "./flowchart/UpdateNodeForm";
import NodeEdgeTable from "./flowchart/NodeEdgeTable"; // import the new component
import DeleteEdgeForm from "./flowchart/DeleteEdgeForm"; // Import komponen DeleteEdgeForm
import dagre from "dagre";  // Import dagre for layout


const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [edges, setEdges] = useEdgesState(initialEdges);


  const [newNodeData, setNewNodeData] = useState({
    name: "",
    position: "",
    connectedTo: "",
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [updatedNodeData, setUpdatedNodeData] = useState({
    name: "",
    position: "",
    connectedTo: "",
  });

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

  const handleAddNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: {
        name: newNodeData.name,
        position: newNodeData.position,
      },
      position: { x: 0, y: 0 },
      type: "custom",
    };

    setNodes((nds) => [...nds, newNode]);

    if (newNodeData.connectedTo) {
      const newEdge = {
        id: `e${newNodeData.connectedTo}-${newNode.id}`,
        source: newNodeData.connectedTo,
        target: newNode.id,
      };
      setEdges((eds) => [...eds, newEdge]);
    }

    setNewNodeData({ name: "", position: "", connectedTo: "" });
  };

  // State untuk kontrol visibilitas form update
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);

  const handleUpdateNode = () => {
    const updatedNode = {
      id: selectedNode.id,
      data: {
        name: updatedNodeData.name,
        position: updatedNodeData.position,
      },
      position: selectedNode.position,  // Bisa diubah sesuai dengan posisi baru jika diperlukan
      type: 'custom',
    };
  
    // Update nodes
    setNodes((nds) => {
      const index = nds.findIndex((node) => node.id === selectedNode.id);
      nds[index] = updatedNode;
      return [...nds];
    });
  
    // Menghapus edge lama yang terhubung dengan node yang diperbarui dan memperbarui edge yang ada
    setEdges((eds) => {
      const filteredEdges = eds.filter((edge) => {
        return edge.source !== selectedNode.id && edge.target !== selectedNode.id;
      });
  
      // Update edge yang terhubung dengan node yang diperbarui
      const updatedEdges = eds
        .filter((edge) => edge.source === selectedNode.id || edge.target === selectedNode.id)
        .map((edge) => {
          // Jika source node yang diperbarui, maka kita perlu mengganti source atau targetnya
          if (edge.source === selectedNode.id) {
            return {
              ...edge,
              source: updatedNode.id,  // Mengubah sumber edge jika node yang diperbarui adalah sumber
            };
          }
          if (edge.target === selectedNode.id) {
            return {
              ...edge,
              target: updatedNode.id,  // Mengubah target edge jika node yang diperbarui adalah target
            };
          }
          return edge;
        });
  
      // Gabungkan edge yang diperbarui dengan edge yang tidak terkena perubahan
      return [...filteredEdges, ...updatedEdges];
    });
  
    setUpdatedNodeData({ name: '', position: '', connectedTo: '' });
    setSelectedNode(null);
    setIsUpdateFormVisible(false);  // Menyembunyikan form setelah update selesai

  };
  
  
  const handleUpdateEdge = () => {
    if (!updatedEdgeData.source || !updatedEdgeData.target) {
      return; // Jangan lakukan apapun jika source atau target tidak dipilih
    }
  
    // Membuat ID edge baru berdasarkan source dan target
    const updatedEdge = {
      id: `e${updatedEdgeData.source}-${updatedEdgeData.target}`,
      source: updatedEdgeData.source,
      target: updatedEdgeData.target,
    };
  
    // Hapus edge lama yang terhubung dengan source atau target yang sama
    setEdges((eds) => {
      // Filter untuk menghapus edge lama yang memiliki source atau target yang sama
      const filteredEdges = eds.filter(
        (edge) =>
          // edge.source !== updatedEdgeData.source || 
        edge.target !== updatedEdgeData.target
      );
  
      // Tambahkan edge baru
      filteredEdges.push(updatedEdge);
  
      // Kembalikan edges yang sudah diperbarui
      return filteredEdges;
    });
  
    // Reset data setelah pembaruan
    setUpdatedEdgeData({ source: "", target: "" });
  };
  
  
  
  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => {
      return changes.reduce((acc, { type, id, source, target }) => {
        switch (type) {
          case 'add':
            acc.push({ id, source, target });
            break;
          case 'remove':
            acc = acc.filter((edge) => edge.id !== id);
            break;
          case 'update':
            const edge = acc.find((e) => e.id === id);
            if (edge) {
              edge.source = source;
              edge.target = target;
            }
            break;
          default:
            return acc;
        }
        return acc;
      }, [...eds]);
    });
  }, []);
  
  const toggleMode = () => {
    setMode((m) => (m === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const layoutedNodes = layoutNodes(nodes, edges);
    setNodes(layoutedNodes);
  }, [nodes, edges]);

  // Function to layout nodes using dagre
  const layoutGraph = (nodes, edges) => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes to dagre graph
    nodes.forEach(node => {
      g.setNode(node.id, { width: 150, height: 50 });
    });

    // Add edges to dagre graph
    edges.forEach(edge => {
      g.setEdge(edge.source, edge.target);
    });

    // Run the layout algorithm
    dagre.layout(g);

    // Apply the layout to nodes
    const layoutedNodes = nodes.map(node => {
      const nodeWithPosition = g.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x,
          y: nodeWithPosition.y,
        },
      };
    });

    return layoutedNodes;
  };

  // Function to handle "Rapikan Diagram" button click
  const handleLayoutDiagram = () => {
    const newNodes = layoutGraph(nodes, edges);
    setNodes(newNodes);
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
        // edgeTypes={{
        //   default: SmoothStepEdge}}
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
        <Panel position="bottom-center">
          <button
            onClick={handleLayoutDiagram}
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
        handleAddNode={handleAddNode}
        nodes={nodes}
      />

{isUpdateFormVisible ? (
      
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
): null}


      {/* Delete Edge Form */}
      <DeleteEdgeForm nodes={nodes} edges={edges} setEdges={setEdges} />

      {/* Display Node and Edge Data in a Table */}
      <NodeEdgeTable nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        setSelectedNode={setSelectedNode}  // Pass setSelectedNode to table
        setIsUpdateFormVisible={setIsUpdateFormVisible}  // Pass setIsUpdateFormVisible ke tabel
        />
    </div>
  );
};

export default Flow;
