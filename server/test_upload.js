import axios from "axios";
import fs from "fs";
import FormData from "form-data";

fs.writeFileSync("test.txt", "Test content");

const formData = new FormData();
formData.append("file", fs.createReadStream("test.txt"));
formData.append("password", "");

axios.post("http://localhost:5000/api/upload", formData, {
  headers: formData.getHeaders()
}).then(res => {
  console.log("Upload response:", res.data);
}).catch(err => {
  console.error("Upload error:", err.response ? err.response.data : err.message);
});
