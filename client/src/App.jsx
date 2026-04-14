import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "../pages/Upload";
import FilePreview from "../pages/FilePreview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/file/:token" element={<FilePreview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;