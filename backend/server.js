const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const sequelize = require('./config/database');

const app = express();

// ✅ Enable CORS for all requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Setup Multer for File Uploads (stores in /uploads)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
    }
});

const upload = multer({ storage });

// ✅ File Upload API (Handles DICOM File Uploads)
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    res.json({
        message: "File uploaded successfully",
        filename: req.file.filename,
        filePath: `/uploads/${req.file.filename}`
    });
});

// ✅ GraphQL API Setup
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });

    sequelize.sync().then(() => {
        console.log("✅ Database connected.");
        app.listen(4000, () => {
            console.log('🚀 Server running on http://localhost:4000/graphql');
        });
    });
}

startServer();
