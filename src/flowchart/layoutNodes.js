//layoutNodes.js

import dagre from "dagre";

const layoutNodes = (nodes, edges) => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}));
  
    // Menambahkan node ke dalam grafik dagre
    nodes.forEach((node) => {
      g.setNode(node.id, { width: 172, height: 36 }); // Ukuran node yang digunakan oleh dagre
    });
  
    // Menambahkan edge ke dalam grafik dagre
    edges.forEach((edge) => {
      g.setEdge(edge.source, edge.target);
    });
  
    // Menjalankan layout
    dagre.layout(g);
  
    // Menyusun ulang posisi node berdasarkan hasil layout
    nodes.forEach((node) => {
      const nodeWithPosition = g.node(node.id);
      node.position = {
        x: nodeWithPosition.x - 172 / 2, // Mengatur posisi node di tengah
        y: nodeWithPosition.y - 36 / 2, // Menyesuaikan ukuran node dengan layout
      };
    });
  
    return nodes;
  };
  
export default layoutNodes;