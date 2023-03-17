import { useState } from "react";
import axios from "axios";

import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `4002a1cb66a117099543`,
            pinata_secret_api_key: `94ac31adde234518ad297cf0a472cd01cb3a2767773f075b379194489537af00`,
            "Content-Type": "multipart/form-data",
          },
        });

        const FileHash = `ipfs://${resFile.data.IpfsHash}`;

        const signer = contract.connect(provider.getSigner());
        signer.add(account, FileHash);

        alert("Successfully Image Uploaded");
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
    }
    setFileName("No image selected");
    setFile(null);
  };

  const getFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };

    setFileName(e.target.files[0].name);

    e.preventDefault();
  };

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file.type !== "image/png") {
      alert("Invalid file format. Only PNG files are allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      const arrayBuffer = e.target.result;
      // do something with the array buffer
    };
    reader.readAsArrayBuffer(file);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="file-upload-container"
    //   onDrop={handleDrop}
    //   onDragOver={handleDragOver}
    >
      <form className="file-upload-form" onSubmit={handleSubmit}>
        <div className="drag-drop">
          <svg
            width="50"
            height="50"
            fill="none"
            stroke="#ffffff"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <path d="m17 8-5-5-5 5"></path>
            <path d="M12 3v12"></path>
          </svg>

          <input
            disabled={!account}
            type="file"
            id="file-upload"
            name="data"
            onChange={getFile}
            multiple
          />
          <h3>Drag or Drop file</h3>
          <label htmlFor="file-upload" className="file-upload-choose">
            Choose Image
          </label>

          <span className="file-upload-text-area">Image: {fileName}</span>
        </div>

        <div className="submit-btn">
          <button type="submit" className="file-upload-button" disabled={!file}>
            Upload File
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;
