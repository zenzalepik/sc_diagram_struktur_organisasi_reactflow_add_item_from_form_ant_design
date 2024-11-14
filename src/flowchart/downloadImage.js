//downloadImage.js

import { toPng } from "html-to-image";

const downloadImage = (nodeElement) => {
    // Menyembunyikan panel dan tombol selama pengambilan gambar
    const panelElements = document.querySelectorAll(".react-flow__panel");
    const buttonElements = document.querySelectorAll("button");
  
    // Simpan state visibility elemen-elemen yang ingin disembunyikan
    panelElements.forEach((el) => (el.style.display = "none"));
    buttonElements.forEach((el) => (el.style.display = "none"));
  
    // Ambil gambar
    toPng(nodeElement, {
      backgroundColor: "#fff", // Set background warna putih untuk gambar
    })
      .then((dataUrl) => {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "flowchart.png";
        a.click();
      })
      .catch((err) => {
        console.error("Error downloading image", err);
      })
      .finally(() => {
        // Kembalikan visibilitas elemen setelah gambar diambil
        panelElements.forEach((el) => (el.style.display = "block"));
        buttonElements.forEach((el) => (el.style.display = "inline-block"));
      });
  };
  
export default downloadImage;