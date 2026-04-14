# 🚀 Temporary File Sharing System

A full-stack file sharing application where users can upload files, generate secure links, and share them with controlled access.

---

## 🌟 Features

* 📤 Upload files to cloud storage
* 🔗 Generate secure shareable links
* ⏳ Auto expiry (2–4 hours)
* 🔁 Max 3 downloads per file
* 🔐 Optional password protection
* 👀 File preview (image, video, PDF)
* 🧹 Automatic deletion (cron job)
* 🎯 Random token-based URLs

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Cloud & Services

* Cloudinary (file storage)
* MongoDB Atlas (database)
* Render (backend hosting)
* Vercel (frontend hosting)

---

## 📁 Project Structure

```
project/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── cron/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── pages/
│   ├── components/
│   └── App.jsx
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 Clone Repository

```
git clone https://github.com/thedarkworldprogrammer/Online-File-Sharing.git
cd Online-File-Sharing
```

---

### 🔹 Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_uri
CLOUD_NAME=your_cloudinary_name
API_KEY=your_api_key
API_SECRET=your_api_secret
BASE_URL=http://localhost:5173
```

Run backend:

```
npm run dev
```

---

### 🔹 Frontend Setup

```
cd frontend
npm install
```

Create `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```
npm run dev
```

---

## 🔗 API Endpoints

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | /api/upload          | Upload file      |
| GET    | /api/file/:token     | Get file preview |
| POST   | /api/download/:token | Download file    |

---

## 🔐 Security Features

* Password hashing using bcrypt
* Token-based URL access
* Download limit enforcement
* Auto expiry & deletion

---

## 🧪 Usage Flow

1. Upload a file
2. Get a unique shareable link
3. Open link → preview page
4. Enter password (if required)
5. Download file (max 3 times)
6. File auto-deletes after expiry

---

## ⚠️ Limitations

* Large file uploads depend on server capacity
* Cloudinary free tier has storage limits
* Render free tier may sleep on inactivity

---

## 🚀 Future Improvements

* 📁 Multi-file sharing (folder upload)
* 📊 Analytics dashboard
* 📱 QR code sharing
* 🔄 Resume upload support
* 🎨 Advanced UI (Tailwind CSS)
* 🔐 User authentication system

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork and submit PRs.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Himanshu Tiwari
Full Stack Developer

---

⭐ If you like this project, don’t forget to star the repo!
