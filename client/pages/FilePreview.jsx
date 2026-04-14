import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function FilePreview() {
  const { token } = useParams();

  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/file/${token}`)
      .then(res => setFile(res.data))
      .catch(err => alert(err.response.data));
  }, []);

  const handleDownload = async () => {
    const res = await axios.post(
      `http://localhost:5000/api/download/${token}`,
      { password }
    );

    window.open(res.data.url, "_blank");
  };

  if (!file) return <p>Loading...</p>;

  // File type detection
  const isImage = ["jpg","jpeg","png","gif","webp"].includes(file.fileType);
  const isVideo = ["mp4","webm","ogg"].includes(file.fileType);
  const isPDF = file.fileType === "pdf";

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>📄 File Preview</h2>

      <p><b>Name:</b> {file.fileName}</p>
      <p><b>Downloads Left:</b> {file.downloadsLeft}</p>

      {/* 🔥 Preview Section */}
      <div style={{ margin: "20px" }}>
        {isImage && (
          <img src={file.fileUrl} alt="preview" width="300" />
        )}

        {isVideo && (
          <video width="400" controls>
            <source src={file.fileUrl} />
          </video>
        )}

        {isPDF && (
          <iframe
            src={file.fileUrl}
            width="400"
            height="500"
            title="PDF Preview"
          />
        )}

        {!isImage && !isVideo && !isPDF && (
          <p>No preview available</p>
        )}
      </div>

      {/* 🔐 Password */}
      {file.requiresPassword && (
        <input
          type="password"
          placeholder="Enter password"
          onChange={(e)=>setPassword(e.target.value)}
        />
      )}

      <br /><br />

      <button onClick={handleDownload}>
        ⬇️ Download
      </button>
    </div>
  );
}

export default FilePreview;