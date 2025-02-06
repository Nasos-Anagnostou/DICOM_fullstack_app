const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const sequelize = require('./config/database');
const DicomFile = require('./models/DicomFile');

const app = express();

// ✅ Enable CORS for all requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Setup Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames
    }
});

const upload = multer({ storage });

// ✅ File Upload API (Uses Correct Python Execution)
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(uploadDir, req.file.filename);

    exec(`/app/venv/bin/python3 scripts/process_dicom.py "${filePath}"`, (error, stdout) => {
        if (error) {
            console.error("❌ Error processing DICOM file:", error);
            return res.status(500).json({ error: "Failed to process DICOM file" });
        }

        try {
            const metadata = JSON.parse(stdout);

            DicomFile.create({
                filename: req.file.filename,
                patientName: metadata.patientName || "Unknown",
                birthDate: metadata.birthDate || "N/A",
                seriesDescription: metadata.seriesDescription || "N/A",
                filePath: `/uploads/${req.file.filename}`
            }).then(() => {
                res.json({
                    message: "File uploaded and processed successfully",
                    metadata
                });
            }).catch(err => {
                console.error("❌ Database Error:", err);
                res.status(500).json({ error: "Failed to save metadata to database" });
            });

        } catch (parseError) {
            console.error("❌ JSON Parse Error:", parseError);
            res.status(500).json({ error: "Failed to parse DICOM metadata" });
        }
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
