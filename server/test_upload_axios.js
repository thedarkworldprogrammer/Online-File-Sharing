import fs from "fs";

fs.writeFileSync("test.jpg", "hello image payload");

const form = new FormData();
form.append("file", new Blob([fs.readFileSync("test.jpg")]), "test.jpg");
form.append("password", "");

fetch("http://localhost:5000/api/upload", {
  method: "POST",
  body: form
}).then(res => res.json()).then(console.log).catch(console.error);
