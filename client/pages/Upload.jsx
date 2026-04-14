import axios from "axios";
import { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [link, setLink] = useState("");
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          onUploadProgress: (data) => {
            const percent = Math.round((data.loaded * 100) / data.total);
            setProgress(percent);
          }
        }
      );

      setLink(res.data.link);
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Upload File</h1>

      {/* Drag Drop Area */}
      <div
        style={styles.dropBox}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setFile(e.dataTransfer.files[0]);
        }}
      >
        {file ? file.name : "Drag & Drop File Here"}
      </div>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <input
        type="text"
        placeholder="Optional Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleUpload}>Upload</button>

      {/* Progress Bar */}
      {progress > 0 && (
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {link && (
        <div>
          <p>Share this link:</p>
          <a href={link}>{link}</a>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px"
  },
  dropBox: {
    border: "2px dashed #555",
    padding: "40px",
    margin: "20px",
    cursor: "pointer"
  },
  progressBar: {
    width: "100%",
    background: "#ddd",
    marginTop: "10px"
  },
  progressFill: {
    height: "20px",
    background: "green",
    color: "white"
  }
};

export default Upload;